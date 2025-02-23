"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTrigger,DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis, Tooltip } from "recharts"
import { useDataContext } from "../context/data-context" // Adjust the path as needed

export function StatsModal({ disabled }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"youtube" | "banking">("youtube")
  const { bankingData, youtubeData } = useDataContext();


  const parseCurrency = (value: string) => parseFloat(value.replace(/[Â£,]/g, ""))

  const getChartData = () => {
    if (activeTab === "banking" && bankingData) {
      const income = parseCurrency(bankingData.accountOverview["Total Income"])
      const expenditure = parseCurrency(bankingData.accountOverview["Total Expenditure"])
      const netIncome = parseCurrency(bankingData.financialMetrics["Net Income"])
      return [
        {
          name: "Income",
          value: income,
          fill: "#C4B5FD",
          actual: bankingData.accountOverview["Total Income"],
        },
        {
          name: "Expenditure",
          value: expenditure,
          fill: "#A78BFA",
          actual: bankingData.accountOverview["Total Expenditure"],
        },
        {
          name: "Net Income",
          value: Math.abs(netIncome),
          fill: "#8B5CF6",
          actual: bankingData.financialMetrics["Net Income"],
        },
      ]
    } else if (activeTab === "youtube" && youtubeData) {
      const maxValue = Math.max(
        youtubeData.last50videoData.averageViewsPerVideo,
        youtubeData.last50videoData.averageLikesPerVideo,
        youtubeData.last50videoData.averageCommentsPerVideo,
      )
      return [
        {
          name: "Comments",
          value: (youtubeData.last50videoData.averageCommentsPerVideo / maxValue) * 100,
          fill: "#C4B5FD",
          actual: youtubeData.last50videoData.averageCommentsPerVideo.toLocaleString(),
        },
        {
          name: "Likes",
          value: (youtubeData.last50videoData.averageLikesPerVideo / maxValue) * 100,
          fill: "#A78BFA",
          actual: youtubeData.last50videoData.averageLikesPerVideo.toLocaleString(),
        },
        {
          name: "Views",
          value: (youtubeData.last50videoData.averageViewsPerVideo / maxValue) * 100,
          fill: "#8B5CF6",
          actual: youtubeData.last50videoData.averageViewsPerVideo.toLocaleString(),
        },
      ]
    }
    return []
  }

  const chartData = getChartData()

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded-lg shadow-lg p-2">
          <p className="text-sm font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-500">{payload[0].payload.actual}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>View Statistics</Button>
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
                    activeTab === "youtube" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  YouTube
                  {activeTab === "youtube" && <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary" />}
                </button>
                <button
                  onClick={() => setActiveTab("banking")}
                  className={cn(
                    "relative pb-4 text-sm font-medium transition-colors",
                    activeTab === "banking" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  Banking
                  {activeTab === "banking" && <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary" />}
                </button>
              </div>
            </div>
          
          </div>
        </div>
        <div className="p-4 space-y-4">
          {activeTab === "banking" ? (
            <>
              {/* Banking: Account Overview */}
              <div className=" rounded-lg p-4">
                <h3 className="text-base font-semibold mb-2">Account Overview</h3>
                <div className="grid grid-cols-3 gap-4">
                  {bankingData && Object.entries(bankingData.accountOverview).map(([key, value]) => (
                    <div key={key}>
                      <div className={cn("text-lg", value.includes("-") && "text-red-500")}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Banking: Financial Metrics with Chart */}
              <div className=" rounded-lg p-4">
                <h3 className="text-base font-semibold mb-2">Financial Metrics</h3>
                <div className="grid grid-cols-[1fr_200px] gap-4 items-center">
                  <div className="space-y-4">
                    {chartData.map((item) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <div>
                          <div className="text-sm text-gray-500">{item.name}</div>
                          <div className={cn("text-lg", item.actual.includes("-") && "text-red-500")}>
                            {item.actual}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart innerRadius="30%" outerRadius="100%" data={chartData} startAngle={90} endAngle={-270}>
                        <PolarAngleAxis
                          type="number"
                          domain={[0, Math.max(...chartData.map((d) => d.value))]}
                          angleAxisId={0}
                          tick={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <RadialBar background dataKey="value" cornerRadius={30}  />
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
                <div className=" rounded-lg p-4">
                  <h3 className="text-base font-semibold mb-2">Channel Overview</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(youtubeData.channelStats).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-sm text-gray-500">
                          {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </div>
                        <div className="text-lg">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* YouTube: Last 50 Videos Avg. with Chart */}
              <div className=" rounded-lg p-4">
                <h3 className="text-base font-semibold mb-2">Last 50 Videos Avg.</h3>
                <div className="grid grid-cols-[1fr_200px] gap-4 items-center">
                  <div className="space-y-4">
                    {chartData.map((item) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <div>
                          <div className="text-sm text-gray-500">{item.name}</div>
                          <div className="text-lg">{item.actual}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart innerRadius="30%" outerRadius="100%" data={chartData} startAngle={90} endAngle={-270}>
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <RadialBar background dataKey="value" cornerRadius={30} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* YouTube: Last 50 Videos Totals */}
              {youtubeData && (
                <div className=" rounded-lg p-4">
                  <h3 className="text-base font-semibold mb-2">Last 50 Videos Totals</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(youtubeData.last50videoData).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-sm text-gray-500">
                          {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </div>
                        <div className="text-lg">
                          {typeof value === "number" ? value.toLocaleString() : value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}