let inputFileTag = document.querySelector("#fileInput")
let sourceTag = document.querySelector("#dataSource")
let audioTag = document.querySelector("#audioTag")
let playBtn = document.querySelector("#playBtn")
let volumeSlider = document.querySelector("#volume")
let panSlider = document.querySelector("#panner");

// for legacy browsers
const AudioContext = window.AudioContext || window.webkitAudioContext; // audio context for legacy browsers (not supported)

const audioContext = new AudioContext(); // make a audioContext

const gainNode = audioContext.createGain(); // the gain node for volume control

const pannerOptions = { pan : 0 }; // pan options for panning (stereo panning)

const pannerNode = new StereoPannerNode(audioContext, pannerOptions); // the panner node for pan control




let track ; // audioTrack

playBtn.disabled = true;

// input an audio file
inputFileTag.addEventListener("change",()=>{
    readFile(); // reading file
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
    sourceTag.src = track; // setting track as audio source
    audioTag.load(); // loading the track on audio element
    // audioTag.play(); 
    attachToAudioGraph();
}

function attachToAudioGraph(){
    playBtn.disabled = false; // enable the playbtn
    track = audioContext.createMediaElementSource(audioTag) // creating a mediasource for audio context
    // track.connect(audioContext.destination)
    // track.connect(gainNode).connect(audioContext.destination)
    track.connect(gainNode).connect(pannerNode).connect(audioContext.destination) //connect all nodes and destination to track(mediasource) (learn more on mdn [[https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API#audio_context]])
    
}


playBtn.addEventListener("click",()=>{
    playPauseHandler(); // handle playpause
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
    playBtn.dataset.playing = "false" // if track ended set playing attribute to false
},false)


volumeSlider.addEventListener("input",()=>{
    gainNode.gain.value = volumeSlider.value; // control volume
},false)

panSlider.addEventListener("input", ()=>{
    pannerNode.pan.value = panSlider.value; // control gain
},false)