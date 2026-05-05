export interface FinancialInput {
  revenue: number;
  costs: number;
  ebitda: number;
  cashFlow: number;
  debt: number;
  equity: number;
  // Optional time series (comma separated values in UI)
  revenueSeries?: number[];
  ebitdaSeries?: number[];
  cashFlowSeries?: number[];
}

export interface Metrics {
  ebitdaMargin: number;
  netMargin: number;
  debtRatio: number;
  debtToEquity: number;
  cashConversion: number;
  operatingMargin: number;
}

export type RedFlagSeverity = "low" | "medium" | "high";

export interface RedFlag {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  severity: RedFlagSeverity;
}

export interface AnalysisResult {
  metrics: Metrics;
  redFlags: RedFlag[];
  riskScore: number;
  summary: string;
  trend: { period: string; revenue: number; costs: number; ebitda: number; cashFlow: number }[];
}

const safeDiv = (a: number, b: number) => (b === 0 ? 0 : a / b);

export function calculateMetrics(input: FinancialInput): Metrics {
  const netIncome = input.ebitda * 0.65; // simplified proxy
  return {
    ebitdaMargin: safeDiv(input.ebitda, input.revenue) * 100,
    netMargin: safeDiv(netIncome, input.revenue) * 100,
    debtRatio: safeDiv(input.debt, input.debt + input.equity) * 100,
    debtToEquity: safeDiv(input.debt, input.equity),
    cashConversion: safeDiv(input.cashFlow, input.ebitda) * 100,
    operatingMargin: safeDiv(input.revenue - input.costs, input.revenue) * 100,
  };
}

function stdDev(arr: number[]): number {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const v = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length;
  return Math.sqrt(v);
}

function trendDirection(arr: number[]): number {
  if (arr.length < 2) return 0;
  return (arr[arr.length - 1] - arr[0]) / Math.abs(arr[0] || 1);
}

export function detectRedFlags(input: FinancialInput, m: Metrics): RedFlag[] {
  const flags: RedFlag[] = [];

  if (input.ebitda > 0 && input.cashFlow < 0) {
    flags.push({
      id: "ebitda-vs-cash",
      title: "Positive EBITDA with negative cash flow",
      description:
        "Reported EBITDA is positive while operating cash flow is negative. This divergence may indicate working capital strain or non-cash earnings components worth reviewing.",
      whyItMatters:
        "Profits on paper don't pay bills — cash does. Persistent gaps between EBITDA and cash flow can signal aggressive revenue recognition, ballooning receivables, or inventory build-up that erodes liquidity.",
      severity: "high",
    });
  }

  if (m.debtToEquity > 2) {
    flags.push({
      id: "debt-equity",
      title: "High debt relative to equity",
      description: `Debt-to-equity ratio of ${m.debtToEquity.toFixed(2)} exceeds typical thresholds, suggesting elevated leverage that may merit further review.`,
      whyItMatters:
        "High leverage amplifies both returns and losses. It increases interest burden, reduces financial flexibility, and makes the business more vulnerable to revenue shocks or rate hikes.",
      severity: m.debtToEquity > 4 ? "high" : "medium",
    });
  }

  if (m.ebitdaMargin > 0 && m.cashConversion < 30) {
    flags.push({
      id: "low-cash-conversion",
      title: "Low cash conversion",
      description: `Only ${m.cashConversion.toFixed(0)}% of EBITDA is converting to cash, which may indicate quality-of-earnings considerations.`,
      whyItMatters:
        "Low cash conversion suggests earnings quality issues — profits may be tied up in working capital or non-cash items. Sustained low conversion can lead to liquidity shortfalls despite reported profitability.",
      severity: "medium",
    });
  }

  if (input.costs > input.revenue) {
    flags.push({
      id: "cost-exceeds-revenue",
      title: "Costs exceed revenue",
      description:
        "Total costs are greater than revenue, resulting in operating losses. Review cost structure and pricing assumptions.",
      whyItMatters:
        "Operating at a structural loss depletes equity and forces reliance on external financing. Without a clear path to break-even, this trajectory is unsustainable.",
      severity: "high",
    });
  }

  if (m.ebitdaMargin < 0) {
    flags.push({
      id: "negative-ebitda",
      title: "Negative EBITDA margin",
      description: "EBITDA is negative relative to revenue, indicating operating-level unprofitability.",
      whyItMatters:
        "Negative EBITDA means the core business loses money before financing and tax effects. It signals fundamental issues in pricing, cost structure, or scale.",
      severity: "high",
    });
  }

  // Time-series checks
  const rs = input.revenueSeries ?? [];
  const es = input.ebitdaSeries ?? [];

  if (rs.length >= 3) {
    const sd = stdDev(rs);
    const mean = rs.reduce((a, b) => a + b, 0) / rs.length;
    const cv = mean === 0 ? 0 : sd / Math.abs(mean);
    if (cv < 0.01) {
      flags.push({
        id: "unusual-stability",
        title: "Unusually stable revenue series",
        description:
          "Revenue values show near-zero variation across periods, which is uncommon for operating businesses and may warrant verification.",
        whyItMatters:
          "Real businesses rarely show perfectly flat revenue across periods. Such stability can indicate smoothed, estimated, or fabricated data — or a highly contractual model worth confirming.",
        severity: "low",
      });
    }
    if (cv > 0.6) {
      flags.push({
        id: "high-volatility",
        title: "High revenue volatility",
        description: "Revenue varies sharply across periods. Consider whether this reflects seasonality, one-offs, or data inconsistencies.",
        whyItMatters:
          "Volatile revenue makes forecasting and capital planning difficult and can mask underlying performance trends. It often signals customer concentration, project-based income, or reporting inconsistencies.",
        severity: "medium",
      });
    }
  }

  if (rs.length >= 2 && es.length >= 2) {
    const revTrend = trendDirection(rs);
    const ebTrend = trendDirection(es);
    if (revTrend > 0.1 && ebTrend < -0.1) {
      flags.push({
        id: "diverging-trends",
        title: "Revenue rising while EBITDA falls",
        description:
          "Revenue is trending upward while EBITDA is trending downward. This margin compression pattern is worth investigating.",
        whyItMatters:
          "Growing revenue with shrinking profitability often indicates pricing pressure, rising input costs, or unprofitable customer acquisition — growth that destroys rather than creates value.",
        severity: "medium",
      });
    }
  }

  return flags;
}

