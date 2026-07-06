"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { buildChartSeries } from "@/lib/orders/dashboard-metrics";
import {
  type DashboardGranularity,
  type DashboardMetric,
  type DashboardOrderRow,
} from "@/lib/orders/dashboard-types";

const metricLabels: Record<DashboardMetric, string> = {
  revenue: "Revenue",
  orders: "Orders",
  customers: "Customers",
  average: "Avg. Order",
};

const granularityLabels: Record<DashboardGranularity, string> = {
  day: "Day",
  week: "Week",
  month: "Month",
  year: "Year",
};

const formatValue = (value: number, metric: DashboardMetric) => {
  if (metric === "revenue" || metric === "average") {
    return `€${value.toLocaleString("en-IE", { maximumFractionDigits: 0 })}`;
  }
  return value.toString();
};

interface DashboardChartProps {
  orders: DashboardOrderRow[];
  defaultMetric?: DashboardMetric;
}

const DashboardChart = ({ orders, defaultMetric = "revenue" }: DashboardChartProps) => {
  const [metric, setMetric] = useState<DashboardMetric>(defaultMetric);
  const [granularity, setGranularity] = useState<DashboardGranularity>("month");

  const data = useMemo(
    () => buildChartSeries(orders, metric, granularity),
    [orders, metric, granularity],
  );

  const chartConfig: ChartConfig = {
    value: {
      label: metricLabels[metric],
      color: "hsl(var(--primary))",
    },
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="font-display text-lg">{metricLabels[metric]}</CardTitle>
          <div className="flex gap-1">
            {(Object.keys(granularityLabels) as DashboardGranularity[]).map((g) => (
              <Button
                key={g}
                variant={granularity === g ? "default" : "ghost"}
                size="sm"
                className="text-xs h-7 px-2"
                onClick={() => setGranularity(g)}
              >
                {granularityLabels[g]}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex gap-1 mt-1">
          {(Object.keys(metricLabels) as DashboardMetric[]).map((m) => (
            <Button
              key={m}
              variant={metric === m ? "secondary" : "ghost"}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => setMetric(m)}
            >
              {metricLabels[m]}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {orders.length === 0 ? (
          <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
            No order data yet
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`fillValue-${defaultMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="text-xs"
                tickFormatter={(v) => formatValue(v, metric)}
                width={60}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatValue(Number(value), metric)}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill={`url(#fillValue-${defaultMetric})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
