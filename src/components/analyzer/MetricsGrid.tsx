import { Card, CardContent } from "@/components/ui/card";
import type { Metrics } from "@/lib/analyzer";
import { TrendingUp, Percent, Scale, Wallet, Activity, Coins } from "lucide-react";

interface Props {
  metrics: Metrics;
}

export function MetricsGrid({ metrics }: Props) {
  const items = [
    { label: "EBITDA Margin", value: `${metrics.ebitdaMargin.toFixed(1)}%`, icon: Percent, accent: metrics.ebitdaMargin >= 10 },
    { label: "Net Margin", value: `${metrics.netMargin.toFixed(1)}%`, icon: TrendingUp, accent: metrics.netMargin >= 5 },
    { label: "Operating Margin", value: `${metrics.operatingMargin.toFixed(1)}%`, icon: Activity, accent: metrics.operatingMargin >= 10 },
    { label: "Debt Ratio", value: `${metrics.debtRatio.toFixed(1)}%`, icon: Scale, accent: metrics.debtRatio <= 50 },
    { label: "Debt / Equity", value: metrics.debtToEquity.toFixed(2), icon: Wallet, accent: metrics.debtToEquity <= 1.5 },
    { label: "Cash Conversion", value: `${metrics.cashConversion.toFixed(0)}%`, icon: Coins, accent: metrics.cashConversion >= 60 },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((it) => (
        <Card key={it.label} className="border-border/60 shadow-[var(--shadow-soft)]">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">{it.label}</p>
                <p className="text-2xl font-semibold mt-1 tracking-tight">{it.value}</p>
              </div>
              <div className={`size-9 rounded-lg flex items-center justify-center ${it.accent ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                <it.icon className="size-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
