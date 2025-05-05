"use strict"


/*
160721 START OF DEVELOPMENT
160821 FIRST VERSION
020424 NOW TRANSMITTING ALL PARAMETERS IS MANDATORY TO AVOID CONFUSSION
210424 ADDED DynamicsCompressor. HELPS REMOVE LOUD SOUND WHEN MULTIPLE SOUNDS PLAY AT THE SAME TIME
220424 WE MANAGED TO REDUCE THE RAM USAGE WHEN USING CONVOLVER EFFECTS WITH A LARGE MIX WITH NORMAL SOUND.
FOR EXAMPLE, WE NEEDED 100 SOUNDS OF SHOT WITH ECHO EFFECT. IF WE CREATE 100 SEPARATE CONVOLVER ECHO EFFECTS, THEN THIS WILL BE ABOUT 1GB OF MEMORY.
AND IF YOU CREATE ONE ECHO EFFECT AND SIMPLY ATTACH 100 VOLUME CONTROLS TO IT, THEN 10MB.


LAUNCHING ONE SOUND WITH AND WITHOUT EFFECT TAKES 0.10 ms, 10 SOUNDS 0.50 ms, 20 SOUNDS 0.90 ms
BUT THIS IS IF YOU LAUNCH ALL 20 SOUNDS AT THE SAME TIME, AND SINCE THIS IS UNLIKELY, IT IS NORMAL.
disconnect TAKES 0 ms
WHEN CREATING A NEW FUNCTION, DO NOT FORGET TO CLEAR delete music_fade_in[name]; delete music_fade_out[name]; delete sounds_fade_in[name]; delete sounds_fade_out[name];
*/


let music_speed=1; // OVERALL MUSIC SPEED
let sounds_speed=1; // GENERAL SPEED OF SOUNDS
let music_status=1; // 0 - PAUSED, 1 - RUNNING
let sounds_status=1; // 0 - PAUSED, 1 - RUNNING


// DATA


let sound=[]; // SOUNDS IN BUFFER
let music=[]; // MUSIC PLAYING NOW
let music_fade_in=[]; // MUSIC WITH SMOOTH ENTRY
let music_fade_out=[]; // MUSIC WITH SMOOTH OUTPUT
let sounds_fade_in=[]; // SOUND WITH SMOOTH ENTRY
let sounds_fade_out=[]; // SOUND WITH SMOOTH OUTPUT
let sounds=[]; // SOUNDS PLAYING NOW
let sound_n=0; // SOUND COUNTER FOR CREATING DIFFERENT SOUND NAMES
let music_effect=[]; // EFFECTS FOR MUSIC
let sound_effect=[]; // EFFECTS FOR SOUNDS


// CONTEXT


window.AudioContext=window.AudioContext || window.webkitAudioContext;
let sounds_context=new AudioContext();
let sounds_destination=sounds_context.destination;
let sounds_listener=sounds_context.listener;


// GENERAL VOLUMES


let menu_volume=sounds_context.createGain();
menu_volume.gain.value=1; // GENERAL MENU VOLUME
menu_volume.connect(sounds_destination);
let music_volume=sounds_context.createGain();
music_volume.gain.value=1; // OVERALL MUSIC VOLUME
music_volume.connect(sounds_destination);
let sounds_volume=sounds_context.createGain();
sounds_volume.gain.value=1; // OVERALL SPEED OF SOUNDS
const compressor = sounds_context.createDynamicsCompressor();
/*
compressor.threshold.setValueAtTime(-50, sounds_context.currentTime);
compressor.knee.setValueAtTime(40, sounds_context.currentTime);
compressor.ratio.setValueAtTime(12, sounds_context.currentTime);
compressor.attack.setValueAtTime(0, sounds_context.currentTime);
compressor.release.setValueAtTime(0.25, sounds_context.currentTime);
*/
/*
compressor.threshold.setValueAtTime(-5.0,sounds_context.currentTime); // In Decibels
compressor.knee.setValueAtTime(0,sounds_context.currentTime); // In Decibels
compressor.ratio.setValueAtTime(40.0, sounds_context.currentTime); // In Decibels
compressor.attack.setValueAtTime(0.001, sounds_context.currentTime); // Time is seconds
compressor.release.setValueAtTime(0.1, sounds_context.currentTime); // Time is seconds
*/
/*
compressor.threshold.value = -50; // Threshold
compressor.knee.value = 40; // Soft/hard compression mode
compressor.ratio.value = 12; // Compression ratio
compressor.attack.value = 0.003; // Rise time
compressor.release.value = 0.25; // Decay time
*/
compressor.connect(sounds_destination);
//sounds_volume.connect(sounds_destination);
sounds_volume.connect(compressor);


