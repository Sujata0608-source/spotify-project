console.log("Let's write JS");
let currentSong = new Audio();

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

async function getSongs() {

    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    //this gives us the song list that we are adding
    // console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response;
    //the list of all things that has an anchor tag to it
    let as = div.getElementsByTagName("a")
    let songs = [];

    // 
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("songs%5C")[1]);
        }

    }
    return songs;

}

//function playMusic
const playMusic = (track, pause = false) => {
    // let audio= new Audio("/songs/"+track);   =>this lets all the songs play at once simultaneously if clicked upon, not one at a time
    currentSong.src = "/songs/" + track;
    if (!pause) {
        currentSong.play() // This is skipped because pause is true... GOOD.
        play.src = "pause.svg"
    }
    // currentSong.src="/songs/"+track;
    // currentSong.play();

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

//function to return songs from our songs directory  
async function main() {


    //get the list of all the songs in the form of an array
    let songs = await getSongs();
    //to keep a default song playing whenever we reload the page
    playMusic(songs[0], true)


    //putting the songs into the songList using JS in the library section
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
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
    //we are getting an array of all the elements having 'li' tag to it
    //basically, accessing the lists of songs
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            console.log(e.querySelector(".info").firstElementChild.innerHTML);

            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

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
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

 


}
main();

