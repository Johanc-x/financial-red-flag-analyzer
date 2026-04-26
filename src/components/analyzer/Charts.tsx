import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface TrendPoint {
  period: string;
  revenue: number;
  costs: number;
  ebitda: number;
  cashFlow: number;
}

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  boxShadow: "var(--shadow-soft)",
};

const fmt = (n: number) =>
  Math.abs(n) >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toFixed(0);

export function Charts({ data }: { data: TrendPoint[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="border-border/60 shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="text-base">Revenue vs Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="period" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={fmt} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="revenue" name="Revenue" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="costs" name="Costs" fill="var(--primary-glow)" radius={[6, 6, 0, 0]} opacity={0.55} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="text-base">EBITDA & Cash Flow Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="period" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={fmt} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="ebitda" name="EBITDA" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="cashFlow" name="Cash Flow" stroke="var(--destructive)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
