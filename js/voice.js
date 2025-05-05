// ____________________ MICRO ____________________


let voice_recorder;
let voice_chunks=[];
let voice_enabled=0;
let voice_send=[];


function voice_setup(){


if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){


navigator.mediaDevices.getUserMedia({audio:true})




.then(function(stream){


let audio_types=["audio/webm\;codecs=opus","audio/webm"];
let audio_types_found="no";


for(let n in audio_types) {
if(MediaRecorder.isTypeSupported(audio_types[n])){
voice_recorder=new MediaRecorder(stream,{audioBitsPerSecond:16000,mimeType:audio_types[n]});
audio_types_found=1;
break;
}
}




if(audio_types_found!="no"){
voice_recorder.ondataavailable=function(e){
voice_chunks.push(e.data);
}
voice_recorder.onstop=function(e){
voice_send.push(new Blob(voice_chunks,{"type":audio_types[audio_types_found]}));
voice_chunks=[];
}
voice_enabled=1;
document.getElementById("voice_status").innerHTML="MICRO ON";
}


})




.catch(function(err){
document.getElementById("voice_status").innerHTML="MICRO OFF";
console.log('getUserMedia error: '+err);
});


}
else{
document.getElementById("voice_status").innerHTML="MICRO ABSCENT";
}


}


function voice_start(){
if(voice_recorder.state=="inactive"){
voice_recorder.start();
console.log(voice_recorder.state);
}
}


function voice_stop(){
if(voice_recorder.state=="recording"){
voice_recorder.stop();
console.log(voice_recorder.state);
}
}


voice_setup();
