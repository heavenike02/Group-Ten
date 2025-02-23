// Interface representing the YouTube channel metrics.
interface ChannelMetrics {
    subscribers: number;
    viewsPerVideo: number;
    engagementRatio: number;
}

// Interface for normalization factors.
interface NormalizationFactors {
    maxSubscribers: number;
    maxViewsPerVideo: number;
    maxEngagementRatio: number;
}

// Interface for the weights to assign to each metric.
interface Weights {
    subscribers: number;
    totalViews: number;
    engagement: number;
}

// Helper function to normalize a value using a logarithmic scale.
function normalizeLog(value: number, maxValue: number): number {
    const nomralized = Math.log(value + 1) / Math.log(maxValue + 1);
    return Math.min(Math.pow(nomralized,3), 1); // Cap the value at 1
}

// Helper function to fetch JSON data from a URL.
async function fetchJson(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// Calculates the credit eligibility score for a YouTube channel on a scale from 0 to 10.
function getCreditScore(
    metrics: ChannelMetrics,
    normalization: NormalizationFactors,
    weights: Weights
): any {
    let modifier = 1;
    // If the channel has more subscribers or views per video than the maximum expected value,
    // increase the modifier
    if(metrics.subscribers/normalization.maxSubscribers > 1){
      modifier *= Math.min(metrics.subscribers/normalization.maxSubscribers,1.2);
    }
    // If the channel has more subscribers or views per video than the maximum expected value,
    // increase the modifier
    if(metrics.viewsPerVideo/normalization.maxViewsPerVideo > 1){
      modifier *= Math.min(metrics.viewsPerVideo/normalization.maxViewsPerVideo,1.2);
    }
    // If the channel has more subscribers or views per video than the maximum expected value,
    // increase the modifier
    if(metrics.engagementRatio/normalization.maxEngagementRatio > 1){
      modifier *= Math.min(metrics.engagementRatio/normalization.maxEngagementRatio, 1.2);
    }
    // If the channel's views per video is less than the number of subscribers, decrease the modifier
    modifier *= Math.max(Math.min((metrics.viewsPerVideo*2)/metrics.subscribers,1.2),0.8);

    // Normalize subscribers and total views using logarithmic scaling.
    const normSubscribers = normalizeLog(metrics.subscribers, normalization.maxSubscribers);
    const normViewsPerVideo = normalizeLog(metrics.viewsPerVideo, normalization.maxViewsPerVideo);
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
    return (10 - averageScore * 10).toFixed(2);
}

// Define normalization factors 
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

// Function to fetch channel content details using the YouTube Data API
export async function fetchChannelContentDetails(username: string, apiKey: string): Promise<any>{
    
    // return data object
    let returndata: Record<string, any> = {};
    
    // get channel details
    let channelId = "";
    const channelsUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${username}&type=channel&key=${apiKey}`;
    try {
        const data = await fetchJson(channelsUrl);
        
        // save channel id in return data
        channelId = data["items"][0]["id"]["channelId"];
    } 
    catch (error) 
    {
        console.error("Error fetching channel id:", error);
        throw error;
    }

    const channelstatsurl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
    try {
        const data = await fetchJson(channelstatsurl);
        
        // save channel statistics in return data
        returndata["statistics"] = data["items"][0]["statistics"];
    } 
    catch (error) 
    {
        console.error("Error fetching channel content details:", error);
        throw error;
    }

    // get ids of the last 50 videos

    // create a videos array to store video ids
    let videos: string[] = [];

    const fivelastvideosurl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=5&key=${apiKey}`;
    try {
        const data = await fetchJson(fivelastvideosurl);
        for (let i = 0; i < data["items"].length; i++) {

            // save video ids to the videos array
            videos.push(data["items"][i]["id"]["videoId"]);
        }
    } 
    catch (error) 
    {
        console.error("Error fetching video ids:", error);
        throw error;
    }

    // store total views, likes and comments of the last 50 videos
    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;
    for (let i = 0; i < videos.length; i++) {
        let videoIdString = videos[i];
        const videourl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIdString}&key=${apiKey}`;
        try {
            const data = await fetchJson(videourl);

            // calculate total views, likes and comments of the last 50 videos
            totalViews += parseInt(data["items"][0]["statistics"]["viewCount"]);
            totalLikes += parseInt(data["items"][0]["statistics"]["likeCount"]);
            totalComments += parseInt(data["items"][0]["statistics"]["commentCount"]);
        }
        catch (error) 
        {
            console.error("Error fetching video statistics:", error);
            throw error;
        }
    }

    // get average views, likes and comments of the last 50 videos
    let averageViews = totalViews/50;
    let averageLikes = totalLikes/50;
    let averageComments = totalComments/50;

    const metrics:ChannelMetrics ={
        subscribers: parseInt(returndata["statistics"]["subscriberCount"]),
        viewsPerVideo: parseInt(returndata["statistics"]["viewCount"])/parseInt(returndata["statistics"]["videoCount"]),
        engagementRatio: (averageLikes + averageComments) / averageViews
    }
      
    return getCreditScore(metrics, normalizationFactors, weights);
}