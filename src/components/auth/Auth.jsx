import React, { useState } from "react";
import { Button } from "../ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { Label } from "../ui/label.jsx";
import { Separator } from "../ui/separator.jsx";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Github,
  Chrome,
  Sparkles,
  FileText,
  Brain,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient.js";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isSignUp) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) return;

  //   setIsLoading(true);

  //   try {
  //     const { projectId, publicAnonKey } = await import("../utils/supabase/info");
  //     const endpoint = isSignUp ? "signup" : "signin";
  //     const url = `https://${projectId}.supabase.co/functions/v1/make-server-5adc57a2/auth/${endpoint}`;

  //     const payload = isSignUp
  //       ? { email: formData.email, password: formData.password, name: formData.name }
  //       : { email: formData.email, password: formData.password };

  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${publicAnonKey}`,
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.error || "Authentication failed");
  //     }

  //     console.log(`${isSignUp ? "Sign up" : "Sign in"} successful:`, data);

  //     if (!isSignUp && data.session) {
  //       localStorage.setItem("auth_session", JSON.stringify(data.session));
  //       localStorage.setItem("auth_user", JSON.stringify(data.user));
  //     }

  //     onAuthSuccess();
  //   } catch (error) {
  //     console.error("Auth error:", error);
  //     setErrors({ general: error instanceof Error ? error.message : "Authentication failed. Please try again." });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // const { projectId, publicAnonKey } = await import(
      //   "../utils/supabase/info"
      // );
      // const functionName = "make-server-5adc57a2";
      // const endpoint = isSignUp ? "signup" : "signin";
      // // const url = `https://${projectId}.supabase.co/functions/v1/make-server-5adc57a2/auth/${endpoint}`;
      // const url = `https://${projectId}.supabase.co/functions/v1/${functionName}/auth/${endpoint}`;

      // const endpoint = isSignUp ? "signup" : "token?grant_type=password";
      // const url = `https://${projectId}.supabase.co/auth/v1/${endpoint}`;

      // console.log("Calling URL:", url);
      // const payload = isSignUp
      //   ? {
      //       email: formData.email,
      //       password: formData.password,
      //       name: formData.name,
      //     }
      //   : { email: formData.email, password: formData.password };

      // const response = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${publicAnonKey}`,
      //   },
      //   body: JSON.stringify(payload),
      // });

      // // Check if the response is ok first
      // if (!response.ok) {
      //   // Read the response as text to see the server's error message
      //   const errorText = await response.text();
      //   let errorMessage = "Authentication failed. Please try again.";

      //   // Try to parse as JSON in case it's a valid JSON error payload
      //   try {
      //     const errorData = JSON.parse(errorText);
      //     errorMessage = errorData.error || errorMessage;
      //   } catch (jsonError) {
      //     // If parsing fails, use the raw text as the error message
      //     console.error("Server response was not valid JSON:", errorText);
      //     errorMessage = `Server error: ${errorText.substring(0, 100)}...`; // Truncate long messages
      //   }

      //   throw new Error(errorMessage);
      // }

      // If the response is ok, proceed to parse it as JSON
      // const data = await response.json();

      const email = formData.email;
      const password = formData.password;

      let data, error;

      if (isSignUp) {
        // 👇 Sign up new user
        ({ data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: formData.name }, // optional: store name in metadata
          },
        }));
      } else {
        // 👇 Sign in existing user
        ({ data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        }));
      }

      if (error) throw error;

      console.log(`${isSignUp ? "Sign up" : "Sign in"} successful:`, data);

      if (!isSignUp && data.session) {
        localStorage.setItem("auth_session", JSON.stringify(data.session));
        localStorage.setItem("auth_user", JSON.stringify(data.user));
      }

      if (data.session) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setIsLoading(true);
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const { projectId, publicAnonKey } = await import(
        "../../utils/supabase/info.js"
      );

      const supabase = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey
      );

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log(`${provider} auth initiated:`, data);
    } catch (error) {
      console.error(`${provider} auth error:`, error);
      setErrors({
        general: `${provider} authentication failed. Please complete the setup at https://supabase.com/docs/guides/auth/social-login/auth-${provider} or try email authentication.`,
      });
      setIsLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Navigation Header */}
      <div className="border-b bg-card/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <span className="font-semibold">AI Resume Builder</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp
                ? "Start building professional resumes with AI assistance"
                : "Sign in to continue building amazing resumes"}
            </p>
          </div>

          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                {isSignUp ? "Sign Up" : "Sign In"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Social Auth Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialAuth("google")}
                  disabled={isLoading}
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialAuth("github")}
                  disabled={isLoading}
                >
                  <Github className="w-4 h-4 mr-2" />
                  Continue with GitHub
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {errors.general}
                  </div>
                )}

                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        updateFormData("password", e.target.value)
                      }
                      className="pl-10 pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          updateFormData("confirmPassword", e.target.value)
                        }
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isSignUp ? "Creating account..." : "Signing in..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {isSignUp ? "Create Account" : "Sign In"}
                    </div>
                  )}
                </Button>
              </form>

              {/* Toggle between Sign Up and Sign In */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setFormData({
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                      });
                      setErrors({});
                    }}
                    className="ml-1 text-orange-600 hover:text-orange-700 font-medium"
                    disabled={isLoading}
                  >
                    {isSignUp ? "Sign in" : "Sign up"}
                  </button>
                </p>
              </div>

              {isSignUp && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center mb-3">
                    What you'll get:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      AI-powered resume optimization
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      Professional templates
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      ATS-friendly formatting
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
