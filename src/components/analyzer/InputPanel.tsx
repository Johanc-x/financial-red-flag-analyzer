import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Sparkles, Droplets, TrendingDown } from "lucide-react";
import type { FinancialInput } from "@/lib/analyzer";

interface Props {
  onRun: (data: FinancialInput) => void;
}

type FormState = {
  revenue: string;
  costs: string;
  ebitda: string;
  cashFlow: string;
  debt: string;
  equity: string;
  revenueSeries: string;
  ebitdaSeries: string;
  cashFlowSeries: string;
};

const emptyForm: FormState = {
  revenue: "",
  costs: "",
  ebitda: "",
  cashFlow: "",
  debt: "",
  equity: "",
  revenueSeries: "",
  ebitdaSeries: "",
  cashFlowSeries: "",
};

const presets: Record<string, { label: string; icon: typeof Sparkles; description: string; data: FormState }> = {
  healthy: {
    label: "Healthy Business",
    icon: Sparkles,
    description: "Steady growth, strong margins, balanced leverage.",
    data: {
      revenue: "1500000",
      costs: "1050000",
      ebitda: "330000",
      cashFlow: "260000",
      debt: "300000",
      equity: "700000",
      revenueSeries: "1200000, 1300000, 1400000, 1500000",
      ebitdaSeries: "240000, 270000, 300000, 330000",
      cashFlowSeries: "180000, 210000, 235000, 260000",
    },
  },
  liquidity: {
    label: "Liquidity Pressure",
    icon: Droplets,
    description: "Profit on paper, cash flow under strain.",
    data: {
      revenue: "1200000",
      costs: "950000",
      ebitda: "180000",
      cashFlow: "-40000",
      debt: "600000",
      equity: "350000",
      revenueSeries: "950000, 1020000, 1110000, 1200000",
      ebitdaSeries: "210000, 200000, 190000, 180000",
      cashFlowSeries: "60000, 30000, -10000, -40000",
    },
  },
  leverage: {
    label: "High Leverage Risk",
    icon: TrendingDown,
    description: "Heavy debt load and compressing margins.",
    data: {
      revenue: "2000000",
      costs: "1750000",
      ebitda: "180000",
      cashFlow: "60000",
      debt: "1800000",
      equity: "300000",
      revenueSeries: "1600000, 1750000, 1880000, 2000000",
      ebitdaSeries: "260000, 230000, 200000, 180000",
      cashFlowSeries: "150000, 120000, 90000, 60000",
    },
  },
};

const parseSeries = (s: string): number[] | undefined => {
  const parts = s
    .split(/[,;\s]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
  return parts.length ? parts : undefined;
};

export function InputPanel({ onRun }: Props) {
  const [form, setForm] = useState<FormState>(presets.liquidity.data);

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const buildInput = (f: FormState): FinancialInput => ({
    revenue: Number(f.revenue) || 0,
    costs: Number(f.costs) || 0,
    ebitda: Number(f.ebitda) || 0,
    cashFlow: Number(f.cashFlow) || 0,
    debt: Number(f.debt) || 0,
    equity: Number(f.equity) || 0,
    revenueSeries: parseSeries(f.revenueSeries),
    ebitdaSeries: parseSeries(f.ebitdaSeries),
    cashFlowSeries: parseSeries(f.cashFlowSeries),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onRun(buildInput(form));
  };

  const applyPreset = (key: keyof typeof presets) => {
    const data = presets[key].data;
    setForm(data);
    onRun(buildInput(data));
  };

  const reset = () => setForm(emptyForm);

  const fields: { key: keyof FormState; label: string }[] = [
    { key: "revenue", label: "Revenue" },
    { key: "costs", label: "Costs" },
    { key: "ebitda", label: "EBITDA" },
    { key: "cashFlow", label: "Cash Flow" },
    { key: "debt", label: "Debt" },
    { key: "equity", label: "Equity" },
  ];

  return (
    <Card className="shadow-[var(--shadow-soft)] border-border/60">
      <CardHeader>
        <CardTitle className="text-xl">Financial Input</CardTitle>
        <CardDescription>Enter user-provided figures or load a scenario preset. All values are processed locally.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Scenario presets</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(Object.keys(presets) as Array<keyof typeof presets>).map((key) => {
              const p = presets[key];
              const Icon = p.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyPreset(key)}
                  className="text-left p-3 rounded-lg border border-border/70 bg-card hover:bg-accent hover:border-primary/40 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="size-4 text-primary" />
                    <span className="font-medium text-sm">{p.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">{p.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key}>{f.label}</Label>
                <Input
                  id={f.key}
                  type="number"
                  inputMode="decimal"
                  value={form[f.key]}
                  onChange={update(f.key)}
                  placeholder="0"
                />
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-2 border-t border-border/60">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Time series (optional, comma-separated)</p>
            <div className="space-y-1.5">
              <Label htmlFor="revenueSeries">Revenue periods</Label>
              <Input id="revenueSeries" value={form.revenueSeries} onChange={update("revenueSeries")} placeholder="e.g. 800, 900, 1000, 1100" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ebitdaSeries">EBITDA periods</Label>
              <Input id="ebitdaSeries" value={form.ebitdaSeries} onChange={update("ebitdaSeries")} placeholder="e.g. 200, 190, 180, 170" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cashFlowSeries">Cash flow periods</Label>
              <Input id="cashFlowSeries" value={form.cashFlowSeries} onChange={update("cashFlowSeries")} placeholder="e.g. 60, 30, -10, -40" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1 bg-[image:var(--gradient-primary)] hover:opacity-95 transition-opacity">
              <Play className="size-4" />
              Run Analysis
            </Button>
            <Button type="button" variant="outline" onClick={reset}>
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
