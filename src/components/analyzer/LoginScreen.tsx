import { useState } from "react";
import { LineChart, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Props {
  onLoginSuccess: () => void;
}

export function LoginScreen({ onLoginSuccess }: Props) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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

      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <section className="hidden lg:block space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <Sparkles className="size-4 text-primary" />
            ML-powered financial decision support
          </div>

          <div>
            <h1 className="text-5xl font-bold tracking-tight leading-tight">
              Financial Red Flag{" "}
              <span className="bg-clip-text text-transparent bg-[image:var(--gradient-primary)]">
                Analyzer
              </span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
              Secure access to a financial analysis dashboard that combines
              rule-based detection, backend validation, and machine learning
              risk classification.
            </p>
          </div>

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

        <Card className="w-full max-w-md mx-auto border-border/70 shadow-[var(--shadow-soft)] bg-card/90 backdrop-blur">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto size-14 rounded-2xl bg-[image:var(--gradient-primary)] flex items-center justify-center text-primary-foreground shadow-[var(--shadow-soft)] mb-4">
                <LineChart className="size-7" />
              </div>

              <h2 className="text-2xl font-bold tracking-tight">
                Welcome back
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Sign in to access the analysis dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>

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
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Demo access protected with JWT authentication.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}