// CREATE A FILTER AND VOLUMES IN ADVANCE SO WE DON'T HAVE TO CREATE EVERY TIME AND THERE ARE LESS FPS JUMPS


let sounds_biquad_i=[];
let sounds_panner_i=[];
let sounds_volume_f=[];
let sounds_volume_i=[];
let sounds_volume_n=0;


function sounds_volume_gen(amount){


let max=sounds_volume_n+amount;
for(let n=sounds_volume_n;n<max;n++){
sounds_biquad_i[n]=sounds_context.createBiquadFilter();
sounds_biquad_i[n].type="lowpass";
sounds_volume_i[n]=sounds_context.createGain();
sounds_volume_i[n].volume=1;
sounds_volume_i[n].gain.value=1;
sounds_panner_i[n]=sounds_context.createPanner();
sounds_panner_i[n].panningModel="HRTF";
sounds_panner_i[n].connect(sounds_volume_i[n]);
sounds_volume_f.push(n);
sounds_volume_n++;
}


}


// CREATE EFFECTS IN ADVANCE, BECAUSE CREATING ONE EFFECT TAKES 1-30 MS


function music_effects_gen(){


for(let n=0;n<sounds_total;n++){
let item=sounds_list[n];
if(item[1].match(/sounds\/effects/)){
music_effect[item[0]]=sounds_context.createConvolver();
music_effect[item[0]].buffer=sound[item[0]];
music_effect[item[0]].connect(music_volume);
}
}


}


function sounds_effects_gen(){


for(let n=0;n<sounds_total;n++){
let item=sounds_list[n];
if(item[1].match(/sounds\/effects/)){
sound_effect[item[0]]=sounds_context.createConvolver();
sound_effect[item[0]].buffer=sound[item[0]];
sound_effect[item[0]].connect(sounds_volume);
}
}


}


// ____________________ 3D LISTENER UPDATE ____________________


function sounds_listener_update(){


let p=camera.matrixWorld.elements,q=camera.quaternion,qx=qx,qy=qy,qz=qz,qw=qw;
sounds_listener.positionX.value=p[12];
sounds_listener.positionY.value=p[13];
sounds_listener.positionZ.value=p[14];
sounds_listener.forwardX.value=-qy*qw+qz*-qx+qx*-qz+qw*-qy;
sounds_listener.forwardY.value=qx*qw+qz*-qy-qw*-qx+qy*-qz;
sounds_listener.forwardZ.value=-qw*qw+qz*-qz-qy*-qy-qx*-qx;


}


// ____________________ 3D SOUND ORIENTATION UPDATE ____________________


// 100 UPDATES IN 0.8MS, 50 IN 0.4MS, 20 IN 0.2MS, 10 IN 0.1MS


function sounds_panner_update(item,sound_panner){


let p=item.matrixWorld.elements,q=item.quaternion,qx=qx,qy=qy,qz=qz,qw=qw;
sound_panner.positionX.value=p[12];
sound_panner.positionY.value=p[13];
sound_panner.positionZ.value=p[14];
sound_panner.orientationX.value=qy*qw-qz*-qx-qx*-qz-qw*-qy;
sound_panner.orientationY.value=-qx*qw-qz*-qy+qw*-qx-qy*-qz;
sound_panner.orientationZ.value=qw*qw-qz*-qz+qy*-qy+qx*-qx;


}


// ____________________ CHANGING THE GENERAL MENU VOLUME LEVEL ____________________


function menu_volume_set(v){


menu_volume.gain.setTargetAtTime(Number(v),sounds_context.currentTime,0.01);


}


// ____________________ PLAY SOUND IN MENU ____________________


