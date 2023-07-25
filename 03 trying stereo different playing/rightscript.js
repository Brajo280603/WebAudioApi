let inputFileTagR = document.querySelector("#fileInputR")
let sourceTagR = document.querySelector("#dataSourceR")
let audioTagR = document.querySelector("#audioTagR")
let playBtnR = document.querySelector("#playBtnR")
let volumeSliderR = document.querySelector("#volumeR")
let panSliderR = document.querySelector("#pannerR");

// for legacy browsers
// const AudioContext = window.AudioContext || window.webkitAudioContext; // audio context for legacy browsers (not supported)

const audioContextR = new AudioContext(); // make a audioContextR

const gainNodeR = audioContextR.createGain(); // the gain node for volume control

const pannerOptionsR = { pan : 1 }; // pan options for panning (stereo panning) 1 for right pan

const pannerNodeR = new StereoPannerNode(audioContextR, pannerOptionsR); // the panner node for pan control




let track ; // audioTrack

playBtnR.disabled = true;

// input an audio file
inputFileTagR.addEventListener("change",()=>{
    readFileR(); // reading file
})


// read the input file
function readFileR(){
    const reader = new FileReader(); // fileReader 

    let file = inputFileTagR.files[0]; // file from input

    reader.addEventListener("load",()=>{ // reader after loading the file
        console.log(reader.result)
        let filetypestr = file.type;

        if(filetypestr.match("audio.*")){ // check if its a audio file or not
            playAudioR(reader.result)      // if a file play the file 
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


function playAudioR(track){ // set the audio file as source track and load with audio tag and play
    sourceTagR.src = track; // setting track as audio source
    audioTagR.load(); // loading the track on audio element
    // audioTagR.play(); 
    attachToAudioGraphR();
}

function attachToAudioGraphR(){
    playBtnR.disabled = false; // enable the playbtn
    track = audioContextR.createMediaElementSource(audioTagR) // creating a mediasource for audio context
    // track.connect(audioContextR.destination)
    // track.connect(gainNodeR).connect(audioContextR.destination)
    track.connect(gainNodeR).connect(pannerNodeR).connect(audioContextR.destination) //connect all nodes and destination to track(mediasource) (learn more on mdn [[https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API#audio_context]])
    
}


playBtnR.addEventListener("click",()=>{
    playPauseHandlerR(); // handle playpause
},false)

function playPauseHandlerR(){
    
    // if context is in suspended state (autoplay policy)
    if(audioContextR.state === 'suspended'){
        audioContextR.resume();
    }

    // play or pause track depending on state
    if(playBtnR.dataset.playing === 'false'){
        audioTagR.play();
        playBtnR.dataset.playing = 'true';
    }else if(playBtnR.dataset.playing === 'true'){
        audioTagR.pause();
        playBtnR.dataset.playing = 'false';
    }


    
}

audioTagR.addEventListener("ended",()=>{
    playBtnR.dataset.playing = "false" // if track ended set playing attribute to false
},false)


volumeSliderR.addEventListener("input",()=>{
    gainNodeR.gain.value = volumeSliderR.value; // control volume
},false)

panSliderR.addEventListener("input", ()=>{
    pannerNodeR.pan.value = panSliderR.value; // control gain
},false)