import { Card, CardContent } from "@/components/ui/card";

export function RiskScore({ score }: { score: number }) {
  const level = score < 25 ? "Low" : score < 55 ? "Moderate" : score < 80 ? "Elevated" : "High";
  const color = score < 25 ? "var(--success)" : score < 55 ? "var(--primary)" : score < 80 ? "var(--warning)" : "var(--destructive)";
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="border-border/60 shadow-[var(--shadow-elevated)] overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <div className="relative shrink-0">
            <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
              <circle cx="65" cy="65" r="52" stroke="var(--muted)" strokeWidth="10" fill="none" />
              <circle
                cx="65"
                cy="65"
                r="52"
                stroke={color}
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tracking-tight">{score}</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">/ 100</span>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Inconsistency Score</p>
            <p className="text-2xl font-semibold mt-1" style={{ color }}>
              {level}
            </p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              An indicative score combining detected patterns and key ratio thresholds. Higher values suggest more areas worth reviewing.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
