import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function ExecutiveSummary({ summary }: { summary: string }) {
  return (
    <Card className="border-border/60 shadow-[var(--shadow-soft)] bg-[image:var(--gradient-subtle)]">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="size-5 text-primary" />
          Executive Summary
        </CardTitle>
        <CardDescription>Neutral, analytical overview of the input data.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-foreground/90">{summary}</p>
      </CardContent>
    </Card>
  );
}
