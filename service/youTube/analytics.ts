let YoutubeKey = "AIzaSyBrbAlL69n1apFfQxxlYYGZ0NPislLzFyc";
let channelId = "UC-lHJZR3Gqxm24_Vd_AJ5Yw";

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

    // get ids of the last 5 videos

    // create a videos array to store video ids
    let videos: string[] = [];

    const fivelastvideosurl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=5&key=${apiKey}`;
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

    // get statistics of the last 5 videos
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

            // add the data of the ith video to the videodata object
            videoData[i] = data["items"][0]["statistics"];
            videoData[i]["videoId"] = videoIdString;  
        }
        catch (error) 
        {
        console.error("Error fetching video statistics:", error);
        throw error;
        }
    }
    // save videoData to returndata
    returndata["videoData"] = videoData; 

    return returndata;
}

console.log(fetchChannelContentDetails(channelId, YoutubeKey));