function menu_play(track,volume,speed){


// track - WHAT SOUND TO PLAY
// volume - VOLUME // speed - PLAYBACK SPEED


let menu_sound=sounds_context.createBufferSource();
menu_sound.buffer=sound[track];
menu_sound.playbackRate.value=speed;
menu_sound.gain_i=sounds_context.createGain();
menu_sound.gain_i.gain.value=volume;
menu_sound.gain_i.connect(menu_volume);
menu_sound.connect(menu_sound.gain_i);
menu_sound.onended=function(){ this.disconnect(); this.gain_i.disconnect(); this.gain_i=null; }
menu_sound.start();


}


// ____________________ CHANGING THE OVERALL MUSIC VOLUME ____________________


function music_volume_set(v){


music_volume.gain.setTargetAtTime(Number(v),sounds_context.currentTime,0.01);


}


// ____________________ CHANGING THE OVERALL SPEED OF MUSIC ____________________


function music_speed_set(v){


music_speed=Number(v);


for(let name in music){
try{ music[name].playbackRate.value=music[name].speed*music_speed; }
catch(e){}
}


}


// ____________________ PLAY MUSIC ____________________


function music_play(name,track,loop,effect,speed,detune,volume){


// name - YOU CAN SPECIFY YOUR OWN MUSIC NAME OR null
// track - WHAT MUSIC TO PLAY
// loop - ENDLESS SOUND true OR ONE-TIME false
// effect - EFFECT NAME OR false
// speed - SPEED // detune - PITCH // volume - VOLUME

sound_n++;
let name_c;
if(name==null){ name_c=track+"_"+sound_n; }
else{ name_c=name; music_delete_fast(name); }
music[name_c]=sounds_context.createBufferSource();
let item=music[name_c];
item.buffer=sound[track];
item.loop=loop;
item.speed=speed;
item.detune.value=detune;
item.playbackRate.value=speed*music_speed*music_status;
item.gain_i=sounds_context.createGain();
item.gain_i.gain.value=volume;
item.volume=volume;
if(effect){
item.gain_i.connect(music_effect[effect]);
}
else{
item.gain_i.connect(music_volume);
}
item.connect(item.gain_i);
// onended FIRES WHEN stop() IS CALLED AND WHEN THE SOUND ENDS AND WHEN THE VALUE OF start(999) IS GREATER THAN THE DURATION OF THE SOUND
item.onended=function(){
try{
delete music_fade_in[name_c];
delete music_fade_out[name_c];
music[name_c].disconnect();
music[name_c].gain_i.disconnect();
music[name_c].gain_i=null;
delete music[name_c];
}
catch(e){}
}
item.start();
return name_c;


}


// ____________________ PAUSE ONE MUSIC OR ALL ____________________


function music_pause(name){


if(name){
try{ music[name].playbackRate.value=0; return true; }
catch(e){ return false; }
}
else{
music_status=0;
for(let name in music){
try{ music[name].playbackRate.value=0; }
catch(e){}
}
}


}


// ____________________ RESUME ONE MUSIC OR ALL ____________________


function music_resume(name){


if(name){
try{ music[name].playbackRate.value=music[name].speed*music_speed; return true; }
catch(e){ return false; }
}
else{
music_status=1;
for(let name in music){
try{ music[name].playbackRate.value=music[name].speed*music_speed; }
catch(e){}
}
}


}


// ____________________ DELETE ONE MUSIC OR ALL - AT ONCE AND POSSIBLY WITH A WHEEZE ____________________


function music_delete_fast(name){


if(name){
try{ delete music_fade_in[name]; delete music_fade_out[name]; music[name].onended=null; music[name].stop(); music[name].disconnect(); music[name].gain_i.disconnect(); music[name].gain_i=null; delete music[name]; return true; }
catch(e){ return false; }
}
else{
music_fade_in=[];
music_fade_out=[];
for(let name in music){
try{ music[name].onended=null; music[name].stop(); music[name].disconnect(); music[name].gain_i.disconnect(); music[name].gain_i=null; delete music[name]; }
catch(e){}
}
}


}


// ____________________ DELETE ONE MUSIC OR ALL - SLOWLY AND WITHOUT WHEEZING ____________________


