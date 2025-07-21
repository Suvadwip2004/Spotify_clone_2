
// console.log("Hello ");
const currentsongs = new Audio()
let songs;
let currFolder;
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    const formattedMins = mins < 10 ? "0" + mins : mins;
    const formattedSecs = secs < 10 ? "0" + secs : secs;

    return `${formattedMins}:${formattedSecs}`;
}


async function getSongs(folder) {
    currFolder = folder

    let a = await fetch(`${folder}/`)
    let responce = await a.text();
    // console.log(responce);
    let div = document.createElement("div")
    div.innerHTML = responce
    let as = div.getElementsByTagName("a");
    // console.log(as);
    songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];

        if (element.href.endsWith(".mp3")) {


            songs.push(element.href.split(`/${folder}/`)[1])


        }

    }

    //song list
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
                        <li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">

                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Artist Name</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
                         </li> 
        
        `
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })


    })

    // console.log(songs);
    // return songs
}
const playMusic = (track) => {
    // let audio = new Audio("/songs/"+track)
    currentsongs.src = `/${currFolder}/` + track
    currentsongs.play()
    play.src = "img/pause.svg"
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let responce = await a.text();
    // console.log(responce);
    let div = document.createElement("div")
    div.innerHTML = responce
    let anchors = div.getElementsByTagName("a")

    let cardContainer = document.querySelector(".cardContainer")

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            //Get the meta data of this folder 
            let a = await fetch(`/songs/${folder}/info.json`)
            let responce = await a.json();
            console.log(responce);
            cardContainer.innerHTML = cardContainer.innerHTML + `
            <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                <!-- Green circular button -->
                                <circle cx="20" cy="20" r="20" fill="#1DB954" />

                                <!-- White play icon -->
                                <polygon points="17,14 29,20 17,26" fill="white" />
                            </svg>

                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${responce.title}</h2>
                        <p>${responce.discription}</p>

                    </div>
            `


        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)

        })
    })

    // console.log(anchors);

}

async function main() {

    await getSongs("songs/ncs")
    // console.log(songs);

    //Display all the albums in this page
    displayAlbums();


    play.addEventListener("click", () => {
        // if (currentsongs.pause) {
        //     currentsongs.play()
        //     play.src  = "pause.svg"
        // }
        // else {
        //     currentsongs.pause()
        //     play.src  = "play.svg"
        // }
        // Somewhere in your code:
        if (currentsongs.paused) {           // Audio is currently stopped
            currentsongs.play();               // start it
            play.src = "img/pause.svg";            // show the pause icon
        } else {                             // Audio is playing right now
            currentsongs.pause();              // stop it
            play.src = "img/play.svg";             // show the play icon
        }

    })

    currentsongs.addEventListener("timeupdate", () => {
        // console.log(currentsongs.currentTime,currentsongs.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsongs.currentTime)}/${formatTime(currentsongs.duration)}`
        document.querySelector(".circle").style.left = (currentsongs.currentTime / currentsongs.duration) * 100 + "%";

    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = e.offsetX / e.target.getBoundingClientRect().width * 100
        // console.log(e.offsetX/e.target.getBoundingClientRect().width *100);
        document.querySelector(".circle").style.left = percent + "%"
        currentsongs.currentTime = ((currentsongs.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    previous.addEventListener("click", () => {
        console.log("prev");
        let index = songs.indexOf(currentsongs.src.split("/").slice(-1)[0])
        // let index = songs.indexOf(currentsongs.src.split("/").pop())  -> it is same 
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    })
    next.addEventListener("click", () => {
        // currentsongs.pause()
        console.log("next");
        // console.log(currentsongs.src);
        // console.log(currentsongs.src.next);
        let index = songs.indexOf(currentsongs.src.split("/").slice(-1)[0])
        // let index = songs.indexOf(currentsongs.src.split("/").pop())  -> it is same 
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })




}
main()

