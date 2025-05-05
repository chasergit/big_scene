"use strict"


//____________________ TEXTURE AND MODEL LOADER ____________________


let loader_textures_show=1; // 0 - DO NOT DISPLAY TEXTURE LIST IN CONSOLE, 1 - DISPLAY
let loader_models_show=1; // 0 - DO NOT DISPLAY THE LIST OF MODELS IN THE CONSOLE, 1 - DISPLAY
let loader_sounds_show=1; // 0 - DO NOT DISPLAY THE LIST OF SOUNDS IN THE CONSOLE, 1 - DISPLAY


let loader_total=0; // HOW MUCH SHOULD WE LOAD?
let loader_loaded=0; // HOW MUCH IS LOADED
let loader_textures_loaded=0; // HOW MANY TEXTURES ARE LOADED
let loader_models_loaded=0; // HOW MANY MODELS ARE LOADED
let loader_sounds_loaded=0; // HOW MANY SOUNDS LOADED
let loader_errors=0; // 0 - NO ERRORS, 1 - THERE ARE


//____________________ DOWNLOAD MANAGER ____________________


let loadingManager=new THREE.LoadingManager();


loadingManager.onError=function(item,loaded,total){
loader_errors=1;
console.log("%c"+item,"font-weight:bold;color:#ff0000");
loadingManager=function(){};
}


//____________________ DOWNLOAD COUNTER ____________________


loadingManager.itemStart=function(item){
loader_total++;
}


loadingManager.onProgress=function(item,loaded,total){


let found=0;


if(item.match(/(\.jpe?g($|\?)|\.png($|\?)|\.gif($|\?)|\.bmp($|\?)|\.dds($|\?)|\.hdr($|\?))/gi)){
found=1;
loader_textures_loaded++;
if(loader_textures_show){ console.log("%c"+item,"font-weight:bold;color:#004090"); }
}


if(item.match(/(\.obj($|\?)|\.fbx($|\?)|\.gltf($|\?)|\.glb($|\?)|\.bin($|\?))/gi)){
found=1;
loader_models_loaded++;
if(loader_models_show){ console.log("%c"+item,"font-weight:bold;color:#448A44"); }
}


if(item.match(/(\.ogg($|\?)|\.mp3($|\?)|\.wav($|\?))/gi)){
found=1;
loader_sounds_loaded++;
if(loader_sounds_show){ console.log("%c"+item,"font-weight:bold;color:#A73CEE"); }
}


if(found==0){ console.log("%c ADD THIS FILE FORMAT: "+item+" ","background:#ff0000;color:#ffffff"); return; }


loader_loaded++;


};


//____________________ WE START THE FILE DOWNLOAD CHECK WHEN THE PAGE IS COMPLETELY LOADED ____________________


document.addEventListener("DOMContentLoaded",()=>{
loader_check();
});


//____________________ CHECKING FILE DOWNLOADING ____________________


function loader_check(){


document.getElementById("loading_amount").innerHTML=loader_loaded+"/"+loader_total;


if(loader_total==loader_loaded){
if(loader_errors){ document.getElementById("loading").innerHTML="Loading error"; }
else{
console.log("%c TEXTURE: "+loader_textures_loaded+" ","background:#222;font-weight:bold;color:#bada55");
console.log("%c MODELS: "+loader_models_loaded+" ","background:#222;font-weight:bold;color:#bada55");
console.log("%c SOUNDS: "+loader_sounds_loaded+" ","background:#222;font-weight:bold;color:#bada55");
console.log("%c TOTAL: "+loader_total+" ","background:#222;font-weight:bold;color:#bada55");
console.log("%c --> ALL LOADED <-- ","background:#222;font-weight:bold;color:#bada55;");
setTimeout(()=>{ init_core(); init_end(); },100);
}
return;
}


requestAnimationFrame(loader_check);


}


//____________________ SOUNDS ____________________


let sounds_total=sounds_list.length;


//____________________ SOUND LOADER ____________________


const sounds_loader=new THREE.FileLoader(loadingManager);
sounds_loader.setResponseType("arraybuffer");


for(let n=0;n<sounds_total;n++){


sounds_loader.load(sounds_list[n][1],function(buffer){
try{
const bufferCopy=buffer.slice(0);
sounds_context.decodeAudioData(bufferCopy,function(decoded_buffer){
sound[sounds_list[n][0]]=decoded_buffer;
});
}
catch(e){}
});


}