import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info, ShieldCheck } from "lucide-react";
import type { RedFlag } from "@/lib/analyzer";

const severityConfig = {
  high: { icon: AlertTriangle, label: "High", className: "bg-destructive/10 text-destructive border-destructive/20" },
  medium: { icon: AlertCircle, label: "Medium", className: "bg-warning/10 text-warning-foreground border-warning/30" },
  low: { icon: Info, label: "Low", className: "bg-accent text-accent-foreground border-accent" },
} as const;

export function RedFlagsPanel({ flags }: { flags: RedFlag[] }) {
  return (
    <Card className="border-border/60 shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <AlertTriangle className="size-5 text-primary" />
          Detected Patterns
        </CardTitle>
        <CardDescription>Rule-based signals worth reviewing further.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {flags.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-success/5 border border-success/20">
            <ShieldCheck className="size-5 text-success" />
            <div>
              <p className="font-medium text-sm">No notable patterns detected</p>
              <p className="text-xs text-muted-foreground">Inputs appear internally consistent.</p>
            </div>
          </div>
        ) : (
          flags.map((f) => {
            const cfg = severityConfig[f.severity];
            const Icon = cfg.icon;
            return (
              <div key={f.id} className="p-4 rounded-lg border border-border/70 bg-card hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`size-9 rounded-lg flex items-center justify-center border ${cfg.className} shrink-0`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                      <h4 className="font-semibold text-sm">{f.title}</h4>
                      <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                    <div className="mt-3 pt-3 border-t border-border/60">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-primary mb-1">Why it matters</p>
                      <p className="text-xs text-foreground/80 leading-relaxed">{f.whyItMatters}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
