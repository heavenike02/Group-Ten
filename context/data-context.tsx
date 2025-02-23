"use client";
import { createContext, useContext, useState } from "react";

interface BankingData {
  accountOverview: { [key: string]: string }
  financialMetrics: { [key: string]: string }
}

interface YoutubeData {
  channelStats: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  };
  last50videoData: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    averageViewsPerVideo: number;
    averageLikesPerVideo: number;
    averageCommentsPerVideo: number;
  };
}

interface DataContextType {
  bankingData: BankingData | null;
  youtubeData: YoutubeData | null;
  setBankingData: (data: BankingData) => void;
  setYoutubeData: (data: YoutubeData) => void;
}

const DataContext = createContext<DataContextType>({
  bankingData: null,
  youtubeData: null,
  setBankingData: () => {},
  setYoutubeData: () => {},
});

export const useDataContext = () => useContext(DataContext);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [bankingData, setBankingData] = useState<BankingData | null>(null);
  const [youtubeData, setYoutubeData] = useState<YoutubeData | null>(null);

  return (
    <DataContext.Provider value={{ bankingData, youtubeData, setBankingData, setYoutubeData }}>
      {children}
    </DataContext.Provider>
  );
}