function music_delete_slow(name,time){


// name - MUSIC NAME FROM ARRAY music. OR "all" - ALL
// time - HOW LONG TO EXECUTE IN SECONDS. OR LEAVE BLANK, THEN THE DEFAULT TIME IS 0.01 SECOND


if(time<0.01){ time=0.01; }
if(name!="all"){
try{
delete music_fade_in[name];
delete music_fade_out[name];
music[name].gain_i.gain.setTargetAtTime(0,sounds_context.currentTime,time);
music[name].stop(sounds_context.currentTime+time);
return true;
}
catch(e){ return false; }
}
else{
music_fade_in=[];
music_fade_out=[];
for(let name in music){
try{
music[name].gain_i.gain.setTargetAtTime(0,sounds_context.currentTime,time);
music[name].stop(sounds_context.currentTime+time);
}
catch(e){}
}
}


}


// ____________________ SMOOTH MUSIC ENTRY ____________________


function music_fade_in_set(name,time,volume,speed){


// name - NAME OF MUSIC FROM ARRAY music, OR "all" - ALL
// time - HOW LONG TO EXECUTE IN MILLISECONDS. IF WHEEZING APPEARS, THEN SET MORE
// volume - SMOOTH ENTRY TO THE SPECIFIED VOLUME, OR -1, IE MUSIC WAS PAUSED AND NOW WE NEED TO RETURN THE VOLUME TO THE SAME VOLUME AS IT WAS
// speed - SPEED

if(name!="all"){
if(!music[name]){ return false; }
try{
music[name].speed=speed;
music[name].playbackRate.value=speed*music_speed*music_status;
}
catch(e){}
delete music_fade_in[name];
delete music_fade_out[name];
music_fade_in[name]={};
let item=music_fade_in[name];
item.time_total=time;
item.time_elapsed=0;
try{
item.volume_first=music[name].volume;
item.volume_in=volume-item.volume_first;
item.volume_to=volume;
if(volume<item.volume_first){ item.volume_in=0; }
if(volume==-1){ item.volume_in=item.volume_first; item.volume_first=0; item.volume_to=item.volume_in; }
return true;
}
catch(e){ delete music_fade_in[name]; return false; }
}
else{
music_fade_in=[];
music_fade_out=[];
for(let name in music){
try{
music[name].speed=speed;
music[name].playbackRate.value=speed*music_speed*music_status;
}
catch(e){}
music_fade_in[name]={};
let item=music_fade_in[name];
item.time_total=time;
item.time_elapsed=0;
try{
item.volume_first=music[name].volume;
item.volume_in=volume-item.volume_first;
item.volume_to=volume;
if(volume<item.volume_first){ item.volume_in=0; }
if(volume==-1){ item.volume_in=item.volume_first; item.volume_first=0; item.volume_to=item.volume_in; }
}
catch(e){ delete music_fade_in[name]; }
}
}


}


function music_fade_in_update(){


for(let name in music_fade_in){


let item=music_fade_in[name];
item.time_elapsed+=delta;
let volume=item.volume_first+item.volume_in*(item.time_elapsed/item.time_total);
if(volume>item.volume_to){ volume=item.volume_to; }
if(item.time_elapsed>=item.time_total){ volume=item.volume_to; delete music_fade_in[name]; }
try{
music[name].volume=volume;
music[name].gain_i.gain.value=volume;
}
catch(e){}


}


}


// ____________________ SMOOTH MUSIC OUTPUT ____________________


function music_fade_out_set(name,time,action){


// name - NAME OF MUSIC FROM ARRAY music, OR "all" - ALL
// time - HOW LONG TO COMPLETE IN MILLISECONDS. IF WHEEZING APPEARS, THEN SET MORE
// action - ACTION AT END: 0 - NOTHING, 1 - PAUSE, 2 - DELETE

if(name!="all"){
if(!music[name]){ return false; }
delete music_fade_in[name];
delete music_fade_out[name];
music_fade_out[name]={};
let item=music_fade_out[name];
item.time_total=time;
item.time_elapsed=0;
item.action=action;
try{ item.volume=music[name].volume; return true; }
catch(e){ delete music_fade_out[name]; return false; }
}
else{
music_fade_in=[];
music_fade_out=[];
for(let name in music){
music_fade_out[name]={};
let item=music_fade_out[name];
item.time_total=time;
item.time_elapsed=0;
item.action=action;
try{ item.volume=music[name].volume; }
catch(e){ delete music_fade_out[name]; }
}
}

}


