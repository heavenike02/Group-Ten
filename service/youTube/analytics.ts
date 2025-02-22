// add interface for cleaner code

// Function to fetch channel content details using the YouTube Data API
export async function fetchChannelContentDetails(username: string, apiKey: string){
    // return data object
    let returndata: Record<string, any> = {};
    // get channel details
    let channelId = "";
    const channelsUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${username}&type=channel&key=${apiKey}`;
    try {
        const response = await fetch(channelsUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
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
        const response = await fetch(channelstatsurl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        //console.log(data["items"][0]["statistics"]);
        
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
        const response = await fetch(fivelastvideosurl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
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
    // console.log(videos);

    // store total views, likes and comments of the last 50 videos
    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;
    // store statistics of the last 5 videos
    // let videoData: any = [];
    for (let i = 0; i < videos.length; i++) {
        let videoIdString = videos[i];
        const videourl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIdString}&key=${apiKey}`;
        try {
            const response = await fetch(videourl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // calculate total views, likes and comments of the last 50 videos
            totalViews += parseInt(data["items"][0]["statistics"]["viewCount"]);
            totalLikes += parseInt(data["items"][0]["statistics"]["likeCount"]);
            totalComments += parseInt(data["items"][0]["statistics"]["commentCount"]);

            // Add the data of the last 5 videos to the videoData array
            // console.log(data);
            // videoData.push({
            //     videoId: videoIdString,
            //     viewCount: data["items"][0]["statistics"]["viewCount"],
            //     likeCount: data["items"][0]["statistics"]["likeCount"],
            //     commentCount: data["items"][0]["statistics"]["commentCount"],
            //     //videoDate: data["items"][0]["snippet"]["publishedAt"]
            // });
        }
        catch (error) 
        {
            console.error("Error fetching video statistics:", error);
            throw error;
        }
    }
    // console.log(videoData)
    // save videoData to returndata
    // returndata["videoData"] = videoData; 

    // get average views, likes and comments of the last 50 videos
    let averageViews = totalViews/50;
    let averageLikes = totalLikes/50;
    let averageComments = totalComments/50;
    returndata["last50videoData"] = {
        "totalViews":totalViews, 
        "totalLikes":totalLikes,
        "totalComments": totalComments, 
        "averageViewsPerVideo":averageViews, 
        "averageLikesPerVideo":averageLikes, 
        "averageCommentsPerVideo":averageComments,
        "averageVideoEngagement": (averageLikes + averageComments) / averageViews
    }; 
    //console.log(returndata["last50videoData"]);
    return returndata;
}