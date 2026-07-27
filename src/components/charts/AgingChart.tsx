"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

import type { PortfolioAging } from "@/types/executive";

interface AgingChartProps {
  portfolioAging: PortfolioAging;
}

interface AgingChartDatum {
  range: string;
  count: number;
  amount: number;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

const compactNumberFormatter = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const agingRanges: Array<{ key: keyof PortfolioAging; label: string }> = [
  { key: "0-30", label: "0–30" },
  { key: "31-60", label: "31–60" },
  { key: "61-90", label: "61–90" },
  { key: "91-180", label: "91–180" },
  { key: "181-365", label: "181–365" },
  { key: "365+", label: "365+" },
];

function AgingTooltip({
  active,
  payload,
}: TooltipContentProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload as AgingChartDatum;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="font-semibold text-slate-950">{data.range}</p>
      <p className="mt-1 text-sm text-slate-600">
        {numberFormatter.format(data.count)} títulos
      </p>
      <p className="mt-0.5 text-sm font-semibold text-blue-700">
        {currencyFormatter.format(data.amount)}
      </p>
    </div>
  );
}

export function AgingChart({ portfolioAging }: AgingChartProps) {
  const data: AgingChartDatum[] = agingRanges.map(({ key, label }) => ({
    range: label,
    count: portfolioAging[key].count,
    amount: portfolioAging[key].amount,
  }));

  return (
    <div className="h-72 min-w-0 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 4, bottom: 0, left: 0 }}
          accessibilityLayer
        >
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="range"
            axisLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickLine={false}
            interval={0}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickFormatter={(value: number) =>
              `R$ ${compactNumberFormatter.format(value)}`
            }
            tickLine={false}
            width={72}
          />
          <Tooltip
            content={AgingTooltip}
            cursor={{ fill: "#eff6ff" }}
            isAnimationActive={false}
          />
          <Bar
            dataKey="amount"
            fill="#2563eb"
            maxBarSize={52}
            radius={[6, 6, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
