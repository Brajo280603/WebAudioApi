let inputFileTag = document.querySelector("#fileInput")
let sourceTag = document.querySelector("#dataSource")
let audioTag = document.querySelector("#audioTag")


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
    audioTag.play();
}


