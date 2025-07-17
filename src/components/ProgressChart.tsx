import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card } from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProgressChartProps {
  percentage: number;
  title: string;
  subtitle?: string;
  size?: "small" | "medium" | "large";
}

export function ProgressChart({
  percentage,
  title,
  subtitle,
  size = "medium",
}: ProgressChartProps) {
  const getPixelSize = () => {
    switch (size) {
      case "small":
        return 100;
      case "large":
        return 200;
      default:
        return 150;
    }
  };

  const sizePx = getPixelSize();

  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ["#1f4f86", "#e5e7eb"], // dark blue & gray
        borderWidth: 0,
        cutout: "70%",
        circumference: 360,
        rotation: 0,
        borderRadius: [25,0]
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <Card className="p-6 rounded-lg border border-gray-200 shadow-sm text-center">
      <div
        className="relative mx-auto"
        style={{ width: sizePx, height: sizePx }}
      >
        <Doughnut
          data={data}
          options={options}
          width={sizePx}
          height={sizePx}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-black">{percentage}%</span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </Card>
  );
}
