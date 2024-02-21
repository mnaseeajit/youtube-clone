const API_KEY = "AIzaSyBBGKi4stvRX0K1voomG8SB19TUDiZGp5A";
//const API_KEY =  `AIzaSyDI7xuxOTRzMaDfaecSlpFJfHOKQV04dnk`;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

// to get video

function getVideo(query){

    fetch(`${BASE_URL}/search?key=${API_KEY}&type=video&q=${query}&maxResults=20&part=snippet`)
    .then((res) => res.json())
    .then((data)=> { 
        console.log(data);
        displayVideo(data.items);
    });
}

getVideo("webdevlopment");

document.getElementById("search-btn").addEventListener("click",()=>{
     getVideo(document.getElementById("search-input").value);
})

function displayVideo(videos){
    document.getElementById("video-container").innerHTML = "";
     // videos is array
     videos.map((video,i)=>{
            document.getElementById("video-container").innerHTML += `
              
               <a href='/video.html?videoId=${video.id.videoId}' >
                <div id="video-click" >
                   <img src="${video.snippet.thumbnails.default.url}"> ${video.snippet.title}
                </div>
            `
     })
}