export function computeRiskScore(flags: RedFlag[], m: Metrics): number {
  let score = 0;
  for (const f of flags) {
    score += f.severity === "high" ? 25 : f.severity === "medium" ? 14 : 6;
  }
  if (m.debtToEquity > 1) score += Math.min(15, (m.debtToEquity - 1) * 5);
  if (m.ebitdaMargin < 5) score += 8;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function buildSummary(flags: RedFlag[], score: number, m: Metrics): string {
  if (flags.length === 0) {
    return `No notable inconsistencies were detected in the provided data. Key indicators appear internally consistent (EBITDA margin ${m.ebitdaMargin.toFixed(1)}%, debt-to-equity ${m.debtToEquity.toFixed(2)}). This tool identifies unusual financial patterns that may require further analysis.`;
  }
  const high = flags.filter((f) => f.severity === "high").length;
  const med = flags.filter((f) => f.severity === "medium").length;
  return `The analysis surfaced ${flags.length} pattern${flags.length > 1 ? "s" : ""} of interest (${high} high, ${med} medium severity) and an overall inconsistency score of ${score}/100. Key items to review include ${flags
    .slice(0, 2)
    .map((f) => `"${f.title.toLowerCase()}"`)
    .join(" and ")}. This tool identifies unusual financial patterns that may require further analysis.`;
}

export function buildTrend(input: FinancialInput) {
  const rs = input.revenueSeries ?? [input.revenue];
  const es = input.ebitdaSeries ?? [input.ebitda];
  const cs = input.cashFlowSeries ?? [input.cashFlow];
  const len = Math.max(rs.length, es.length, cs.length);
  return Array.from({ length: len }, (_, i) => ({
    period: `P${i + 1}`,
    revenue: rs[i] ?? rs[rs.length - 1],
    costs: (rs[i] ?? input.revenue) * (input.costs / (input.revenue || 1)),
    ebitda: es[i] ?? es[es.length - 1],
    cashFlow: cs[i] ?? cs[cs.length - 1],
  }));
}

export function analyze(input: FinancialInput): AnalysisResult {
  const metrics = calculateMetrics(input);
  const redFlags = detectRedFlags(input, metrics);
  const riskScore = computeRiskScore(redFlags, metrics);
  const summary = buildSummary(redFlags, riskScore, metrics);
  const trend = buildTrend(input);
  return { metrics, redFlags, riskScore, summary, trend };
}

export async function analyzeWithBackend(input: FinancialInput, token?: string): Promise<AnalysisResult> {
  const response = await fetch("http://localhost:8081/api/analysis", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      revenue: input.revenue,
      costs: input.costs,
      ebitda: input.ebitda,
      cashFlow: input.cashFlow,
      debt: input.debt,
      equity: input.equity,
    }),
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  const backend = await response.json();

  const local = analyze(input);

  return {
    ...local,
    riskScore: backend.riskScore ?? local.riskScore,
    summary: backend.mlSummary ?? backend.summary ?? local.summary,
    metrics: {
      ...local.metrics,
      ebitdaMargin: backend.ebitdaMargin ?? local.metrics.ebitdaMargin,
      debtToEquity: backend.debtToEquity ?? local.metrics.debtToEquity,
      cashConversion: backend.cashConversion ?? local.metrics.cashConversion,
    },
  };
}