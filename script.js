console.log("Let's write JS");
let currentSong = new Audio();
let songs;
let currFolder;

//function to convert seconds to minutes:seconds format
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // This adds a leading zero if the number is less than 10
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder; //marks the folder that we are fetching songs from currently
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;

    //the list of all things that has an anchor tag to it
    let as = div.getElementsByTagName("a")
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // This splits by "/" OR "%5C" OR "\"
            let parts = element.href.split(/\/(?=[^\/]*$)|%5C/);

            // Take the last item in the array
            let fileName = parts[parts.length - 1];
            songs.push(fileName);
        }
    }

    //show all songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${decodeURI(song)}</div>
                                <div>Harry</div>              
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div> </li>`;
    }

    //attach and eventlistener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            // console.log(e.querySelector(".info").firstElementChild.innerHTML);

            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    return songs;
}

//function playMusic
const playMusic = (track, pause = false) => {
    // let audio= new Audio("/songs/"+track);   =>this lets all the songs play at once simultaneously if clicked upon, not one at a time
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play() // This is skipped because pause is true... GOOD.
        play.src = "pause.svg"
    }
    // currentSong.src="/songs/"+track;
    // currentSong.play();

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}


async function displayAbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    // console.log(e.href);

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/%5Csongs")) {
            let c = e.href.split("%5C").slice(-1)[0];
            let folder = c.split("/")[0];


            //get the metdata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response);

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder=${folder}   class="card">
                        <!--play button-->
                        <div class="play">
                            <img src="playbtn.svg" alt="">
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="card1">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`

        }
    }


    //Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e);

        e.addEventListener("click", async item => {
            console.log(item, item.currentTarget.dataset);

            //the code to load the folder
            // songs=
            await getSongs(`songs/${item.currentTarget.dataset.folder}`)

        })
    })

}

//function to return songs from our songs directory  
async function main() {
    //get the list of all the songs
    songs = await getSongs("songs/ncs");
    //to keep a default song playing whenever we reload the page
    playMusic(songs[0], true)

    //Display all the albums on the page
    displayAbums()



    //attach an event listener to songbuttons
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })




    //listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    //add an event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //add an event listener to hamburger
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //add an event listener to previous and next
    previous.addEventListener("click", () => {
        console.log('Previous clicked');
        console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }


    })

    //add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log('next clicked');

        //getting the index of this song in the array of "songs"
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
        else {
            //after reachingthe last song, it goes back to the first song
            playMusic(songs[0]);
        }
        //here using 'length' represents  window.length by default which is usually 0, that's why the logic (index+1)>length works fine but its a bit risky
    })

    //add an event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        
        currentSong.volume = parseInt(e.target.value) / 100

    })

    //add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click",e=>{
        
        if(e.target.src.includes("volume.svg")){
            e.target.src="mute.svg"
            // e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src="volume.svg"
            currentSong.volume=0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
    })



}
main();

