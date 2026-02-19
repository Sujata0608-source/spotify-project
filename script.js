console.log("Let's write JS");
let currentSong=new Audio();
async function getSongs(){
    
    let a=await fetch("http://127.0.0.1:3000/songs/")
    let response= await a.text();
    //this gives us the song list that we are adding
    // console.log(response)

    let div= document.createElement("div")
    div.innerHTML=  response;
    //the list of all things that has an anchor tag to it
    let as=div.getElementsByTagName("a")
    let songs=[];
    
    // 
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("song")[1]);
        } 
        
    }
    return songs;
      
}

//function playMusic
const playMusic= (track)=>{
// let audio= new Audio("/songs/"+track);   =>this lets all the songs play at once simultaneously if clicked upon, not one at a time

currentSong.src="/songs/"+track;
currentSong.play();
play.src="pause.svg"
}

//function to return songs from our songs directory  
async function main(){

    
    //get the list of all the songs in the form of an array
    let songs= await getSongs();
   

    //putting the songs into the songList using JS in the library section
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML= songUL.innerHTML + `<li>
        <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ").replaceAll("s%5C"," ").replaceAll("%C3"," ")}</div>
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
   Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{

        console.log(e.querySelector(".info").firstElementChild.innerHTML);

        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        
    })
   })

   //attach an event listener to songbuttons
   play.addEventListener("click", ()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src="pause.svg"
    }
    else{
        currentSong.pause()
        play.src="play.svg"
    }
   })

    // //play the first song
    // let audio = new Audio(songs[0]);
  

    // audio.addEventListener("loadeddata", ()=>{
    //     //   audio.play()
    //     let duration= audio.duration;
    //     console.log(audio.duration, audio.currentSrc,audio.currentTime); 
    // });
    
    //  document.getElementById("playSong").addEventListener("click", () => {
    //     audio.play();
    // });
}
main();

