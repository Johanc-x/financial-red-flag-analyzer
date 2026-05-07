import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { analyzeWithBackend, type AnalysisResult, type FinancialInput } from "@/lib/analyzer";
import { InputPanel } from "@/components/analyzer/InputPanel";
import { MetricsGrid } from "@/components/analyzer/MetricsGrid";
import { RedFlagsPanel } from "@/components/analyzer/RedFlagsPanel";
import { RiskScore } from "@/components/analyzer/RiskScore";
import { Charts } from "@/components/analyzer/Charts";
import { ExecutiveSummary } from "@/components/analyzer/ExecutiveSummary";
import { ScopeNotice } from "@/components/analyzer/ScopeNotice";
import { LineChart, Sparkles } from "lucide-react";
import { LoginScreen } from "@/components/analyzer/LoginScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Financial Red Flag Analyzer — Analytical Decision Support" },
      {
        name: "description",
        content:
          "Analyze user-provided financial data to identify unusual patterns, inconsistencies, and risk signals. Decision-support tool — not an audit.",
      },
      { property: "og:title", content: "Financial Red Flag Analyzer" },
      {
        property: "og:description",
        content: "Surface inconsistencies in financial data with metrics, red flags, and an inconsistency score.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("token") !== null;
});
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleRun = async (data: FinancialInput) => {
  try {
    const result = await analyzeWithBackend(data, sessionStorage.getItem("token") ?? undefined);
    setResult(result);
  } catch (error) {
    console.error("Error calling backend:", error);
    alert("Backend connection failed. Please login or check that the backend and ML service are running.");
  }

  requestAnimationFrame(() => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
};

  const hasResult = useMemo(() => result !== null, [result]);

  if (!isAuthenticated) {
  return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
}

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-[image:var(--gradient-primary)] flex items-center justify-center text-primary-foreground shadow-[var(--shadow-soft)]">
              <LineChart className="size-5" />
            </div>
            <div>
              <h1 className="font-semibold text-base sm:text-lg leading-tight">Financial Red Flag Analyzer</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Decision support for unusual financial patterns</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
           <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground border border-border/70 rounded-full px-3 py-1">
              <Sparkles className="size-3 text-primary" />
              Analytical preview
            </span>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.removeItem("token");
                }
                setIsAuthenticated(false);
                setResult(null);
              }}
              className="text-xs font-medium border border-border/70 rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Decision support · Analytical tool</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-3">
            Identify unusual patterns in <span className="bg-clip-text text-transparent bg-[image:var(--gradient-primary)]">user-provided</span> financial data
          </h2>
          <p className="text-muted-foreground mt-3 text-base leading-relaxed">
            Enter financial figures to compute key ratios, surface inconsistencies, and obtain an indicative inconsistency score.
            This tool is not a fraud detector and does not perform audits.
          </p>
        </div>
      </section>

      {/* Main grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-24">
              <InputPanel onRun={handleRun} />
            </div>
          </div>

          <div ref={resultsRef} className="lg:col-span-7 xl:col-span-8 space-y-6 scroll-mt-24">
            {!hasResult ? (
              <div className="rounded-xl border border-dashed border-border bg-card/40 p-10 text-center">
                <div className="mx-auto size-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center mb-4">
                  <LineChart className="size-6" />
                </div>
                <h3 className="font-semibold text-lg">Awaiting input</h3>
                <p className="text-muted-foreground text-sm mt-1 max-w-md mx-auto">
                  Pick a scenario preset or fill the form, then click <span className="font-medium text-foreground">Run Analysis</span> to view metrics, red flags, and visualizations.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-primary font-semibold">Results dashboard</p>
                    <h3 className="text-2xl font-bold tracking-tight mt-1">Analysis output</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">{result!.redFlags.length} pattern{result!.redFlags.length === 1 ? "" : "s"} detected</span>
                </div>
                <RiskScore score={result!.riskScore} />
                <MetricsGrid metrics={result!.metrics} />
                <Charts data={result!.trend} />
                <RedFlagsPanel flags={result!.redFlags} />
                <ExecutiveSummary summary={result!.summary} />
              </>
            )}
            <ScopeNotice />
          </div>
        </div>
      </main>

      <footer className="border-t border-border/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-xs text-muted-foreground text-center">
          Financial Red Flag Analyzer · Analytical and educational use only · No external data sources.
        </div>
      </footer>
    </div>
  );
}
