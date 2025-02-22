// Function to fetch channel content details using the YouTube Data API
async function fetchChannelContentDetails(channelId: string, apiKey: string)/*: Promise<ChannelResponse> */{
    // return data object
    let returndata: Record<string, any> = {};
    // get channel details
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

    const fivelastvideosurl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=50&key=${apiKey}`;
    try {
        const response = await fetch(fivelastvideosurl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        //return data;
        for (let i = 0; i < data["items"].length; i++) {
            //console.log(data["items"][i]["id"]["videoId"]);

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
    // store statistics of the last 5 videos
    let videoData: Record<string, any> = {};
    for (let i = 0; i < videos.length; i++) {
        let videoIdString = videos[i];
        const videourl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIdString}&key=${apiKey}`;
        try {
            const response = await fetch(videourl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            //console.log(data["items"][0]["statistics"]);

            // calculate total views, likes and comments of the last 50 videos
            totalViews += parseInt(data["items"][0]["statistics"]["viewCount"]);
            totalLikes += parseInt(data["items"][0]["statistics"]["likeCount"]);
            totalComments += parseInt(data["items"][0]["statistics"]["commentCount"]);

            // add the data of the last 5 videos to the videodata object
            if(i<5)
            {
                videoData[i] = data["items"][0]["statistics"];
                videoData[i]["videoId"] = videoIdString;  
            }
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
    returndata["last50videoData"] = {"totalViews":totalViews, "totalLikes":totalLikes,"totalComments": totalComments, "averageViewsPerVideo":averageViews, "averageLikesPerVideo":averageLikes, "averageCommentsPerVideo":averageComments}; 
    // save videoData to returndata
    returndata["videoData"] = videoData; 

    console.log(returndata);
}

fetchChannelContentDetails(channelId, YoutubeKey);