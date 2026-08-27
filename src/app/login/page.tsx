"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError(t("auth.fill_all"));
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      router.replace("/");
      router.refresh();
    } else {
      setError(result.error || t("auth.invalid_credentials"));
    }
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />

      <section className="pt-24 pb-12 bg-muted/50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            {t("auth.login_title")}
          </h1>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            {t("auth.login_subtitle")}
          </p>
        </div>
        <img src="/slavic-border.png" alt="" className="absolute bottom-0 left-0 w-full h-6 object-cover opacity-40 pointer-events-none" />
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="border-border">
            <CardHeader className="text-center pb-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <LogIn className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">{t("auth.login_title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md px-3 py-2">{error}</div>
                )}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {t("auth.email")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {t("auth.password")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? t("auth.hide_password") : t("auth.show_password")}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-right">
                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                      {t("auth.forgot_link")}
                    </Link>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                  {loading ? t("auth.logging_in") : t("auth.login_button")}
                </Button>
              </form>

              <Separator className="my-6" />

              <p className="text-center text-sm text-muted-foreground">
                {t("auth.no_account")}{" "}
                <Link href="/signup" className="text-primary font-semibold hover:underline">
                  {t("auth.signup_link")}
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
