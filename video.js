
const API_KEY = "AIzaSyBBGKi4stvRX0K1voomG8SB19TUDiZGp5A";
const BASE_URL = "https://www.googleapis.com/youtube/v3";




// or do it using local storage
 
// window.addEventListener("load",()=>{
  
//     const search = window.location.search;
//     const params = new URLSearchParams(search);
//     const videoId = params.get('videoId');

//  if (YT) {
//         new YT.Player('video-container', {
//             height: "500",
//             width: "1000",
//             videoId: videoId
            
//         });
//     }

//     function getVideoDetails(){
//         fetch(`${BASE_URL}/videos?key=${API_KEY}&part=snippet&id=${videoId}`)
//         .then((res) => res.json())
//         .then((data) => {
//             console.log(data);
//             console.log(data.items[0].snippet);
//             getChannelInfo(data.items[0].snippet.channelId);
//     })
//     }

//     function getChannelInfo(channelId){
//         fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}&part=statistics`)
//         .then((res)=> res.json())
//         .then((data) => {
//             console.log(data);
//         })
//     }

//     function getVideoComment(){
//         fetch(`${BASE_URL}/commentThreads?key=${API_KEY}&part=snippet&videoId=${videoId}&maxResults=25`)
//         .then((res) => res.json())
//         .then((data) => { 
//             console.log(data);
//         });
//     }

//     // function recommendedVideo(){
//     //     fetch(`${BASE_URL}/search?key=${API_KEY}&part=snippet&q=${tags}&type=video&maxResults=10`)
//     //     .then((res=> res.json()))
//     //     .then((data) => {
//     //         console.log(data);
//     //     })
//     // }

//       getVideoDetails();
//       getVideoComment();
//      // recommendedVideo();
// })



// window.addEventListener("load", () => {
//     const search = window.location.search;
//     const params = new URLSearchParams(search);

//     const videoId = params.get('videoId');
//     // or do it using localstorage
//     if (YT) {
//         new YT.Player('video-container', {
//             height: "500",
//             width: "1000",
//             videoId: videoId
//         });
//     }

//     function getChannelDetails(channelId) {
//         fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`)
//             .then((res) => res.json())
//             .then((data) => {
//                 console.log("channel", data);
//             })
//     }

//     function getVideoStats() {
//         fetch(`${BASE_URL}/videos?key=${API_KEY}&part=statistics&id=${videoId}`)
//             .then((res) => res.json())
//             .then((data) => {
//                 console.log("stats", data);
//             })
//     }

//     function getVideoDetails() {
//         fetch(`${BASE_URL}/videos?key=${API_KEY}&part=snippet&id=${videoId}`)
//             .then((res) => res.json())
//             .then((data) => {
//                 console.log("video details", data);
//                 console.log(data.items[0].snippet.channelId);
//                 getChannelDetails(data.items[0].snippet.channelId);


//             })
//     }

//     function getComments() {
//         fetch(`${BASE_URL}/commentThreads?key=${API_KEY}&part=snippet&videoId=${videoId}&maxResults=25`)
//             .then((res) => res.json())
//             .then((data) => {
//                 console.log("comments", data);
//             })
//     }

//     getVideoStats()
//     getVideoDetails();
//     getComments();
// })


window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId');

    if (videoId) {
        loadVideo(videoId);
        loadComments(videoId);
        loadVideoDetails(videoId);
    } else {
        console.error("No video ID found in URL");
    }
});

function loadVideo(videoId) {
    if (YT) {
        new YT.Player('YT-container', {
            height: "300",
            width: "700",
            videoId: videoId
        });
    }
}

async function loadVideoDetails(videoId) {
    try {
        const response = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=snippet&id=${videoId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const channelId = data.items[0].snippet.channelId;
            loadChannelInfo(channelId);
        }
    } catch (error) {
        console.error('Error fetching video details: ', error);
    }
}

async function loadChannelInfo(channelId) {
    try {
        const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.items) {
            displayChannelInfo(data.items[0]);
            loadRecommendedVideos(data.items[0].snippet.title);
        }
    } catch (error) {
        console.error('Error fetching channel info: ', error);
    }
}

function displayChannelInfo(channelData) {
    const channelInfoSection = document.getElementById('channel-info');
    channelInfoSection.innerHTML = `
        <h3>${channelData.snippet.title}</h3>
        <img src="${channelData.snippet.thumbnails.default.url}" alt="${channelData.snippet.title}">
        <p>${channelData.snippet.description}</p>
    `;
}


async function loadComments(videoId) {
    try {
        const response = await fetch(`${BASE_URL}/commentThreads?key=${API_KEY}&part=snippet&videoId=${videoId}&maxResults=25`)

       // const response = await fetch(`${BASE_URL}/commentThreads?key=${API_KEY}&videoId=${videoId}&maxResults=25&part=snippet`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("comments", data)
        if (data.items) {
            displayComments(data.items);
        } else {
            console.log("No comments available or data is undefined.");
        }
    } catch (error) {
        console.error('Error fetching comments: ', error);
    }
}

function displayComments(comments) {
    const commentSection = document.getElementById('comment-section');
    commentSection.innerHTML = '';

    comments.forEach(comment => {
        const commentText = comment.snippet.topLevelComment.snippet.textDisplay;
        const commentElement = document.createElement('p');
        commentElement.innerHTML = commentText;
        commentSection.appendChild(commentElement);
    });
}

async function loadRecommendedVideos(channelName) {
    try {
        const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&maxResults=10&part=snippet&q=${channelName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Recommended videos", data)
        if (data.items) {
            displayRecommendedVideos(data.items);
        } else {
            console.log("No recommended videos available or data is undefined.");
        }
    } catch (error) {
        console.error('Error fetching recommended videos: ', error);
    }
}

function displayRecommendedVideos(videos) {
    const recommendedSection = document.getElementById('recommended-videos');
    recommendedSection.innerHTML = '';

    videos.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.default.url;
        const videoCard = document.createElement('div');
        videoCard.innerHTML = `
            <a href="video.html?videoId=${videoId}">
                <img src="${thumbnail}" alt="${title}">
                <p>${title}</p>
            </a>
        `;
        recommendedSection.appendChild(videoCard);
    });
}