function music_fade_out_update(){


for(let name in music_fade_out){


let item=music_fade_out[name];
item.time_elapsed+=delta;
let volume=item.volume*(1-item.time_elapsed/item.time_total);
if(0>volume){ volume=0; }
try{
music[name].volume=volume;
music[name].gain_i.gain.value=volume;
}
catch(e){}
if(item.time_elapsed>=item.time_total){
delete music_fade_out[name];
if(item.action==1){ music[name].playbackRate.value=0; }
if(item.action==2){ music_delete_fast(name); }
}


}


}


// ____________________ CHANGING THE OVERALL SOUND VOLUME ____________________


function sounds_volume_set(v){


sounds_volume.gain.setTargetAtTime(Number(v),sounds_context.currentTime,0.01);


}


// ____________________ CHANGING THE OVERALL SPEED OF SOUNDS ____________________


function sounds_speed_set(v){


sounds_speed=Number(v);


for(let name in sounds){
try{ sounds[name].playbackRate.value=sounds[name].speed*sounds_speed; }
catch(e){}
}


}


// ____________________ PLAY 2D OR 3D SOUND ____________________


function sounds_play(name,track,loop,effect,speed,detune,volume,frequency,type,distance,object,coneInnerAngle,coneOuterAngle,coneOuterGain,refDistance,rolloffFactor){


// name - YOU CAN SPECIFY YOUR OWN SOUND NAME OR null
// track - WHAT SOUND TO PLAY
// loop - ENDLESS SOUND true OR ONE-TIME false
// effect - EFFECT NAME OR false
// speed - SPEED // detune - PITCH, FOR EXAMPLE, FOR SOUND BEHIND A WALL OR IN THE DISTANCE
// volume - VOLUME // frequency - FREQUENCY, FOR EXAMPLE, FOR SOUND BEHIND A WALL OR IN THE DISTANCE. IF YOU DO NOT PLAN TO CHANGE, THEN false
// object - FOR 3D SOUND WE TRANSMIT MESH OR SOMETHING SIMILAR. IF 2D, THEN false
// coneInnerAngle - INNER CORNER. DEFAULT 360
// coneOuterAngle - OUTER CORNER WHEN YOU ARE BEHIND THE SOUNDING OBJECT. DEFAULT 360
// coneOuterGain - OUTER CORNER VOLUME LEVEL WHEN YOU ARE BEHIND THE SOUNDING OBJECT - OUTER CORNER. 0-1. DEFAULT 0
// refDistance - DISTANCE FROM WHICH THE SOUND WILL DECREASE. DEFAULT 1
// rolloffFactor - HOW FAST THE SOUND VOLUME SHOULD DECREASE, STARTING FROM refDistance. DEFAULT 1


sound_n++;
let name_c;
if(name==null){ name_c=track+"_"+sound_n; }
else{ name_c=name; sounds_delete_fast(name); }
sounds[name_c]=sounds_context.createBufferSource();
let item=sounds[name_c];
item.buffer=sound[track];
item.loop=loop;
item.speed=speed;
item.detune.value=detune;
item.playbackRate.value=speed*sounds_speed*sounds_status;
let volume_n=sounds_volume_f.pop();
if(volume_n==undefined){ sounds_volume_gen(10); volume_n=sounds_volume_f.pop(); console.log("Few sounds_volume_f. Changed to: "+sounds_volume_n); }
let volume_g=sounds_volume_i[volume_n];
volume_g.volume=volume;
volume_g.gain.value=volume;


if(effect){


if(frequency===false){
volume_g.connect(sound_effect[effect]);
}
else{
sounds_biquad_i[volume_n].connect(sound_effect[effect]);
volume_g.connect(sounds_biquad_i[volume_n]);
}


}
else{


if(frequency===false){
volume_g.connect(sounds_volume);
}
else{
sounds_biquad_i[volume_n].connect(sounds_volume);
volume_g.connect(sounds_biquad_i[volume_n]);
}


}


if(frequency!==false){ sounds_biquad_i[volume_n].frequency.value=frequency; }


if(object){
let panner=sounds_panner_i[volume_n];
panner.coneInnerAngle=coneInnerAngle;
panner.coneOuterAngle=coneOuterAngle;
panner.coneOuterGain=coneOuterGain;
panner.refDistance=refDistance;
panner.rolloffFactor=rolloffFactor;
// IMMEDIATELY UPDATE THE SOUND POSITION
sounds_panner_update(object,panner);
item.connect(panner);
}
else{
item.connect(volume_g);
}


item.n=volume_n;
// onended FIRES WHEN stop() IS CALLED AND WHEN THE SOUND ENDS AND WHEN THE VALUE OF start(999) IS GREATER THAN THE DURATION OF THE SOUND
item.onended=function(){
try{
delete sounds_fade_in[name_c];
delete sounds_fade_out[name_c];
sounds[name_c].disconnect();
sounds_volume_i[sounds[name_c].n].disconnect();
sounds_biquad_i[sounds[name_c].n].disconnect();
sounds_volume_f.push(sounds[name_c].n);
delete sounds[name_c];
}
catch(e){}
}
item.start();
return name_c;


}


