"use client";
import { useEffect, useState } from "react";

const AnalyzePage = () => {
  const [analysisData, setAnalysisData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const response = await fetch("/api/analyze");
        if (!response.ok) {
          throw new Error("Failed to fetch analysis data");
        }
        const data = await response.json();
        setAnalysisData(data.analysis);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, []);

  if (loading) {
    return <div>Loading analysis data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bank Account Analysis</h1>
      {analysisData.length === 0 ? (
        <p>No analysis data available.</p>
      ) : (
        <div>
          {analysisData.map((account) => (
            <div key={account.accountId} className="border p-4 mb-4 rounded">
              <h2 className="text-xl font-semibold">
                Account ID: {account.accountId}
              </h2>
              <p>
                <strong>Accumulated Balance:</strong> $
                {account.accumulatedBalance / 100}
              </p>
              <p>
                <strong>Institution Name:</strong> {account.institutionName}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalyzePage;
