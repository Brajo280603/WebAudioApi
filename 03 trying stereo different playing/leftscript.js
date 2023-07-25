let inputFileTagL = document.querySelector("#fileInputL")
let sourceTagL = document.querySelector("#dataSourceL")
let audioTagL = document.querySelector("#audioTagL")
let playBtnL = document.querySelector("#playBtnL")
let volumeSliderL = document.querySelector("#volumeL")
let panSliderL = document.querySelector("#pannerL");

// for legacy browsers
// const AudioContext = window.AudioContext || window.webkitAudioContext; // audio context for legacy browsers (not supported)

const audioContextL = new AudioContext(); // make a audioContextL

const gainNodeL = audioContextL.createGain(); // the gain node for volume control

const pannerOptionsL = { pan : -1 }; // pan options for panning (stereo panning) -1 for left pan

const pannerNodeL = new StereoPannerNode(audioContextL, pannerOptionsL); // the panner node for pan control




let trackL ; // audioTrack

playBtnL.disabled = true;

// input an audio file
inputFileTagL.addEventListener("change",()=>{
    readFileL(); // reading file
})


// read the input file
function readFileL(){
    const reader = new FileReader(); // fileReader 

    let file = inputFileTagL.files[0]; // file from input

    reader.addEventListener("load",()=>{ // reader after loading the file
        console.log(reader.result)
        let filetypestr = file.type;

        if(filetypestr.match("audio.*")){ // check if its a audio file or not
            playAudioL(reader.result)      // if a file play the file 
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


function playAudioL(trackL){ // set the audio file as source trackL and load with audio tag and play
    sourceTagL.src = trackL; // setting trackL as audio source
    audioTagL.load(); // loading the trackL on audio element
    // audioTagL.play(); 
    attachToAudioGraphL();
}

function attachToAudioGraphL(){
    playBtnL.disabled = false; // enable the playBtnL
    trackL = audioContextL.createMediaElementSource(audioTagL) // creating a mediasource for audio context
    // trackL.connect(audioContextL.destination)
    // trackL.connect(gainNodeL).connect(audioContextL.destination)
    trackL.connect(gainNodeL).connect(pannerNodeL).connect(audioContextL.destination) //connect all nodes and destination to trackL(mediasource) (learn more on mdn [[https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API#audio_context]])
    
}


playBtnL.addEventListener("click",()=>{
    playPauseHandlerL(); // handle playpause
},false)

function playPauseHandlerL(){
    
    // if context is in suspended state (autoplay policy)
    if(audioContextL.state === 'suspended'){
        audioContextL.resume();
    }

    // play or pause trackL depending on state
    if(playBtnL.dataset.playing === 'false'){
        audioTagL.play();
        playBtnL.dataset.playing = 'true';
    }else if(playBtnL.dataset.playing === 'true'){
        audioTagL.pause();
        playBtnL.dataset.playing = 'false';
    }


    
}

audioTagL.addEventListener("ended",()=>{
    playBtnL.dataset.playing = "false" // if trackL ended set playing attribute to false
},false)


volumeSliderL.addEventListener("input",()=>{
    gainNodeL.gain.value = volumeSliderL.value; // control volume
},false)

panSliderL.addEventListener("input", ()=>{
    pannerNodeL.pan.value = panSliderL.value; // control gain
},false)