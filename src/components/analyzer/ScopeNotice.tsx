import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export function ScopeNotice() {
  const items = [
    "Uses only user-provided data — no external sources.",
    "Does not evaluate real companies or entities.",
    "Does not perform audits or legal assessments.",
    "Intended for analytical and educational purposes only.",
  ];
  return (
    <Card className="border-border/60 bg-muted/40">
      <CardContent className="p-5">
        <div className="flex gap-3">
          <div className="size-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center shrink-0">
            <Info className="size-4" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-2">Usage & Scope</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-muted-foreground">
              {items.map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
