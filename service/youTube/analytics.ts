// Function to fetch channel content details using the YouTube Data API
async function fetchChannelContentDetails(channelId: string, apiKey: string){
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

    // store total views, likes and comments of the last 50 videos
    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;
    // store statistics of the last 5 videos
    let videoData: any = [];
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
            videoData.push({
                videoId: videoIdString,
                viewCount: data["items"][0]["statistics"]["viewCount"],
                likeCount: data["items"][0]["statistics"]["likeCount"],
                commentCount: data["items"][0]["statistics"]["commentCount"]
            });
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
    returndata["last50videoData"] = {
        "totalViews":totalViews, 
        "totalLikes":totalLikes,
        "totalComments": totalComments, 
        "averageViewsPerVideo":averageViews, 
        "averageLikesPerVideo":averageLikes, 
        "averageCommentsPerVideo":averageComments
    }; 
    // save videoData to returndata
    returndata["videoData"] = videoData; 
    return returndata;
}

fetchChannelContentDetails(channelId, YoutubeKey).then((data) => {
    const videoData = data.videoData;
    for(let i = 0; i < videoData.length; i++) {
        console.log(`Video ${i+1}:`);
        console.log(`Video Views: ${videoData[i].viewCount}`);
    }

    // Ensure there are enough videos
    if (videoData.length < 50) {
        console.log("Not enough videos to compare 10-video batches.");
        return;
    }

    // Function to calculate average stats for a given batch
    function calculateAverages(startIndex: number, endIndex: number) {
        let totalViews = 0, totalLikes = 0, totalComments = 0;
        let count = 0;

        for (let i = startIndex; i <= endIndex; i++) {
            let video = videoData[i];
            if (video) {
                totalViews += parseInt(video.viewCount);
                totalLikes += parseInt(video.likeCount);
                totalComments += parseInt(video.commentCount);
                count++;
            }
        }

        return {
            between: [endIndex, startIndex],
            averageViews: totalViews / count,
            averageLikes: totalLikes / count,
            averageComments: totalComments / count
        };
    }

    // Compute averages for batches of 10 videos
    let batchStats = [
        calculateAverages(0, 9),    // Latest 10 videos
        calculateAverages(10, 19),  // Next 10 videos
        calculateAverages(20, 29),  // Next 10 videos
        calculateAverages(30, 39),  // Next 10 videos
        calculateAverages(40, 49)   // Oldest 10 videos
    ];

    console.log(batchStats);

    // Display results in table format
    let lastViews = 0;
    let lastLikes = 0;
    let lastComments = 0;
    for(let i = batchStats.length-1; i >=0 ; i--) {
        if (i === batchStats.length - 1) {
            lastViews = batchStats[i].averageViews;
            lastLikes = batchStats[i].averageLikes;
            lastComments = batchStats[i].averageComments;
        }
        else{
            let viewsGrowth = ((batchStats[i].averageViews - lastViews) / lastViews) * 100;
            let likesGrowth = ((batchStats[i].averageLikes - lastLikes) / lastLikes) * 100;
            let commentsGrowth = ((batchStats[i].averageComments - lastComments) / lastComments) * 100;

            console.log(`Growth from Videos ${batchStats[i+1].between[0]}-${batchStats[i+1].between[1]} to ${batchStats[i].between[0]}-${batchStats[i].between[1]}:`);
            console.log(`Views Growth: ${viewsGrowth.toFixed(2)}%`);
            console.log(`Likes Growth: ${likesGrowth.toFixed(2)}%`);
            console.log(`Comments Growth: ${commentsGrowth.toFixed(2)}%\n`);

            lastViews = batchStats[i].averageViews;
            lastLikes = batchStats[i].averageLikes;
            lastComments = batchStats[i].averageComments
        }
    }
});
