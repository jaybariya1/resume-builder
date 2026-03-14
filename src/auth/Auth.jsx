import React, { useState } from "react";
import {
  User, Mail, Lock, Eye, EyeOff, ArrowLeft,
  Github, Chrome, Sparkles, FileText, Zap,
  CheckCircle, ArrowRight,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient.js";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  { icon: Sparkles,     text: "AI writes your bullets in seconds" },
  { icon: FileText,     text: "5 professional templates included" },
  { icon: Zap,          text: "ATS-optimized formatting built-in" },
  { icon: CheckCircle,  text: "Download as pixel-perfect PDF" },
];

function ResumePreviewCard() {
  return (
    <div className="relative w-52 bg-white rounded-2xl shadow-2xl p-4 text-left flex-shrink-0">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">JD</div>
        <div>
          <div className="h-2 w-20 bg-gray-800 rounded-full" />
          <div className="h-1.5 w-14 bg-orange-400 rounded-full mt-1" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-1.5 w-full bg-gray-200 rounded-full" />
        <div className="h-1.5 w-4/5 bg-gray-200 rounded-full" />
        <div className="h-1.5 w-3/4 bg-gray-200 rounded-full" />
      </div>
      <div className="mt-3 pt-2 border-t border-gray-100 space-y-1">
        <div className="h-1.5 w-1/3 bg-orange-300 rounded-full" />
        <div className="h-1.5 w-full bg-gray-100 rounded-full" />
        <div className="h-1.5 w-5/6 bg-gray-100 rounded-full" />
        <div className="h-1.5 w-4/5 bg-gray-100 rounded-full" />
      </div>
      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
        <Sparkles className="w-2.5 h-2.5" /> AI
      </div>
    </div>
  );
}

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const navigate = useNavigate();

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
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
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      let data, error;
      if (isSignUp) {
        ({ data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { name: formData.name } },
        }));
      } else {
        ({ data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        }));
      }
      if (error) throw error;
      if (isSignUp) {
        data.session ? navigate("/dashboard") : setSignUpSuccess(true);
      } else {
        if (data.session) navigate("/dashboard");
      }
    } catch (err) {
      setErrors({ general: err.message || "Something went wrong." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/dashboard` },
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

  if (signUpSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-orange-100">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Check your inbox!</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            We sent a confirmation link to{" "}
            <span className="font-semibold text-orange-600">{formData.email}</span>.
            Click it to activate your account.
          </p>
          <button
            onClick={() => { setSignUpSuccess(false); setIsSignUp(false); }}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Back to Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">

      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1c0f0a 0%, #3b1207 40%, #7c2d12 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #f97316, transparent)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #fb923c, transparent)", transform: "translate(-30%, 30%)" }} />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)", backgroundSize: "32px 32px" }} />

        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5 group w-fit">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">AI Resume Builder</span>
        </button>

        {/* Headline + features */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Land your dream job
              <span className="block text-orange-400">faster than ever.</span>
            </h1>
            <p className="text-orange-200/70 text-sm leading-relaxed max-w-xs">
              Our AI crafts compelling, ATS-optimized resumes tailored to each role — so recruiters notice you first.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <span className="text-orange-100/80 text-sm">{text}</span>
              </div>
            ))}
          </div>

          {/* Preview card */}
          <div className="flex items-end gap-4">
            <ResumePreviewCard />
            <div className="pb-2 space-y-1">
              <div className="text-orange-400 text-xs font-semibold uppercase tracking-widest">Live preview</div>
              <div className="text-orange-100/60 text-xs max-w-[100px] leading-relaxed">Edit and see changes instantly</div>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {["#f97316","#fb923c","#fdba74","#fcd34d"].map((c, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-[#3b1207] flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                style={{ background: c }}>
                {String.fromCharCode(65 + i * 3)}
              </div>
            ))}
          </div>
          <p className="text-orange-200/60 text-xs">Join thousands building standout resumes</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col bg-[#fffbf7]">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-orange-100">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm text-foreground">AI Resume Builder</span>
          </button>
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">

            {/* Desktop back */}
            <button
              onClick={() => navigate("/")}
              className="hidden lg:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to home
            </button>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-1.5">
                {isSignUp ? "Create account" : "Welcome back"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isSignUp
                  ? "Start building AI-powered resumes for free"
                  : "Sign in to continue to your dashboard"}
              </p>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { provider: "google", label: "Google", icon: Chrome },
                { provider: "github", label: "GitHub", icon: Github },
              ].map(({ provider, label, icon: Icon }) => (
                <button
                  key={provider}
                  onClick={() => handleSocialAuth(provider)}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-orange-200 bg-white text-sm font-medium text-foreground hover:bg-orange-50 hover:border-orange-300 transition-all disabled:opacity-50 shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-orange-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#fffbf7] px-3 text-xs text-muted-foreground">or continue with email</span>
              </div>
            </div>

            {/* Error */}
            {errors.general && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                {errors.general}
              </div>
            )}

            {/* Form fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-300 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Jane Smith"
                      value={formData.name}
                      onChange={e => updateFormData("name", e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-orange-200 bg-white text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-300 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={e => updateFormData("email", e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-orange-200 bg-white text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-300 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={isSignUp ? "Min. 6 characters" : "Your password"}
                    value={formData.password}
                    onChange={e => updateFormData("password", e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-orange-200 bg-white text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-orange-300 hover:text-orange-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-300 pointer-events-none" />
                    <input
                      type="password"
                      placeholder="Same as above"
                      value={formData.confirmPassword}
                      onChange={e => updateFormData("confirmPassword", e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-orange-200 bg-white text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {isSignUp ? "Creating account…" : "Signing in…"}
                  </>
                ) : (
                  <>
                    {isSignUp ? "Create account" : "Sign in"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle mode */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={switchMode}
                disabled={isLoading}
                className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
              >
                {isSignUp ? "Sign in" : "Sign up free"}
              </button>
            </p>

            {/* Sign-up perks */}
            {isSignUp && (
              <div className="mt-6 pt-5 border-t border-orange-100">
                <p className="text-xs text-center text-muted-foreground mb-3 font-medium">What you get for free</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: Sparkles, label: "AI Writing" },
                    { icon: FileText, label: "5 Templates" },
                    { icon: Zap,      label: "PDF Export" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-orange-50 border border-orange-100">
                      <Icon className="w-4 h-4 text-orange-500" />
                      <span className="text-[11px] font-medium text-foreground text-center leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
