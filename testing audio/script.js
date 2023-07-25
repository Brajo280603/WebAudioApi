let inputFileTag = document.querySelector("#fileInput")
let sourceTag = document.querySelector("#dataSource")
let audioTag = document.querySelector("#audioTag")

inputFileTag.addEventListener("change",()=>{
    readFile();
})

function readFile(){
    const reader = new FileReader();

    let file = inputFileTag.files[0];

    reader.addEventListener("load",()=>{
        console.log(reader.result)
        let filetypestr = file.type;

        if(filetypestr.match("audio.*")){
            playAudio(reader.result)
        }
        else{
            alert("not an audio file")
        }
    })

    if(file){
        console.log(file)
        reader.readAsDataURL(file);

    }
}


function playAudio(track){
    sourceTag.src = track;
    audioTag.load();
}