// ____________________ PAUSE ONE SOUND OR ALL ____________________


function sounds_pause(name){


if(name){
try{ sounds[name].playbackRate.value=0; return true; }
catch(e){ return false; }
}
else{
sounds_status=0;
for(let name in sounds){
try{ sounds[name].playbackRate.value=0; }
catch(e){}
}
}


}


// ____________________ RESUME ONE SOUND OR ALL ____________________


function sounds_resume(name){


if(name){
try{ sounds[name].playbackRate.value=sounds[name].speed*sounds_speed; return true; }
catch(e){ return false; }
}
else{
sounds_status=1;
for(let name in sounds){
try{ sounds[name].playbackRate.value=sounds[name].speed*sounds_speed;}
catch(e){}
}
}


}


// ____________________ REMOVE ONE SOUND OR ALL - AT ONCE AND POSSIBLY WITH A WHEEZING SOUND ____________________


function sounds_delete_fast(name){


if(name){
try{ delete sounds_fade_in[name]; delete sounds_fade_out[name]; sounds[name].onended=null; sounds[name].stop(); sounds[name].disconnect(); sounds_volume_i[sounds[name].n].disconnect(); sounds_volume_f.push(sounds[name].n); delete sounds[name]; return true; }
catch(e){ return false; }
}
else{
sounds_fade_in=[];
sounds_fade_out=[];
for(let name in sounds){
try{ sounds[name].onended=null; sounds[name].stop(); sounds[name].disconnect(); sounds_volume_i[sounds[name].n].disconnect(); sounds_volume_f.push(sounds[name].n); delete sounds[name]; }
catch(e){}
}
}


}


// ____________________ REMOVE ONE SOUND OR ALL - SLOWLY AND WITHOUT WHEEZING ____________________


function sounds_delete_slow(name,time){


// name - SOUND NAME FROM sounds ARRAY. OR "all" - ALL
// time - HOW LONG TO EXECUTE IN SECONDS. OR LEAVE BLANK, THEN THE DEFAULT TIME IS 0.01 SECOND


if(time<0.01){ time=0.01; }
if(name!="all"){
try{
delete sounds_fade_in[name];
delete sounds_fade_out[name];
sounds_volume_i[sounds[name].n].gain.setTargetAtTime(0,sounds_context.currentTime,time);
sounds[name].stop(sounds_context.currentTime+time);
return true;
}
catch(e){ return false; }
}
else{
sounds_fade_in=[];
sounds_fade_out=[];
for(let name in sounds){
try{
sounds_volume_i[sounds[name].n].gain.setTargetAtTime(0,sounds_context.currentTime,time);
sounds[name].stop(sounds_context.currentTime+time);
}
catch(e){}
}
}


}


// ____________________ SMOOTH SOUND ENTRY ____________________


