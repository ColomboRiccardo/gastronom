"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

type Metric = "revenue" | "orders" | "customers" | "average";
type Granularity = "day" | "week" | "month" | "year";

const metricLabels: Record<Metric, string> = {
  revenue: "Revenue",
  orders: "Orders",
  customers: "Customers",
  average: "Avg. Order",
};

const granularityLabels: Record<Granularity, string> = {
  day: "Day",
  week: "Week",
  month: "Month",
  year: "Year",
};

// Mock data generators per metric & granularity
const generateData = (metric: Metric, granularity: Granularity) => {
  const seeds: Record<Metric, number[]> = {
    revenue: [980, 1200, 1050, 1400, 1350, 1600, 1500, 1750, 1680, 1900, 1820, 2100],
    orders: [12, 18, 15, 22, 20, 25, 23, 28, 26, 32, 29, 35],
    customers: [5, 8, 6, 10, 9, 12, 11, 14, 13, 16, 15, 18],
    average: [82, 67, 70, 64, 68, 64, 65, 63, 65, 59, 63, 60],
  };

  const labels: Record<Granularity, string[]> = {
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    week: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"],
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    year: ["2020", "2021", "2022", "2023", "2024", "2025"],
  };

  const vals = seeds[metric];
  const lbls = labels[granularity];

  return lbls.map((label, i) => ({
    label,
    value: vals[i % vals.length] + Math.round((i * 17 + 7) % 50),
  }));
};

const formatValue = (value: number, metric: Metric) => {
  if (metric === "revenue" || metric === "average") return `€${value.toLocaleString()}`;
  return value.toString();
};

interface DashboardChartProps {
  defaultMetric?: Metric;
}

const DashboardChart = ({ defaultMetric = "revenue" }: DashboardChartProps) => {
  const [metric, setMetric] = useState<Metric>(defaultMetric);
  const [granularity, setGranularity] = useState<Granularity>("month");

  const data = generateData(metric, granularity);

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
            {(Object.keys(granularityLabels) as Granularity[]).map((g) => (
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
          {(Object.keys(metricLabels) as Metric[]).map((m) => (
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
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
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
              fill="url(#fillValue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
