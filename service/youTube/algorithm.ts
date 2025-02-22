import { fetchChannelContentDetails } from "./analytics";

fetchChannelContentDetails(username, YoutubeKey).then((data) => {
    console.log(data);
}
);

// Interface representing the YouTube channel metrics.
interface ChannelMetrics {
    subscribers: number;
    totalViews: number;
    engagementRatio: number;
    /**
     * A safety risk score between 0 and 1, where 0 means completely safe
     * and 1 indicates high risk. The algorithm will use (1 - safetyScore)
     * so that a lower risk improves the overall score.
     */
    safetyScore: number;
  }
  
  /**
   * Interface for normalization factors.
   * These values represent the maximum expected values in your dataset.
   */
  interface NormalizationFactors {
    maxSubscribers: number;
    maxTotalViews: number;
    /**
     * Maximum expected engagement ratio.
     * Engagement ratio is defined as (likes + comments) / totalViews.
     * Typically, this value will be between 0 and 1.
     */
    maxEngagementRatio: number;
  }
  
  /**
   * Interface for the weights to assign to each metric.
   */
  interface Weights {
    subscribers: number;
    totalViews: number;
    engagement: number;
    safety: number;
  }
  
  /**
   * Helper function to normalize a value using a logarithmic scale.
   * This reduces the skew from very large numbers.
   *
   * @param value - The metric value.
   * @param maxValue - The maximum expected value for that metric.
   * @returns The normalized value between 0 and 1.
   */
  function normalizeLog(value: number, maxValue: number): number {
    return Math.log(value + 1) / Math.log(maxValue + 1);
  }
  
  /**
   * Calculates the credit eligibility score for a YouTube channel on a scale from 0 to 10.
   *
   * @param metrics - The channel metrics.
   * @param normalization - Normalization factors for subscribers, views, and engagement.
   * @param weights - Weights to assign to each normalized metric.
   * @returns The credit eligibility score between 0 and 10.
   */
  function getCreditScore(
    metrics: ChannelMetrics,
    normalization: NormalizationFactors,
    weights: Weights
  ): number {
    // Normalize subscribers and total views using logarithmic scaling.
    const normSubscribers = normalizeLog(metrics.subscribers, normalization.maxSubscribers);
    const normTotalViews = normalizeLog(metrics.totalViews, normalization.maxTotalViews);
  
    // Calculate engagement ratio: (likes + comments) / totalViews (avoid division by zero)
    const engagementRatio = metrics.totalViews > 0 ? metrics.engagementRatio : 0;
    // Normalize the engagement ratio (capped at 1 for extreme values)
    const normEngagement = Math.min(engagementRatio / normalization.maxEngagementRatio, 1);
  
    // Adjust safety: if safetyScore is a risk measure (0 safe, 1 risky), then (1 - safetyScore) gives the safety factor.
    const normSafety = 1 - metrics.safetyScore;
  
    // Compute a weighted sum of all normalized metrics.
    const rawScore =
      weights.subscribers * normSubscribers +
      weights.totalViews * normTotalViews +
      weights.engagement * normEngagement +
      weights.safety * normSafety;
  
    // Calculate the sum of weights.
    const totalWeight = weights.subscribers + weights.totalViews + weights.engagement + weights.safety;
    // Determine the average normalized score (should be between 0 and 1)
    const averageScore = rawScore / totalWeight;
  
    // Scale the average score to a 0–10 range.
    return averageScore * 10;
  }
  
  // ----- Example Usage ----- //
  
  // Example channel metrics.
  const channelMetrics: ChannelMetrics = {
    subscribers: 50000,
    totalViews: 2000000,
    engagementRatio: 0.05, // 5% engagement
    safetyScore: 0.2, // 20% risk; hence, safety factor is 0.8
  };
  
  // Example normalization factors based on your dataset.
  const normalizationFactors: NormalizationFactors = {
    maxSubscribers: 1000000,   // 1,000,000 is considered high
    maxTotalViews: 50000000,   // 50,000,000 is considered high
    maxEngagementRatio: 0.1,   // 10% engagement is considered high
  };
  
  // Weights assigned to each metric (must sum to a meaningful total, e.g., 1 or any constant)
  const weights: Weights = {
    subscribers: 0.35,
    totalViews: 0.35,
    engagement: 0.1,
    safety: 0.2,
  };
  
  const score = getCreditScore(channelMetrics, normalizationFactors, weights);
  console.log(`Credit Eligibility Score: ${score.toFixed(2)} / 10`);
  