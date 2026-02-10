console.log("Let's write JS");

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

//function to return songs from our songs directory  
async function main(){
    //get the list of all the songs
    let songs= await getSongs();
    console.log(songs);

    //putting the songs into the songList
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML= songUL.innerHTML + `<li> 
        ${song.replaceAll("%20"," ").replaceAll("s%5C"," ").replaceAll("%C3"," ")} </li>`;
    }

    //play the first song
    let audio = new Audio(songs[0]);
  

    audio.addEventListener("loadeddata", ()=>{
        //   audio.play()
        let duration= audio.duration;
        console.log(audio.duration, audio.currentSrc,audio.currentTime); 
    });
    //  document.getElementById("playSong").addEventListener("click", () => {
    //     audio.play();
    // });
}
main();

