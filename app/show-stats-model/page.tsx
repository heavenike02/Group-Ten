"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
  Tooltip,
} from "recharts";
import {
  evaluateCreditRisk,
  BankingData,
  banking_data,
} from "@/lib/creditScoring";

export default function Page() {
  // Evaluate credit risk based on provided banking data
  const result = evaluateCreditRisk(banking_data);

  // Prepare YouTube and Banking data for stats display
  const youtubeData = {
    channelStats: {
      viewCount: "555,518,789",
      subscriberCount: "3,690,000",
      videoCount: "713",
    },
    last50videoData: {
      totalViews: 58049740,
      totalLikes: 2495700,
      totalComments: 128609,
      averageViewsPerVideo: 1160994.8,
      averageLikesPerVideo: 49914,
      averageCommentsPerVideo: 2572.18,
    },
  };

  const preparedBankingData = {
    accountOverview: {
      "Current Balance": `£${result.metrics.currentBalance.toFixed(2)}`,
      "Total Income": `£${result.metrics.totalIncome.toFixed(2)}`,
      "Total Expenditure": `£${result.metrics.totalExpenditure.toFixed(2)}`,
    },
    financialMetrics: {
      "Net Income": `£${result.metrics.netIncome.toFixed(2)}`,
      "Average Salary": `£${result.metrics.averageSalary.toFixed(2)}`,
      "Salary Frequency": `${result.metrics.salaryFrequency.toFixed(2)} per month`,
      "Expenditure Ratio": result.metrics.expenditureRatio.toFixed(2),
      "Overdraft Count": result.metrics.overdraftCount.toString(),
    },
  };

  // Modal and tab state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"youtube" | "banking">("youtube");

  // Utility to parse currency values
  const parseCurrency = (value: string) =>
    parseFloat(value.replace(/[£,]/g, ""));

  // Compute chart data based on active tab
  const getChartData = () => {
    if (activeTab === "banking" && preparedBankingData) {
      const income = parseCurrency(
        preparedBankingData.accountOverview["Total Income"]
      );
      const expenditure = parseCurrency(
        preparedBankingData.accountOverview["Total Expenditure"]
      );
      const netIncome = parseCurrency(
        preparedBankingData.financialMetrics["Net Income"]
      );
      return [
        {
          name: "Income",
          value: income,
          fill: "#C4B5FD",
          actual: preparedBankingData.accountOverview["Total Income"],
        },
        {
          name: "Expenditure",
          value: expenditure,
          fill: "#A78BFA",
          actual: preparedBankingData.accountOverview["Total Expenditure"],
        },
        {
          name: "Net Income",
          value: Math.abs(netIncome),
          fill: "#8B5CF6",
          actual: preparedBankingData.financialMetrics["Net Income"],
        },
      ];
    } else if (activeTab === "youtube" && youtubeData) {
      const maxValue = Math.max(
        youtubeData.last50videoData.averageViewsPerVideo,
        youtubeData.last50videoData.averageLikesPerVideo,
        youtubeData.last50videoData.averageCommentsPerVideo
      );
      return [
        {
          name: "Comments",
          value:
            (youtubeData.last50videoData.averageCommentsPerVideo / maxValue) *
            100,
          fill: "#C4B5FD",
          actual:
            youtubeData.last50videoData.averageCommentsPerVideo.toLocaleString(),
        },
        {
          name: "Likes",
          value:
            (youtubeData.last50videoData.averageLikesPerVideo / maxValue) * 100,
          fill: "#A78BFA",
          actual:
            youtubeData.last50videoData.averageLikesPerVideo.toLocaleString(),
        },
        {
          name: "Views",
          value:
            (youtubeData.last50videoData.averageViewsPerVideo / maxValue) * 100,
          fill: "#8B5CF6",
          actual:
            youtubeData.last50videoData.averageViewsPerVideo.toLocaleString(),
        },
      ];
    }
    return [];
  };

  const chartData = getChartData();

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded-lg shadow-lg p-2">
          <p className="text-sm font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-500">{payload[0].payload.actual}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Credit Risk Evaluation Section */}
      <h1>Credit Risk Evaluation</h1>
      <div>
        <p>
          <strong>Credit Score:</strong> {result.creditScore.toFixed(2)}
        </p>
        <p>
          <strong>Loan Approved:</strong> {result.loanApproved ? "Yes" : "No"}
        </p>
        <p>
          <strong>Max Loan Amount:</strong> £{result.maxLoanAmount.toFixed(2)}
        </p>
      </div>
      <h2>Metrics</h2>
      <ul>
        <li>
          <strong>Total Income:</strong> £
          {result.metrics.totalIncome.toFixed(2)}
        </li>
        <li>
          <strong>Total Expenditure:</strong> £
          {result.metrics.totalExpenditure.toFixed(2)}
        </li>
        <li>
          <strong>Net Income:</strong> £{result.metrics.netIncome.toFixed(2)}
        </li>
        <li>
          <strong>Average Salary:</strong> £
          {result.metrics.averageSalary.toFixed(2)}
        </li>
        <li>
          <strong>Salary Frequency:</strong>{" "}
          {result.metrics.salaryFrequency.toFixed(2)} per month
        </li>
        <li>
          <strong>Expenditure Ratio:</strong>{" "}
          {result.metrics.expenditureRatio.toFixed(2)}
        </li>
        <li>
          <strong>Overdraft Count:</strong> {result.metrics.overdraftCount}
        </li>
        <li>
          <strong>Current Balance:</strong> £
          {result.metrics.currentBalance.toFixed(2)}
        </li>
      </ul>

      {/* Button to open the statistics modal */}
      <Button variant="outline" onClick={() => setModalOpen(true)}>
        View Statistics
      </Button>

      {/* Modal with YouTube and Banking Stats */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          {/* Empty trigger element because the Button above controls the open state */}
          <span />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] p-0">
          <div className="border-b">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex flex-col">
                <DialogTitle className="text-lg font-semibold mb-2">
                  Summary
                </DialogTitle>
                <div className="flex gap-6">
                  <button
                    onClick={() => setActiveTab("youtube")}
                    className={cn(
                      "relative pb-4 text-sm font-medium transition-colors",
                      activeTab === "youtube"
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    YouTube
                    {activeTab === "youtube" && (
                      <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("banking")}
                    className={cn(
                      "relative pb-4 text-sm font-medium transition-colors",
                      activeTab === "banking"
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    Banking
                    {activeTab === "banking" && (
                      <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {activeTab === "banking" ? (
              <>
                {/* Banking: Account Overview */}
                <div className="rounded-lg p-4">
                  <h3 className="text-base font-semibold mb-2">
                    Account Overview
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(preparedBankingData.accountOverview).map(
                      ([key, value]) => (
                        <div key={key}>
                          <div
                            className={cn(
                              "text-lg",
                              value.includes("-") && "text-red-500"
                            )}
                          >
                            {value}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
                {/* Banking: Financial Metrics with Chart */}
                <div className="rounded-lg p-4">
                  <h3 className="text-base font-semibold mb-2">
                    Financial Metrics
                  </h3>
                  <div className="grid grid-cols-[1fr_200px] gap-4 items-center">
                    <div className="space-y-4">
                      {chartData.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-3"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.fill }}
                          />
                          <div>
                            <div className="text-sm text-gray-500">
                              {item.name}
                            </div>
                            <div
                              className={cn(
                                "text-lg",
                                item.actual.includes("-") && "text-red-500"
                              )}
                            >
                              {item.actual}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="h-[160px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          innerRadius="30%"
                          outerRadius="100%"
                          data={chartData}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <PolarAngleAxis
                            type="number"
                            domain={[
                              0,
                              Math.max(...chartData.map((d) => d.value)),
                            ]}
                            angleAxisId={0}
                            tick={false}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <RadialBar
                            background
                            dataKey="value"
                            cornerRadius={30}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* YouTube: Channel Overview */}
                {youtubeData && (
                  <div className="rounded-lg p-4">
                    <h3 className="text-base font-semibold mb-2">
                      Channel Overview
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(youtubeData.channelStats).map(
                        ([key, value]) => (
                          <div key={key}>
                            <div className="text-sm text-gray-500">
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                            </div>
                            <div className="text-lg">{value}</div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {/* YouTube: Last 50 Videos Average Metrics with Chart */}
                <div className="rounded-lg p-4">
                  <h3 className="text-base font-semibold mb-2">
                    Last 50 Videos Avg.
                  </h3>
                  <div className="grid grid-cols-[1fr_200px] gap-4 items-center">
                    <div className="space-y-4">
                      {chartData.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-3"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.fill }}
                          />
                          <div>
                            <div className="text-sm text-gray-500">
                              {item.name}
                            </div>
                            <div className="text-lg">{item.actual}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="h-[160px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          innerRadius="30%"
                          outerRadius="100%"
                          data={chartData}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            angleAxisId={0}
                            tick={false}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <RadialBar
                            background
                            dataKey="value"
                            cornerRadius={30}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                {/* YouTube: Last 50 Videos Totals */}
                {youtubeData && (
                  <div className="rounded-lg p-4">
                    <h3 className="text-base font-semibold mb-2">
                      Last 50 Videos Totals
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(youtubeData.last50videoData).map(
                        ([key, value]) => (
                          <div key={key}>
                            <div className="text-sm text-gray-500">
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                            </div>
                            <div className="text-lg">
                              {typeof value === "number"
                                ? value.toLocaleString()
                                : value}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
