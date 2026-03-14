import React, { useState } from "react";
import {
  User, Mail, Lock, Eye, EyeOff, ArrowLeft,
  Github, Chrome, Sparkles, Zap,
  ArrowRight, ShieldCheck,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient.js";
import { useNavigate } from "react-router-dom";

function PasswordStrength({ password }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];
  if (!password) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            height: 3, flex: 1, borderRadius: 99, transition: "background 0.3s",
            background: i < score ? colors[score] : "#e5e7eb",
          }} />
        ))}
      </div>
      <p style={{ fontSize: 11.5, fontWeight: 600, color: colors[score] || "#9ca3af", margin: 0 }}>
        {labels[score] || "Too short"}
      </p>
    </div>
  );
}

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const navigate = useNavigate();

  const update = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 6) e.password = "At least 6 characters";
    if (isSignUp) {
      if (!formData.name) e.name = "Name is required";
      if (!formData.confirmPassword) e.confirmPassword = "Please confirm your password";
      else if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords don't match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      let data, error;
      if (isSignUp) {
        ({ data, error } = await supabase.auth.signUp({
          email: formData.email, password: formData.password,
          options: { data: { name: formData.name } },
        }));
      } else {
        ({ data, error } = await supabase.auth.signInWithPassword({
          email: formData.email, password: formData.password,
        }));
      }
      if (error) throw error;
      if (isSignUp) { data.session ? navigate("/dashboard") : setSignUpSuccess(true); }
      else { if (data.session) navigate("/dashboard"); }
    } catch (err) {
      setErrors({ general: err.message || "Something went wrong." });
    } finally { setIsLoading(false); }
  };

  const handleSocialAuth = async (provider) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider, options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) throw error;
    } catch (err) {
      setErrors({ general: `${provider} sign-in failed: ${err.message}` });
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignUp(v => !v);
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
  };

  const inputCls = (hasErr) => `auth-input${hasErr ? " auth-input-err" : ""}`;

  /* ── Success ── */
  if (signUpSuccess) {
    return (
      <div className="auth-page">
        <style>{CSS}</style>
        <div className="auth-success-card auth-card-enter">
          <div className="auth-success-icon"><Sparkles size={28} color="#fff" /></div>
          <span className="auth-success-badge">Account created ✓</span>
          <h2 className="auth-success-title">Check your inbox!</h2>
          <p className="auth-success-body">
            We sent a confirmation link to{" "}
            <strong style={{ color: "#f97316" }}>{formData.email}</strong>.
            Click it to activate your account.
          </p>
          <button onClick={() => { setSignUpSuccess(false); setIsSignUp(false); }} className="auth-primary-btn">
            Back to Sign In <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <style>{CSS}</style>

      {/* Top bar */}
      <div className="auth-topbar">
        <button onClick={() => navigate("/")} className="auth-logo">
          <div className="auth-logo-icon"><Zap size={16} color="#fff" /></div>
          <span className="auth-logo-text">ResumeAI</span>
          <span className="auth-logo-badge">PRO</span>
        </button>
        <button onClick={() => navigate("/")} className="auth-back-btn">
          <ArrowLeft size={14} /> Back to home
        </button>
      </div>

      {/* Centered form */}
      <div className="auth-form-area">
        <div className="auth-form-card auth-card-enter">

          {/* Mode tabs */}
          <div className="auth-tabs">
            {["Sign In", "Sign Up"].map((label, idx) => (
              <button key={label}
                onClick={() => isSignUp !== (idx === 1) && switchMode()}
                className={`auth-tab${isSignUp === (idx === 1) ? " auth-tab-active" : ""}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="auth-form-heading">
            <h2 className="auth-form-title">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="auth-form-subtitle">
              {isSignUp ? "Start building AI-powered resumes for free" : "Sign in to continue to your dashboard"}
            </p>
          </div>

          {/* Social */}
          <div className="auth-social-row">
            {[
              { provider: "google", label: "Google", icon: Chrome, color: "#ea4335" },
              { provider: "github", label: "GitHub", icon: Github, color: "#24292e" },
            ].map(({ provider, label, icon: Icon, color }) => (
              <button key={provider} onClick={() => handleSocialAuth(provider)}
                disabled={isLoading} className="auth-social-btn">
                <Icon size={16} color={color} />
                <span>Continue with {label}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or use email</span>
            <div className="auth-divider-line" />
          </div>

          {/* Error banner */}
          {errors.general && (
            <div className="auth-error-banner">
              <ShieldCheck size={14} /> {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {isSignUp && (
              <div className="auth-field">
                <label className="auth-label">Full name</label>
                <div className="auth-input-wrap">
                  <User size={15} color={errors.name ? "#ef4444" : "#d97706"} className="auth-input-icon" />
                  <input type="text" placeholder="Jane Smith" value={formData.name}
                    onChange={e => update("name", e.target.value)} disabled={isLoading}
                    className={inputCls(errors.name)} />
                </div>
                {errors.name && <p className="auth-field-error">{errors.name}</p>}
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <div className="auth-input-wrap">
                <Mail size={15} color={errors.email ? "#ef4444" : "#d97706"} className="auth-input-icon" />
                <input type="email" placeholder="jane@example.com" value={formData.email}
                  onChange={e => update("email", e.target.value)} disabled={isLoading}
                  className={inputCls(errors.email)} />
              </div>
              {errors.email && <p className="auth-field-error">{errors.email}</p>}
            </div>

            <div className="auth-field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="auth-label">Password</label>
                {!isSignUp && <button type="button" className="auth-forgot">Forgot password?</button>}
              </div>
              <div className="auth-input-wrap">
                <Lock size={15} color={errors.password ? "#ef4444" : "#d97706"} className="auth-input-icon" />
                <input type={showPassword ? "text" : "password"}
                  placeholder={isSignUp ? "Min. 6 characters" : "Your password"}
                  value={formData.password} onChange={e => update("password", e.target.value)}
                  disabled={isLoading} className={`${inputCls(errors.password)} auth-input-pr`} />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="auth-eye-btn">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {isSignUp && <PasswordStrength password={formData.password} />}
              {errors.password && <p className="auth-field-error">{errors.password}</p>}
            </div>

            {isSignUp && (
              <div className="auth-field">
                <label className="auth-label">Confirm password</label>
                <div className="auth-input-wrap">
                  <Lock size={15} color={errors.confirmPassword ? "#ef4444" : "#d97706"} className="auth-input-icon" />
                  <input type={showConfirmPw ? "text" : "password"} placeholder="Same as above"
                    value={formData.confirmPassword} onChange={e => update("confirmPassword", e.target.value)}
                    disabled={isLoading} className={`${inputCls(errors.confirmPassword)} auth-input-pr`} />
                  <button type="button" onClick={() => setShowConfirmPw(v => !v)} className="auth-eye-btn">
                    {showConfirmPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="auth-field-error">{errors.confirmPassword}</p>}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="auth-submit-btn">
              {isLoading ? (
                <><div className="auth-spinner" />{isSignUp ? "Creating account…" : "Signing in…"}</>
              ) : (
                <>{isSignUp ? "Create free account" : "Sign in"}<ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="auth-toggle-text">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button onClick={switchMode} disabled={isLoading} className="auth-toggle-link">
              {isSignUp ? "Sign in" : "Sign up — it's free"}
            </button>
          </p>

          {/* Trust */}
          <div className="auth-trust">
            <ShieldCheck size={13} color="#a3a3a3" />
            <span className="auth-trust-text">256-bit SSL encryption · No credit card required</span>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── CSS ──────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes cardEnter { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }

  .auth-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: 'DM Sans', system-ui, sans-serif;
    background: #fafaf9;
  }

  .auth-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 32px;
    border-bottom: 1px solid #f0ede8;
    background: #fff;
  }

  .auth-logo { display: flex; align-items: center; gap: 10px; background: none; border: none; cursor: pointer; padding: 0; }
  .auth-logo-icon { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg,#f97316,#dc2626); display:flex; align-items:center; justify-content:center; box-shadow: 0 3px 10px rgba(249,115,22,0.45); transition: transform 0.2s; }
  .auth-logo:hover .auth-logo-icon { transform: scale(1.05); }
  .auth-logo-text { color: #1c0a00; font-weight: 800; font-size: 16px; letter-spacing: -0.02em; }
  .auth-logo-badge { background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.3); color: #f97316; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; padding: 2px 7px; border-radius: 99px; }

  .auth-back-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; color: #a8a29e; font-size: 13px; font-weight: 500; padding: 0; font-family: inherit; transition: color 0.2s; }
  .auth-back-btn:hover { color: #292524; }

  .auth-card-enter { animation: cardEnter 0.5s cubic-bezier(0.22,1,0.36,1) both; }

  .auth-form-area { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
  .auth-form-card { width: 100%; max-width: 420px; display: flex; flex-direction: column; }

  .auth-tabs { display: flex; background: #f0ece7; border-radius: 12px; padding: 4px; margin-bottom: 28px; }
  .auth-tab { flex: 1; padding: 9px 0; border: none; background: none; border-radius: 9px; font-size: 13.5px; font-weight: 600; color: #a8a29e; cursor: pointer; transition: all 0.2s; font-family: inherit; }
  .auth-tab-active { background: #fff; color: #1c0a00; box-shadow: 0 1px 6px rgba(0,0,0,0.1); }

  .auth-form-heading { margin-bottom: 24px; }
  .auth-form-title { font-size: 26px; font-weight: 800; color: #1c0a00; letter-spacing: -0.025em; margin: 0 0 6px; }
  .auth-form-subtitle { font-size: 13.5px; color: #78716c; margin: 0; }

  .auth-social-row { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  .auth-social-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 11px 16px; background: #fff; border: 1.5px solid #e7e4df; border-radius: 12px; font-size: 13.5px; font-weight: 600; color: #292524; cursor: pointer; transition: all 0.18s; box-shadow: 0 1px 3px rgba(0,0,0,0.04); font-family: inherit; }
  .auth-social-btn:hover:not(:disabled) { background: #f9f7f5; border-color: #d0cbc4; transform: translateY(-1px); box-shadow: 0 3px 10px rgba(0,0,0,0.07); }
  .auth-social-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .auth-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .auth-divider-line { flex: 1; height: 1px; background: #e7e4df; }
  .auth-divider-text { font-size: 12px; color: #a8a29e; font-weight: 500; white-space: nowrap; }

  .auth-error-banner { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; font-size: 13px; color: #dc2626; font-weight: 500; margin-bottom: 16px; }

  .auth-form { display: flex; flex-direction: column; gap: 16px; }
  .auth-field { display: flex; flex-direction: column; gap: 6px; }
  .auth-label { font-size: 13px; font-weight: 600; color: #44403c; display: block; }
  .auth-input-wrap { position: relative; }
  .auth-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; z-index: 1; }
  .auth-input {
    width: 100%; padding: 11px 16px 11px 40px;
    background: #fff; border: 1.5px solid #e7e4df; border-radius: 12px;
    font-size: 14px; color: #1c0a00; outline: none; font-family: inherit;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .auth-input:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.12); }
  .auth-input::placeholder { color: #c4bdb8; }
  .auth-input:disabled { opacity: 0.6; cursor: not-allowed; background: #f9f7f5; }
  .auth-input-err { border-color: #fca5a5 !important; background: #fff8f8 !important; }
  .auth-input-pr { padding-right: 44px; }

  .auth-eye-btn { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #a8a29e; display: flex; align-items: center; padding: 2px; transition: color 0.2s; }
  .auth-eye-btn:hover { color: #57534e; }
  .auth-field-error { font-size: 12px; color: #ef4444; margin: 0; font-weight: 500; }
  .auth-forgot { font-size: 12px; color: #f97316; font-weight: 600; background: none; border: none; cursor: pointer; padding: 0; font-family: inherit; }
  .auth-forgot:hover { color: #ea6a0a; }

  .auth-submit-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 20px; width: 100%; margin-top: 4px;
    background: linear-gradient(135deg, #f97316 0%, #dc2626 100%);
    border: none; border-radius: 13px; color: #fff; font-size: 14px; font-weight: 700;
    cursor: pointer; letter-spacing: -0.01em; font-family: inherit;
    box-shadow: 0 4px 16px rgba(249,115,22,0.35);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .auth-submit-btn:hover:not(:disabled) { transform: translateY(-1.5px); box-shadow: 0 6px 24px rgba(249,115,22,0.45); }
  .auth-submit-btn:active:not(:disabled) { transform: translateY(0); }
  .auth-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .auth-spinner { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }

  .auth-toggle-text { margin-top: 20px; text-align: center; font-size: 13.5px; color: #78716c; }
  .auth-toggle-link { background: none; border: none; cursor: pointer; color: #f97316; font-weight: 700; font-size: 13.5px; padding: 0; font-family: inherit; transition: color 0.2s; }
  .auth-toggle-link:hover { color: #ea6a0a; }

  .auth-trust { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f0ede8; }
  .auth-trust-text { font-size: 11.5px; color: #a8a29e; font-weight: 500; }

  /* ── Success ── */
  .auth-success-card { background: #fff; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); padding: 52px 48px; max-width: 420px; width: 100%; text-align: center; border: 1px solid #f0ede8; }
  .auth-success-icon { width: 72px; height: 72px; background: linear-gradient(135deg,#f97316,#dc2626); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 8px 24px rgba(249,115,22,0.4); }
  .auth-success-badge { display: inline-block; background: #dcfce7; color: #16a34a; font-size: 12px; font-weight: 700; padding: 3px 12px; border-radius: 99px; margin-bottom: 12px; letter-spacing: 0.03em; }
  .auth-success-title { font-size: 26px; font-weight: 800; color: #1c0a00; margin: 0 0 10px; letter-spacing: -0.02em; }
  .auth-success-body { color: #78716c; font-size: 14px; line-height: 1.7; margin: 0 0 28px; }
  .auth-primary-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(135deg,#f97316,#dc2626); border: none; border-radius: 12px; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 16px rgba(249,115,22,0.35); font-family: inherit; margin: 0 auto; transition: transform 0.2s; }
  .auth-primary-btn:hover { transform: translateY(-1px); }
`;
