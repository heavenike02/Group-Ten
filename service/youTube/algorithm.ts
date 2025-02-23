// import { fetchChannelContentDetails } from "./analytics";

// fetchChannelContentDetails(username, YoutubeKey).then((data) => {
//     console.log(data);
// }
// );

// Interface representing the YouTube channel metrics.
interface ChannelMetrics {
    subscribers: number;
    viewsPerVideo: number;
    engagementRatio: number;
  }
  
  /**
   * Interface for normalization factors.
   * These values represent the maximum expected values in your dataset.
   */
  interface NormalizationFactors {
    maxSubscribers: number;
    maxViewsPerVideo: number;
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
    const nomralized = Math.log(value + 1) / Math.log(maxValue + 1);
    return Math.min(Math.pow(nomralized,3), 1); // Cap the value at 1
  }
  
  // Calculates the credit eligibility score for a YouTube channel on a scale from 0 to 10.
  function getCreditScore(
    metrics: ChannelMetrics,
    normalization: NormalizationFactors,
    weights: Weights
  ): number {
    let modifier = 1;
    if(metrics.subscribers/normalization.maxSubscribers > 1){
      modifier *= Math.min(metrics.subscribers/normalization.maxSubscribers,1.2);
    }
    if(metrics.viewsPerVideo/normalization.maxViewsPerVideo > 1){
      modifier *= Math.min(metrics.viewsPerVideo/normalization.maxViewsPerVideo,1.2);
    }
    if(metrics.engagementRatio/normalization.maxEngagementRatio > 1){
      modifier *= Math.min(metrics.engagementRatio/normalization.maxEngagementRatio, 1.2);
    }
    modifier *= Math.max(Math.min((metrics.viewsPerVideo*2)/metrics.subscribers,1.2),0.8);

    // Normalize subscribers and total views using logarithmic scaling.
    const normSubscribers = normalizeLog(metrics.subscribers, normalization.maxSubscribers);
    const normViewsPerVideo = normalizeLog(metrics.viewsPerVideo, normalization.maxViewsPerVideo);
  
    // Calculate engagement ratio: (likes + comments) / totalViews (avoid division by zero)
    //const engagementRatio = metrics.viewsPerVideo > 0 ? metrics.engagementRatio : 0;
    // Normalize the engagement ratio (capped at 1 for extreme values)
    const normEngagement = Math.min(metrics.engagementRatio / normalization.maxEngagementRatio, 1);
    // Compute a weighted sum of all normalized metrics.
    let rawScore =
      weights.subscribers * normSubscribers +
      weights.totalViews * normViewsPerVideo +
      weights.engagement * normEngagement;
  
    // Calculate the sum of weights.
    const totalWeight = weights.subscribers + weights.totalViews + weights.engagement;
    // Determine the average normalized score (should be between 0 and 1)
    rawScore = rawScore * modifier;
    const averageScore = Math.min(rawScore / totalWeight, 1);
  
    // Scale the average score to a 0–10 range.
    return 10 - averageScore * 10;
  }
  
  // ----- Example Usage ----- //
  
  // Example channel metrics.
  const channelMetrics: ChannelMetrics = {
    subscribers: 50000,
    viewsPerVideo: 20000,
    engagementRatio: 0.05, // 5% engagement
  };
  const fireship: ChannelMetrics = {
    subscribers: 3690000,
    viewsPerVideo: 779128.7363253857,
    engagementRatio: 0.04169125483168387
  }
  const MrBeast: ChannelMetrics = {
    subscribers: 365000000,
    viewsPerVideo: 86690620.97287735,
    engagementRatio: 0.040912982954989775
  }
  const PancreasNoWork: ChannelMetrics = {
    subscribers: 276000,
    viewsPerVideo: 261289.1774891775,
    engagementRatio: 0.06515226757020831
  }
  const BackendBanter: ChannelMetrics = {
    subscribers: 20800,
    viewsPerVideo: 6013.044554455446,
    engagementRatio: 0.024864376130198915
  }
  const BadChannel: ChannelMetrics = {
    subscribers: 3800,
    viewsPerVideo: 313.044554455446,
    engagementRatio: 0.004864376130198915
  }
  
  // Example normalization factors based on your dataset.
  const normalizationFactors: NormalizationFactors = {
    maxSubscribers: 1200000,   // 1,200,000 is considered high
    maxViewsPerVideo: 800000,   // 800,000 is considered high
    maxEngagementRatio: 0.07,   // 7% engagement is considered high
  };
  
  // Weights assigned to each metric (must sum to a meaningful total, e.g., 1 or any constant)
  const weights: Weights = {
    subscribers: 0.4,
    totalViews: 0.4,
    engagement: 0.2,
  };
  
  const score = getCreditScore(channelMetrics, normalizationFactors, weights);
  console.log(`Credit Eligibility Score: ${score.toFixed(2)} / 10`);

  console.log("Fireship:");
  const score2 = getCreditScore(fireship, normalizationFactors, weights);
  console.log(`Credit Eligibility Score: ${score2.toFixed(2)} / 10`);

  console.log("MrBeast:");
  const score3 = getCreditScore(MrBeast, normalizationFactors, weights);
  console.log(`Credit Eligibility Score: ${score3.toFixed(2)} / 10`);

  console.log("PancreasNoWork:");
  const score4 = getCreditScore(PancreasNoWork, normalizationFactors, weights);
  console.log(`Credit Eligibility Score: ${score4.toFixed(2)} / 10`);

  console.log("BackendBanter:");
  const score5 = getCreditScore(BackendBanter, normalizationFactors, weights);
  console.log(`Credit Eligibility Score: ${score5.toFixed(2)} / 10`);

  console.log("BadChannel:");
  const score6 = getCreditScore(BadChannel, normalizationFactors, weights);
  console.log(`Credit Eligibility Score: ${score6.toFixed(2)} / 10`);
  