function sounds_fade_in_set(name,time,volume,speed){


// name - NAME OF SOUND FROM ARRAY sounds, OR "all" - ALL
// time - HOW LONG TO EXECUTE IN MILLISECONDS. IF WHEEZING APPEARS, THEN SET MORE
// volume - SMOOTH ENTRY TO THE SPECIFIED VOLUME, OR -1, IE THE SOUND WAS PAUSED AND NOW WE NEED TO RETURN THE VOLUME TO THE SAME ONE AS IT WAS
// speed - SPEED

if(name!="all"){
if(!sounds[name]){ return false; }
try{
sounds[name].speed=speed;
sounds[name].playbackRate.value=speed*sounds_speed*sounds_status;
}
catch(e){}
delete sounds_fade_in[name];
delete sounds_fade_out[name];
sounds_fade_in[name]={};
let item=sounds_fade_in[name];
item.time_total=time;
item.time_elapsed=0;
try{
item.volume_first=sounds_volume_i[sounds[name].n].volume;
item.volume_in=volume-item.volume_first;
item.volume_to=volume;
if(volume<item.volume_first){ item.volume_in=0; }
if(volume==-1){ item.volume_in=item.volume_first; item.volume_first=0; item.volume_to=item.volume_in; }
return true;
}
catch(e){ delete sounds_fade_in[name]; return false; }
}
else{
sounds_fade_in=[];
sounds_fade_out=[];
for(let name in sounds){
try{
sounds[name].speed=speed;
sounds[name].playbackRate.value=speed*sounds_speed*sounds_status;
}
catch(e){}
sounds_fade_in[name]={};
let item=sounds_fade_in[name];
item.time_total=time;
item.time_elapsed=0;
try{
item.volume_first=sounds_volume_i[sounds[name].n].volume;
item.volume_in=volume-item.volume_first;
item.volume_to=volume;
if(volume<item.volume_first){ item.volume_in=0; }
if(volume==-1){ item.volume_in=item.volume_first; item.volume_first=0; item.volume_to=item.volume_in; }
}
catch(e){ delete sounds_fade_in[name]; }
}
}


}


function sounds_fade_in_update(){


for(let name in sounds_fade_in){


let item=sounds_fade_in[name];
item.time_elapsed+=delta;
let volume=item.volume_first+item.volume_in*(item.time_elapsed/item.time_total);
if(volume>item.volume_to){ volume=item.volume_to; }
if(item.time_elapsed>=item.time_total){ volume=item.volume_to; delete sounds_fade_in[name]; }
try{
sounds_volume_i[sounds[name].n].volume=volume;
sounds_volume_i[sounds[name].n].gain.value=volume;
}
catch(e){}


}


}


// ____________________ SMOOTH SOUND OUTPUT OF ONE OR ALL ____________________


function sounds_fade_out_set(name,time,action){


// name - NAME OF SOUND FROM ARRAY sounds, OR "all" - ALL
// time - HOW LONG TO COMPLETE IN MILLISECONDS. IF WHEEZING APPEARS, THEN SET MORE
// action - ACTION AT END: 0 - NOTHING, 1 - PAUSE, 2 - DELETE

if(name!="all"){
if(!sounds[name]){ return false; }
delete sounds_fade_in[name];
delete sounds_fade_out[name];
sounds_fade_out[name]={};
let item=sounds_fade_out[name];
item.time_total=time;
item.time_elapsed=0;
item.action=action;
try{ item.volume=sounds_volume_i[sounds[name].n].volume; return true; }
catch(e){ delete sounds_fade_out[name]; return false; }
}
else{
sounds_fade_in=[];
sounds_fade_out=[];
for(let name in sounds){
sounds_fade_out[name]={};
let item=sounds_fade_out[name];
item.time_total=time;
item.time_elapsed=0;
item.action=action;
try{ item.volume=sounds_volume_i[sounds[name].n].volume; }
catch(e){ delete sounds_fade_out[name]; }
}
}

}


function sounds_fade_out_update(){


for(let name in sounds_fade_out){


let item=sounds_fade_out[name];
item.time_elapsed+=delta;
let volume=item.volume*(1-item.time_elapsed/item.time_total);
if(0>volume){ volume=0; }
try{
sounds_volume_i[sounds[name].n].volume=volume;
sounds_volume_i[sounds[name].n].gain.value=volume;
}
catch(e){}
if(item.time_elapsed>=item.time_total){
delete sounds_fade_out[name];
if(item.action==1){ sounds[name].playbackRate.value=0; }
if(item.action==2){ sounds_delete_fast(name); }
}


}


}