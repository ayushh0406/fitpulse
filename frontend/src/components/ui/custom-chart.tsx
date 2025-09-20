import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface ChartProps {
  type: "bar" | "line" | "area" | "pie";
  data: any[];
  options?: any;
  className?: string;
}

export function Chart({ type, data, options, className }: ChartProps) {
  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={300} className={className}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={options?.xAxis?.dataKey || "labels"} 
            tick={{ fill: 'var(--muted-foreground)' }} 
          />
          <YAxis 
            tick={{ fill: 'var(--muted-foreground)' }} 
            label={options?.scales?.y?.title?.text ? { 
              value: options.scales.y.title.text, 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: 'var(--muted-foreground)' }
            } : undefined}
            domain={options?.scales?.y?.beginAtZero ? [0, 'auto'] : undefined}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="data" fill="#4ADE80" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Add more chart types as needed
  return <div>Chart type not supported</div>;
}