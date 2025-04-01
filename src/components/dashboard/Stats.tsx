
import React from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type StatsTrendType = "up" | "down" | "neutral";

interface StatsProps {
  title: string;
  value: string;
  change: string;
  trend: StatsTrendType;
  description: string;
  icon?: React.ReactNode;
}

const Stats = ({ title, value, change, trend, description, icon }: StatsProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-transform duration-300 hover:translate-y-[-2px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-display font-bold mt-1">{value}</h3>
        </div>
        {icon && (
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center text-sm">
        <div
          className={cn(
            "flex items-center mr-2",
            trend === "up" && "text-green-500",
            trend === "down" && "text-red-500",
            trend === "neutral" && "text-muted-foreground"
          )}
        >
          {trend === "up" && <ArrowUp className="h-4 w-4 mr-1" />}
          {trend === "down" && <ArrowDown className="h-4 w-4 mr-1" />}
          {trend === "neutral" && <Minus className="h-4 w-4 mr-1" />}
          {change}
        </div>
        <span className="text-muted-foreground">{description}</span>
      </div>
    </div>
  );
};

export default Stats;
