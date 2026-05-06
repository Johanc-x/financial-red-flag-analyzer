import { useState } from "react";
import { LineChart, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/ui/google-icon";

interface Props {
  onLoginSuccess: () => void;
}

export function LoginScreen({ onLoginSuccess }: Props) {
  const [username, setUsername] = useState("johancr.econ@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const showComingSoon = () => {
    setError("");
    setNotice("Registration will be available in the next version.");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      onLoginSuccess();
    } catch (err) {
      console.error(err);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(108,99,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(108,99,255,0.10),transparent_35%)]" />

      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <section className="hidden lg:block space-y-7">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-[image:var(--gradient-primary)] flex items-center justify-center text-primary-foreground shadow-[var(--shadow-soft)]">
              <LineChart className="size-8" />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tight leading-tight">
                Financial Red Flag
              </h1>
              <h2 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-[image:var(--gradient-primary)]">
                Analyzer
              </h2>
            </div>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            Secure access to a financial analysis dashboard that combines
            rule-based detection, backend validation, and machine learning risk
            classification.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
            <div className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-sm">
              <ShieldCheck className="size-5 text-primary mb-2" />
              <p className="font-medium text-sm">JWT secured</p>
              <p className="text-xs text-muted-foreground mt-1">
                Protected backend endpoints.
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-sm">
              <LineChart className="size-5 text-primary mb-2" />
              <p className="font-medium text-sm">Financial ratios</p>
              <p className="text-xs text-muted-foreground mt-1">
                Metrics, patterns, and risk score.
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-sm">
              <Sparkles className="size-5 text-primary mb-2" />
              <p className="font-medium text-sm">ML service</p>
              <p className="text-xs text-muted-foreground mt-1">
                Python FastAPI model integration.
              </p>
            </div>
          </div>
        </section>

        <Card className="w-full max-w-md mx-auto border-border/70 shadow-[var(--shadow-soft)] bg-card/95 backdrop-blur">
          <CardContent className="p-8">
            <div className="text-center mb-7">
              <div className="mx-auto size-14 rounded-2xl bg-[image:var(--gradient-primary)] flex items-center justify-center text-primary-foreground shadow-[var(--shadow-soft)] mb-4">
                <LineChart className="size-7" />
              </div>

              <h2 className="text-2xl font-bold tracking-tight">
                Iniciar sesión
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Bienvenido a Financial Red Flag Analyzer.
              </p>

              <p className="text-xs text-muted-foreground mt-3">
                ¿No tienes una cuenta?{" "}
                <button
                  type="button"
                  onClick={showComingSoon}
                  className="text-primary font-medium hover:underline"
                >
                  Registrarse
                </button>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Correo electrónico</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Introduce tu correo"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password">Contraseña</Label>
                  <button
                    type="button"
                    onClick={showComingSoon}
                    className="text-xs text-primary hover:underline"
                  >
                    ¿Has olvidado tu contraseña?
                  </button>
                </div>

                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduce tu contraseña"
                  autoComplete="current-password"
                />
              </div>

              {notice && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                  {notice}
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[image:var(--gradient-primary)] hover:opacity-95 transition-opacity"
                disabled={loading}
              >
                <Lock className="size-4" />
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
                onClick={showComingSoon}
              >
                <GoogleIcon />
                Iniciar sesión con Google
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Al iniciar sesión, aceptas los términos y condiciones del entorno
              demo.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}