// fetchChannelContentDetails(channelId, YoutubeKey).then((data) => {
//     const videoData = data.videoData;

//     // Ensure there are enough videos
//     if (videoData.length < 50) {
//         console.log("Not enough videos to compare 10-video batches.");
//         return;
//     }

//     // Function to calculate average stats for a given batch
//     function calculateAverages(startIndex: number, endIndex: number) {
//         let totalViews = 0, totalLikes = 0, totalComments = 0;
//         let count = 0;

//         for (let i = startIndex; i <= endIndex; i++) {
//             let video = videoData[i];
//             if (video) {
//                 totalViews += parseInt(video.viewCount);
//                 totalLikes += parseInt(video.likeCount);
//                 totalComments += parseInt(video.commentCount);
//                 count++;
//             }
//         }

//         return {
//             between: [endIndex, startIndex],
//             averageViews: totalViews / count,
//             averageLikes: totalLikes / count,
//             averageComments: totalComments / count
//         };
//     }

//     // Compute averages for batches of 10 videos
//     let batchStats = [
//         calculateAverages(0, 9),    // Latest 10 videos
//         calculateAverages(10, 19),  // Next 10 videos
//         calculateAverages(20, 29),  // Next 10 videos
//         calculateAverages(30, 39),  // Next 10 videos
//         calculateAverages(40, 49)   // Oldest 10 videos
//     ];

//     console.log(batchStats);

//     // Display results in table format
//     let lastViews = 0;
//     let lastLikes = 0;
//     let lastComments = 0;
//     for(let i = batchStats.length-1; i >=0 ; i--) {
//         if (i === batchStats.length - 1) {
//             lastViews = batchStats[i].averageViews;
//             lastLikes = batchStats[i].averageLikes;
//             lastComments = batchStats[i].averageComments;
//         }
//         else{
//             let viewsGrowth = ((batchStats[i].averageViews - lastViews) / lastViews) * 100;
//             let likesGrowth = ((batchStats[i].averageLikes - lastLikes) / lastLikes) * 100;
//             let commentsGrowth = ((batchStats[i].averageComments - lastComments) / lastComments) * 100;

//             console.log(`Growth from Videos ${batchStats[i+1].between[0]}-${batchStats[i+1].between[1]} to ${batchStats[i].between[0]}-${batchStats[i].between[1]}:`);
//             console.log(`Views Growth: ${viewsGrowth.toFixed(2)}%`);
//             console.log(`Likes Growth: ${likesGrowth.toFixed(2)}%`);
//             console.log(`Comments Growth: ${commentsGrowth.toFixed(2)}%\n`);

//             lastViews = batchStats[i].averageViews;
//             lastLikes = batchStats[i].averageLikes;
//             lastComments = batchStats[i].averageComments
//         }
//     }
// });
