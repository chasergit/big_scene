function meshes_frustum_visible(item,mode){


if(mode==1){
item.traverse(function(child){
if(child.isMesh){
child.last_visible=child.visible;
child.visible=true;
child.last_frustumCulled=child.frustumCulled;
child.frustumCulled=false;
}
});
}
else{
item.traverse(function(child){
if(child.isMesh){
child.visible=child.last_visible;
child.frustumCulled=child.last_frustumCulled;
delete child.last_visible;
delete child.last_frustumCulled;
}
});
}


}


function init_end(){


window.addEventListener("resize",on_window_resize);
on_window_resize();


meshes_frustum_visible(scene,1);
meshes_frustum_visible(scene_hud,1);
renderer.render(scene,camera);
renderer.render(scene_hud,camera_hud);
meshes_frustum_visible(scene,2);
meshes_frustum_visible(scene_hud,2);


document.getElementById("loading").style.display="none";
document.getElementById("begin").style.display="block";


document.getElementById("begin").onclick=()=>{
document.getElementById("begin").onclick=()=>{}
document.getElementById("begin").style.display="none";
fullscreen_pointerlock();
stop=0;
loop();
setTimeout(()=>{
document.getElementById("project").onclick=()=>{
fullscreen_pointerlock();
}
},1000);
}


}
