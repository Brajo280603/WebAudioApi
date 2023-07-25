let inputFileTag = document.querySelector("#fileInput")
let sourceTag = document.querySelector("#dataSource")
let audioTag = document.querySelector("#audioTag")
let playBtn = document.querySelector("#playBtn")
let volumeSlider = document.querySelector("#volume")
let panSlider = document.querySelector("#panner");

// for legacy browsers
const AudioContext = window.AudioContext || window.webkitAudioContext; 

const audioContext = new AudioContext();

const gainNode = audioContext.createGain();

const pannerOptions = { pan : 0 };

const pannerNode = new StereoPannerNode(audioContext, pannerOptions);




let track ; // audioTrack

playBtn.disabled = true;

// input an audio file
inputFileTag.addEventListener("change",()=>{
    readFile();
})


// read the input file
function readFile(){
    const reader = new FileReader(); // fileReader 

    let file = inputFileTag.files[0]; // file from input

    reader.addEventListener("load",()=>{ // reader after loading the file
        console.log(reader.result)
        let filetypestr = file.type;

        if(filetypestr.match("audio.*")){ // check if its a audio file or not
            playAudio(reader.result)      // if a file play the file 
        }
        else{
            alert("not an audio file")  // if not give a warning
        }
    })

    if(file){               // if file exists reader loads it as a DataURL
        console.log(file)
        reader.readAsDataURL(file);

    }
}


function playAudio(track){ // set the audio file as source track and load with audio tag and play
    sourceTag.src = track;
    audioTag.load();
    // audioTag.play(); 
    attachToAudioGraph(track);
}

function attachToAudioGraph(element){
    playBtn.disabled = false;
    track = audioContext.createMediaElementSource(audioTag)
    // track.connect(audioContext.destination)
    // track.connect(gainNode).connect(audioContext.destination)
    track.connect(gainNode).connect(pannerNode).connect(audioContext.destination)
    
}


playBtn.addEventListener("click",()=>{
    playPauseHandler();
},false)

function playPauseHandler(){
    
    // if context is in suspended state (autoplay policy)
    if(audioContext.state === 'suspended'){
        audioContext.resume();
    }

    // play or pause track depending on state
    if(playBtn.dataset.playing === 'false'){
        audioTag.play();
        playBtn.dataset.playing = 'true';
    }else if(playBtn.dataset.playing === 'true'){
        audioTag.pause();
        playBtn.dataset.playing = 'false';
    }


    
}

audioTag.addEventListener("ended",()=>{
    playBtn.dataset.playing = "false"
},false)


volumeSlider.addEventListener("input",()=>{
    gainNode.gain.value = volumeSlider.value;
},false)

panSlider.addEventListener("input", ()=>{
    pannerNode.pan.value = panSlider.value;
},false)