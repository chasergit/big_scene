let screen_width=screen.width;
let screen_height=screen.height;
let canvas_half_width=screen_width/2;
let canvas_half_height=screen_height/2;
let screen_resolution=[screen_width,screen_height];
let screen_aspect_ratio=screen_width/screen_height;
let screen_texel_size=[1.0/screen_width,1.0/screen_height];
let renderer_pixel_ratio=window.devicePixelRatio;


let vs=[]; 
let fs=[]; 
let mat=[];
let mesh=[];
let helper=[];
let dummy=[]; 
let uniforms=[]; 
let modules_to_resize=[];
let mixers=[];
let mixer=[];
let action=[];
let environment_main;


loadingManager.init_core=init_core;
loadingManager.init_end=init_end;


function key(which,to){
if(which==90 && voice_enabled==1){
if(to==1){ voice_start(); }
else{ voice_stop(); }
}
if(which==32 && jump_can==1){
jump_can=0;
player.velocity.y=6;
}
if(which==65){ go_left=to; }
if(which==87){ go_up=to; }
if(which==68){ go_right=to; }
if(which==83){ go_down=to; }


if(which==69 && !stop){
sun_direction_upadte();	
}


}


document.onkeydown=function(e){ key(event.keyCode,1); }
document.onkeyup=function(e){ key(event.keyCode,0); }


let canvas=document.getElementById("canvas");


let stats=new Stats();
document.getElementById("project").appendChild(stats.dom);


document.getElementById("project").appendChild(renderer_stats_canvas);


let clock=new THREE.Clock();
let delta=0;


let camera=new THREE.PerspectiveCamera(60,screen_aspect_ratio,0.05,1000);


let scene_hud=new THREE.Scene();
let camera_hud=new THREE.OrthographicCamera(screen_width/-2,screen_width/2,screen_height/2,screen_height/-2,0,1000000);
camera_hud.position.z=100000;


let scene_2=new THREE.Scene();


let renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true,premultipliedAlpha:true,logarithmicDepthBuffer:false});
renderer.setClearColor(0x000000,0); 
renderer.setSize(screen_width,screen_height);
renderer.setPixelRatio(renderer_pixel_ratio);
renderer.autoClear=false;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.VSMShadowMap;
//renderer.shadowMap.autoUpdate=false;
//renderer.shadowMap.needsUpdate=true;


let gpuPanel;
window.gpuPanel=gpuPanel=new GPUStatsPanel(renderer.getContext());
window.gpuPanel_shader_name=""; 
stats.addPanel(gpuPanel);


let scene=new THREE.Scene();


function on_window_resize(){


screen_width=canvas.width;
screen_height=canvas.height;
canvas_half_width=screen_width/2;
canvas_half_height=screen_height/2;
screen_resolution=[screen_width,screen_height];
screen_aspect_ratio=screen_width/screen_height;
screen_texel_size=[1.0/screen_width,1.0/screen_height];


camera.aspect=screen_aspect_ratio;
camera.updateProjectionMatrix();


camera_hud.left=screen_width/-2;
camera_hud.right=screen_width/2;
camera_hud.top=screen_height/2;
camera_hud.bottom=screen_height/-2;
camera_hud.updateProjectionMatrix();


renderer.setSize(screen_width,screen_height);


let max=modules_to_resize.length;
for(let n=0;n<max;n++){
modules_to_resize[n]();
}


}


renderer.info.autoReset=false;


let rtt_shadow=new THREE.WebGLRenderTarget(1024,1024,{format:THREE.RedFormat,type:THREE.UnsignedByteType,depthBuffer:false});


let render_pass=new RenderPass(scene,camera);


// ____________________ POSTPROCESSING ____________________


let composer_rtt=new THREE.WebGLRenderTarget(screen_width,screen_height);
composer_rtt.texture.type=THREE.HalfFloatType;
composer_rtt.texture.generateMipmaps=false;


let composer=new EffectComposer(renderer,composer_rtt);
composer.readBuffer.depthBuffer=true;
composer.readBuffer.depthTexture=new THREE.DepthTexture();
composer.readBuffer.depthTexture.type=THREE.FloatType;
composer.writeBuffer.depthBuffer=true;
composer.writeBuffer.depthTexture=new THREE.DepthTexture();
composer.writeBuffer.depthTexture.type=THREE.FloatType;


modules_to_resize.push(()=>{
composer.setSize(screen_width,screen_height);
});


let underwater_pass=new ShaderPass(underwater_shader);
let underwater_ripples_pass=new ShaderPass(underwater_ripples_shader);


let unrealbloom_pass=new UnrealBloomPass({x:screen_width,y:screen_height},0,0,0);
unrealbloom_pass.threshold=5;
unrealbloom_pass.strength=0.7;
unrealbloom_pass.radius=0;


modules_to_resize.push(()=>{
unrealbloom_pass.setSize(screen_width,screen_height);
});


let correction_pass=new ShaderPass(correction_shader);
correction_pass.material.uniforms.color.value=[1,1,1];
correction_pass.material.uniforms.saturation.value=1.2;
correction_pass.material.uniforms.vibrance.value=0.0;
correction_pass.material.uniforms.gamma.value=1.0;
correction_pass.material.uniforms.brightness.value=0.0;
correction_pass.material.uniforms.contrast.value=0.1;
correction_pass.material.uniforms.vignette.value=0.0;


let fxaa_pass=new ShaderPass(FXAAShader);
fxaa_pass.material.uniforms.resolution.value.x=1/(screen_width*renderer_pixel_ratio);
fxaa_pass.material.uniforms.resolution.value.y=1/(screen_height*renderer_pixel_ratio);


modules_to_resize.push(()=>{
fxaa_pass.material.uniforms.resolution.value.x=1/(screen_width*renderer_pixel_ratio);
fxaa_pass.material.uniforms.resolution.value.y=1/(screen_height*renderer_pixel_ratio);
});


composer.addPass(render_pass);
composer.addPass(underwater_pass);
composer.addPass(underwater_ripples_pass);
composer.addPass(correction_pass);
composer.addPass(unrealbloom_pass);
composer.addPass(fxaa_pass);


let gun_light=new THREE.PointLight(0xffc000,0.0,3.0,1.0);
gun_light.position.set(0.01,0.003,-0.001);
let gunh=new THREE.PointLightHelper(gun_light,0.001);
scene.add(gunh);


let ghj=new THREE.PointLight(0xffc000,1.0,3.0,1.0);
ghj.position.set(-1.34,2.35,-19.38);
scene.add(ghj);


document.addEventListener("mousedown",()=>{


if(gun_light.intensity==0){
sounds_play(null,"gun",false,false,1,0,1,false,"","");
gun_light.intensity=5;
setTimeout(()=>{ gun_light.intensity=0; },50);
}


},false);


let audioLoader=new THREE.AudioLoader();


let go_left=0,go_right=0,go_up=0,go_down=0;
let player={};
player.position={x:23,y:100,z:0.2};
player.direction={x:0,y:0,z:-1};
player.velocity={x:0,y:0,z:0};
player.angle={z:90,y:0};
player.speed=0.1;
let radian=Math.PI/180;
let go_half;


let go_lrc=Math.cos((player.angle.y)*radian)*player.speed;
let go_lrs=Math.sin((player.angle.y)*radian)*player.speed;
let go_udc=Math.cos((player.angle.y+90)*radian)*player.speed;
let go_uds=Math.sin((player.angle.y+90)*radian)*player.speed;



let start_time=Date.now();
let time=0;


let jump_can=1;
let gravity=1;
let pause=0;
let mouse_sensitive=0.12; 


gravity=0;
player.position.y=1.5;


let ray_floor=new THREE.Raycaster();
ray_floor.ray.direction.set(0,-1,0);
ray_floor.far=0.5;


let direction={x:0,y:0,z:0};


let section_100_x=-1;
let section_100_z=0;
let p_section_100_x=0;
let p_section_100_z=0;


let section_100_objects=[];
let ways_9=[[-1,-1],[0,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[0,1],[1,1]];
let ways_25=[
[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],
[-2,-1],[-1,-1],[0,-1],[1,-1],[2,-1],
[-2,0],[-1,0],[0,0],[1,0],[2,0],
[-2,1],[-1,1],[0,1],[1,1],[2,1],
[-2,2],[-1,2],[0,2],[1,2],[2,2],
];


mesh["axes"]=new THREE.AxesHelper(100);
mesh["axes"].position.set(0,5,0);
scene.add(mesh["axes"]);


mesh["grid_100"]=new THREE.GridHelper(600,6,0x0000ff,0x00ff00);
mesh["grid_100"].position.set(0,2,0);
//scene.add(mesh["grid_100"]);


/*
let listener=new THREE.AudioListener();
camera.add(listener);


let positionalAudio=new THREE.PositionalAudio(listener);
positionalAudio.position.set(3,1,0);
positionalAudio.setRefDistance(1);
positionalAudio.setRolloffFactor(1);
positionalAudio.setDirectionalCone(180,230,0.1);
positionalAudio.loop=true;
let helper=new PositionalAudioHelper(positionalAudio,1.0);
positionalAudio.add(helper);
scene.add(positionalAudio);


positionalAudio.setBuffer(sound["run_grass"]);
*/

/*

positionalAudio.position.set(18,2,53);
setInterval("try{positionalAudio.position.z=53+Math.sin(performance.now()/100)*5;sounds_listener_update();sounds_panner_update(positionalAudio,sounds_panner_i[9],0);}catch(e){}",20);


sounds_delete_fast("bb");
positionalAudio.play();



sounds_delete_fast("bb");
positionalAudio.stop();
time_delta=0;
sounds_play("bb","run_grass",true,false,1,0,1,false,"","",positionalAudio,180,230,0.1,1,1);


let min=9090;
for(let z=0;z<100;z++){
let started=performance.now();
for(let n=0;n<1000;n++){
sounds_panner_update(positionalAudio,sounds_panner_i[9],0);
}
let elap=performance.now()-started;
if(min>elap){ min=elap; }
}
console.log(min);

*/



function fullscreen_pointerlock(){
if(!document.pointerLockElement){
try{
document.body.requestPointerLock();
}
catch(e){}
}
if(!document.fullscreenElement){ document.documentElement.requestFullscreen(); }
else if(document.exitFullscreen){ document.exitFullscreen(); }
}



document.addEventListener("mousemove",(event)=>{
if(document.pointerLockElement===document.body){ updatePosition(event); }
});



function updatePosition(event){


if(pause==1){ return; }


player.angle.z+=event.movementY*mouse_sensitive;
player.angle.y-=event.movementX*mouse_sensitive;


if(player.angle.z>170){ player.angle.z=170; }
if(10>player.angle.z){ player.angle.z=10; }


if(player.angle.y>360){ player.angle.y-=360; }
if(player.angle.y<0){ player.angle.y+=360; }


go_lrc=Math.cos(player.angle.y*radian)*player.speed;
go_lrs=Math.sin(player.angle.y*radian)*player.speed;
go_udc=Math.cos((player.angle.y+90)*radian)*player.speed;
go_uds=Math.sin((player.angle.y+90)*radian)*player.speed;


player.direction.x=Math.cos((-player.angle.y-90)*radian)*(Math.sin(player.angle.z*radian));
player.direction.y=Math.cos(player.angle.z*radian);
player.direction.z=Math.sin((-player.angle.y-90)*radian)*(Math.sin(player.angle.z*radian));
camera.lookAt(player.position.x+player.direction.x,player.position.y+player.direction.y,player.position.z+player.direction.z);


update_weapon_sway(event.movementX,event.movementY);


}


let cubeRenderTarget_lightProbe=new THREE.WebGLCubeRenderTarget(
256,{
depthBuffer:false,
format:THREE.RGBAFormat,
colorSpace:THREE.SRGBColorSpace
});


let cubeCamera_lightProbe=new THREE.CubeCamera(0.1,2000,cubeRenderTarget_lightProbe);
let lightProbe=new THREE.LightProbe();


function lightProbe_update(){
cubeCamera_lightProbe.position.copy(camera.position);
cubeCamera_lightProbe.update(renderer,scene);
lightProbe.copy(new THREE.LightProbeGenerator.fromCubeRenderTarget(renderer,cubeRenderTarget_lightProbe));
//lightProbe.copy(new THREE.LightProbeGenerator.fromCubeTexture(environment_main));
lightProbe.intensity=2;
lightProbe.position.copy(camera.position);
scene.add(lightProbe);
let helper=new THREE.LightProbeHelper(lightProbe,0.2);
helper.position.copy(camera.position);
scene.add(helper);
}


let particles_flare_a=[];


particles_flare_a.push({offset:[0,0,0],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[1,0.4,1,5],blend:0,frame:[1,1,0,0],texture:1});
particles_flare_a.push({offset:[0,0,0],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[1,0.4,1,5],blend:0,frame:[1,1,0,0],texture:1});
particles_flare_a.push({offset:[0,0,0],scale:[1,1],quaternion:[0,0,0,2],rotation:0,color:[1,1,1,1],blend:0,frame:[1,1,0,0],texture:1});


particles_flare_a.push({offset:[-0.8,0.2,-8],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[1,1,1,1],blend:0,frame:[1,1,0,0],texture:1});
particles_flare_a.push({offset:[-0.8,0.2,-9],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[1,1,1,1],blend:0,frame:[1,1,0,0],texture:1});
particles_flare_a.push({offset:[-0.8,0.2,-10],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[0,1,1,1],blend:0,frame:[1,1,0,0],texture:1});
particles_flare_a.push({offset:[-0.8,0.2,-11],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[0,1,1,1],blend:0,frame:[1,1,0,0],texture:1});
particles_flare_a.push({offset:[-0.8,0.2,-12],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[1,0.4,0,1],blend:0,frame:[1,1,0,0],texture:1});
particles_flare_a.push({offset:[-0.8,0.2,-13],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[1,0.4,0,1],blend:0,frame:[1,1,0,0],texture:1});


particles_flare_a.push({offset:[-0.7,2.6,-19.6],scale:[1.0,1.0],quaternion:[0,0,0,2],rotation:0,color:[1,0.7,0,1],blend:0,frame:[1,1,0,0],texture:8});


particles_flare_a.push({offset:[-6.0,0.3,-16.9],scale:[0.5,0.5],quaternion:[0,0,0,2],rotation:0,color:[0,1,1,1],blend:0,frame:[1,1,0,0],texture:8});
particles_flare_a.push({offset:[-8.3,0.3,-16.9],scale:[0.5,0.5],quaternion:[0,0,0,2],rotation:0,color:[0,1,1,1],blend:0,frame:[1,1,0,0],texture:8});
particles_flare_a.push({offset:[-10.8,0.3,-16.9],scale:[0.5,0.5],quaternion:[0,0,0,2],rotation:0,color:[0,1,1,1],blend:0,frame:[1,1,0,0],texture:8});


function particles_glow_f(){
let y=particles_glow_a[0].origin[1]+Math.sin(time/1000)/6;
particles_glow_a[0].offset[1]=y;
particles_glow_a[1].offset[1]=y;
let p=particles_glow_a[2].origin;
let x=p[0]+Math.sin(time/1000)*10;
y=p[1]+Math.sin(time/500)*1;
let z=p[2]+Math.cos(time/1000)*10;
particles_glow_a[2].offset=[x,y,z];
particles_glow_a[3].offset=[x,y,z];
}


let particles_glow_a=[];


particles_glow_a.push({origin:[13,1.2,4],offset:[13,1,4],scale:[1,1],quaternion:[0,0,0,2],rotation:-0.002,color:[1,1,1,1],blend:0,frame:[1,1,0,0],texture:5});
particles_glow_a.push({origin:[13,1.2,4],offset:[13,1,4],scale:[1,1],quaternion:[0,0,0,2],rotation:0.002,color:[1,1,1,1],blend:0,frame:[1,1,0,0],texture:5});
particles_glow_a.push({origin:[24,1,52],offset:[13,1,4],scale:[5,5],quaternion:[0,0,0,2],rotation:-0.002,color:[1,0,1,1],blend:0,frame:[1,1,0,0],texture:5});
particles_glow_a.push({origin:[24,1,52],offset:[13,1,4],scale:[5,5],quaternion:[0,0,0,2],rotation:0.002,color:[1,1,1,1],blend:0,frame:[1,1,0,0],texture:5});


let particles_other_a=[];


particles_other_a.push({offset:[9,1.5,1],scale:[1,1],quaternion:[0,0,0,3],rotation:-0.002,color:[0,0,0,1],blend:1,frame:[1,1,0,0],texture:0});
particles_other_a.push({offset:[9.5,1.5,1],scale:[1,1],quaternion:[0,0,0,3],rotation:-0.002,color:[0,0,0,1],blend:1,frame:[1,1,0,0],texture:0});
particles_other_a.push({offset:[9.5,1.5,0.5],scale:[1,1],quaternion:[0,0,0,3],rotation:-0.002,color:[1,0.8,0,1],blend:1,frame:[1,1,0,0],texture:0});
particles_other_a.push({offset:[10.0,1.5,1],scale:[1,1],quaternion:[0,0,0,3],rotation:-0.002,color:[0,0,0,1],blend:1,frame:[1,1,0,0],texture:0});
particles_other_a.push({offset:[9.5,1.5,1.5],scale:[1,1],quaternion:[0,0,0,3],rotation:-0.002,color:[1,0,0,1],blend:1,frame:[1,1,0,0],texture:0});


particles_other_a.push({offset:[9.5,1,-2],scale:[5,1],quaternion:[0,0.7,0,0.7],rotation:0.001,color:[1,1,1,1],blend:1.1,frame:[1,1,0,0],texture:3});


particles_other_a.push({offset:[7,1,10],scale:[1,1],quaternion:[0,0,0,3],rotation:-0.002,color:[1,1,1,1],blend:1,frame:[1,1,0,0],texture:6});


particles_other_a.push({offset:[7,1,6],scale:[4,4],quaternion:[0,0,0,3],rotation:0.001,color:[1,1,1,1],blend:1,frame:[1,1,0,0],texture:2});
particles_other_a.push({offset:[6,1,4],scale:[4,4],quaternion:[0,0,0,3],rotation:0.001,color:[1,1,1,1],blend:1,frame:[1,1,0,0],texture:2});
particles_other_a.push({offset:[7,1,4],scale:[4,4],quaternion:[0,0,0,3],rotation:0.001,color:[1,1,1,1],blend:1,frame:[1,1,0,0],texture:2});



particles_other_a.push({offset:[9.5,1,4.5],scale:[1,1],quaternion:[0,0,0,3],rotation:-0.002,color:[1,1,1,1],blend:1,frame:[1,1,0,0],texture:0});


particles_other_a.push({offset:[7,1,2],scale:[1,1],quaternion:[0,0,0,3],rotation:0.002,color:[1,1,0,1],blend:1,frame:[1,1,0,0],texture:0});
particles_other_a.push({offset:[7,1,2.5],scale:[1,1],quaternion:[0,0,0,3],rotation:0.001,color:[1,0,1,1],blend:1,frame:[1,1,0,0],texture:0});
particles_other_a.push({offset:[7,1,3],scale:[1,1],quaternion:[0,0,0,3],rotation:0.003,color:[0,1,1,1],blend:1,frame:[1,1,0,0],texture:0});


particles_other_a.push({offset:[-300,200,0],scale:[100,100],quaternion:[0,0,0,4],rotation:0,color:[1,1,1,1],blend:1,frame:[1,1,0,0],texture:0});


particles_other_a.push({offset:[-1.05,1.25,-8.5],scale:[0.2,1.0],quaternion:[0,0,0,4],rotation:0,color:[0,0.9,0.81,1],blend:0,frame:[1,1,0,0],texture:4});
particles_other_a.push({offset:[-1.05,1.25,-10.0],scale:[0.2,1.0],quaternion:[0,0,0,4],rotation:0,color:[1,1,1,1],blend:0,frame:[1,1,0,0],texture:8});
particles_other_a.push({offset:[23,1.25,-2.6],scale:[0.4,10.],quaternion:[0,1,0,7],rotation:0,color:[1,1,1,1],blend:0,frame:[1,1,0,0],texture:8});
particles_other_a.push({offset:[24,1.25,-6.5],scale:[0.4,10.],quaternion:[1,0,0,7],rotation:0,color:[1,1,1,1],blend:0,frame:[1,1,0,0],texture:8});
particles_other_a.push({offset:[21,1.25,-4.5],scale:[0.4,4.],quaternion:[1,0,0,6],rotation:0,color:[1,1,1,1],blend:0,frame:[1,1,0,0],texture:8});
particles_other_a.push({offset:[20,1.25,1.5],scale:[0.4,10.],quaternion:[0,0,1,6],rotation:0,color:[1,1,1,1],blend:0,frame:[1,1,0,0],texture:8});
particles_other_a.push({offset:[20,1.0,1.5],scale:[0.4,10.],quaternion:[0,0,1,6],rotation:0,color:[1,1,1,1],blend:0,frame:[1,1,0,0],texture:8});
particles_other_a.push({offset:[21,1.0,-3],scale:[0.4,0.4],quaternion:[0,0,1,3],rotation:0,color:[2.0,1,1,1],blend:0,frame:[1,1,0,0],texture:8});
particles_other_a.push({offset:[26,1.0,1.5],scale:[0.4,10.],quaternion:[0,1,0,6],rotation:0,color:[1,1,1,1],blend:0,frame:[1,1,0,0],texture:8});
particles_other_a.push({offset:[20,3.0,1.5],scale:[0.4,10.],quaternion:[0,0,1,6],rotation:0,color:[1,1,1,1],blend:0,frame:[1,1,0,0],texture:8});
particles_other_a.push({offset:[14.22,1.0,55.6],scale:[2.0,4.0],quaternion:[15.0,1.0,55.3,5],rotation:0,color:[1,1,1,1],blend:1,frame:[1,0.5,0,0],texture:9});
particles_other_a.push({offset:[21,1.0,1.5],scale:[0.1,10.],quaternion:[0,0,1,6],rotation:0,color:[1,1,1,0.5],blend:1,frame:[1,1,0,0],texture:2});
particles_other_a.push({offset:[24,1.25,-2.6],scale:[1.0,0.5],quaternion:[0,1,1,5],rotation:0.001,color:[1,1,1,1],blend:1,frame:[1,1,0,0],texture:0});
particles_other_a.push({offset:[-1.05,1.25,-13.0],scale:[0.2,1.0],quaternion:[0,0,0,4],rotation:0,color:[0,0.9,0.81,1],blend:0,frame:[1,1,0,0],texture:4});

particles_other_a.push({offset:[18,1.25,6],scale:[0.4,10.],quaternion:[0,0,1,6],rotation:0,color:[1,1,1,1],blend:0,frame:[1,1,0,0],texture:13});


particles_other_a.push({offset:[-1.05,1.3,-10.75],scale:[1.2,0.8],quaternion:[0,0.7,0,0.7],rotation:0,color:[1,1,1,1],blend:0.8,frame:[1,1,0,0],texture:6});


particles_other_a.push({offset:[-0.1,1.7,13],scale:[2,1.4],quaternion:[0,0.7,0,0.7],rotation:0,color:[1,1,1,0.4],blend:0,frame:[1,1,0,0],texture:7});
particles_other_a.push({offset:[14.0,1.7,-5.1],scale:[2,1.4],quaternion:[0,0,0,1],rotation:0,color:[1,1,1,0.4],blend:0,frame:[1,1,0,0],texture:7});


particles_other_a.push({offset:[16,1.0,0],scale:[1.0,1.0],quaternion:[0,0,0,2],rotation:0,color:[1,1,1,1],blend:1,frame:[1,1,0,0],texture:10});
particles_other_a.push({offset:[16,1.5,0],scale:[1.0,0.25],quaternion:[0,0,0,2],rotation:0,color:[1,1,1,1],blend:1,frame:[1,1,0,0],texture:11});


particles_other_a.push({offset:[18,1.0,0],scale:[1.0,1.0],quaternion:[0,0,0,2],rotation:0.001,color:[1,1,1,1],blend:0,frame:[1,1,0,0],texture:12});


particles_other_a.push({offset:[35,0.0,72],scale:[2,2],quaternion:[0,0,0,3],rotation:0.001,color:[1,1,1,1],blend:1,frame:[1,1,0,0],texture:14});
particles_other_a.push({offset:[35,0.0,72],scale:[1.8,1.8],quaternion:[0,0,0,3],rotation:-0.001,color:[1,1,1,1],blend:1,frame:[1,1,0,0],texture:14});


let particles=[];


function particles_update(){



particles_other_a[18].offset[0]=24+Math.sin(time/500);



particles_other_a[25].frame[3]=-time/500;


particles_glow_f();


if(wolf_tail_bone){


let item_1=mesh["eye_1"].matrixWorld.elements;
let item_2=particles_flare_a[0].offset;
item_2[0]=item_1[12];
item_2[1]=item_1[13];
item_2[2]=item_1[14];


item_1=mesh["eye_2"].matrixWorld.elements;
item_2=particles_flare_a[1].offset;
item_2[0]=item_1[12];
item_2[1]=item_1[13];
item_2[2]=item_1[14];


for(let n=0;n<1;n++){
wolf_tail[0][0].multiplyMatrices(wolf_tail[0][1],wolf_tail[0][2]);
let item_1=wolf_tail[0][3];
let item_2=particles_flare_a[2].offset;
item_2[0]=item_1[12];
item_2[1]=item_1[13];
item_2[2]=item_1[14];
}


}


particles=[];


let max_particles_flare_a=particles_flare_a.length;
particles.length=max_particles_flare_a;
for(let n=0;n<max_particles_flare_a;n++){
particles[n]=particles_flare_a[n];
}


let max_particles_flare_a_particles_glow_a=max_particles_flare_a+particles_glow_a.length;
particles.length=max_particles_flare_a_particles_glow_a;
let i=0;
for(let n=max_particles_flare_a;n<max_particles_flare_a_particles_glow_a;n++){
particles[n]=particles_glow_a[i];
i++;
}


let max_particles_flare_a_particles_glow_a_particles_other_a=max_particles_flare_a_particles_glow_a+particles_other_a.length;
particles.length=max_particles_flare_a_particles_glow_a_particles_other_a;
i=0;
for(let n=max_particles_flare_a_particles_glow_a;n<max_particles_flare_a_particles_glow_a_particles_other_a;n++){
particles[n]=particles_other_a[i];
i++;
}


let count=particles.length;
let item=camera.position;
let x=item.x;
let y=item.y;
let z=item.z;


let n=count;
while(n--){
let item=particles[n].offset;
particles[n].d=Math.sqrt(Math.pow((x-item[0]),2)+Math.pow((y-item[1]),2)+Math.pow((z-item[2]),2));
}


particles.sort((a,b)=>b.d-a.d);


let offset=new Float32Array(count*3);
let scale=new Float32Array(count*2);
let quaternion=new Float32Array(count*4);
let rotation=new Float32Array(count);
let color=new Float32Array(count*4);
let blend=new Float32Array(count);
let frame=new Float32Array(count*4);
let texture=new Float32Array(count);


n=count;
while(n--){



let item=particles[n];
rotation[n]=item.rotation;
texture[n]=item.texture;
blend[n]=item.blend;



let zero=n*2;
let one=zero+1;
let i_scale=item.scale;
scale[zero]=i_scale[0];
scale[one]=i_scale[1];



zero=n*3;
one=zero+1;
let two=zero+2;
let i_offset=item.offset;
offset[zero]=i_offset[0];
offset[one]=i_offset[1];
offset[two]=i_offset[2];



zero=n*4;
one=zero+1;
two=zero+2;
let three=zero+3;
let i_color=item.color;
color[zero]=i_color[0];
color[one]=i_color[1];
color[two]=i_color[2];
color[three]=i_color[3];
let i_quaternion=item.quaternion;
quaternion[zero]=i_quaternion[0];
quaternion[one]=i_quaternion[1];
quaternion[two]=i_quaternion[2];
quaternion[three]=i_quaternion[3];
let i_frame=item.frame;
frame[zero]=i_frame[0];
frame[one]=i_frame[1];
frame[two]=i_frame[2];
frame[three]=i_frame[3];


}



item=mesh["sprite"].geometry.attributes;
item.offset=new THREE.InstancedBufferAttribute(offset,3).setUsage(THREE.StreamDrawUsage);
item.scale=new THREE.InstancedBufferAttribute(scale,2).setUsage(THREE.StreamDrawUsage);
item.quaternion=new THREE.InstancedBufferAttribute(quaternion,4).setUsage(THREE.StreamDrawUsage);
item.rotation=new THREE.InstancedBufferAttribute(rotation,1).setUsage(THREE.StreamDrawUsage);
item.color=new THREE.InstancedBufferAttribute(color,4).setUsage(THREE.StreamDrawUsage);
item.blend=new THREE.InstancedBufferAttribute(blend,1).setUsage(THREE.StreamDrawUsage);
item.frame=new THREE.InstancedBufferAttribute(frame,4).setUsage(THREE.StreamDrawUsage);
item.texture=new THREE.InstancedBufferAttribute(texture,1).setUsage(THREE.StreamDrawUsage);



mesh["sprite"].geometry._maxInstanceCount=count;


}


function movePoint() {
let t=Date.now()*0.007;
mesh["rotate_sphere"].position.x=Math.sin(t*0.5)*0.5;
mesh["rotate_sphere"].position.y=Math.cos(t*0.5)*0.5+1;
mesh["rotate_sphere"].position.z=Math.cos(t*0.5)*0.5;
mesh["object_i_ray_sphere_2"].position.x=Math.sin(t*0.5)*0.5;
mesh["object_i_ray_sphere_2"].position.y=Math.cos(t*0.5)*0.5+1;
mesh["object_i_ray_sphere_2"].position.z=-3.5+Math.cos(t*0.5)*0.5;
}


mesh["green_cone"]=new THREE.Mesh(
new THREE.ConeGeometry(0.1,0.4,3),
new THREE.MeshLambertMaterial({color:0x009000})
);
mesh["green_cone"].geometry.translate(0,0.2,0);
mesh["green_cone"].geometry.rotateX(Math.PI/2);
mesh["green_cone"].position.set(0,1.5,0);
scene.add(mesh["green_cone"]);


let geometry=new THREE.BufferGeometry();


let vertices=new Float32Array([
-1,4,0,
-1,-4,0,
1,4,0,
]);


geometry.setAttribute('position',new THREE.BufferAttribute(vertices,3));
geometry.computeVertexNormals();
mesh["line"]=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial());
scene.add(mesh["line"]);


mesh["player_ray"]=new THREE.Mesh(new THREE.SphereGeometry(0.10,3,3),new THREE.MeshNormalMaterial())
mesh["player_ray"].position.set(0,1,0);
scene.add(mesh["player_ray"]);


mesh["boxer"]=new THREE.Mesh(new THREE.PlaneGeometry(2,8,1),new THREE.MeshLambertMaterial({color:0xffc000,wireframe:true}));
//mesh["boxer"].position.set(0,0,0);
scene.add(mesh["boxer"]);


function walk(ray_a){
ray_i.hit=0;
ray_i.distance=Infinity;


let max_ray_a=ray_a.length;
for(let j=0;j<max_ray_a;j++){


let ray_p=ray_a[j].position.array;
let ray_c=ray_a[j].position.count/3*9;
let ray_n=ray_a[j].normal.array;


for(let i=0;i<ray_c;i+=9){
let a={x:ray_p[i],y:ray_p[i+1],z:ray_p[i+2]};
let c={x:ray_p[i+6],y:ray_p[i+7],z:ray_p[i+8]};
let ab={x:ray_p[i+3]-a.x,y:ray_p[i+4]-a.y,z:ray_p[i+5]-a.z};
let ac={x:c.x-a.x,y:c.y-a.y,z:c.z-a.z};
let normal={x:ab.y*ac.z-ab.z*ac.y,y:ab.z*ac.x-ab.x*ac.z,z:ab.x*ac.y-ab.y*ac.x};


let way={x:ray_n[i],y:ray_n[i+1],z:ray_n[i+2]};
ray_e.x=player.position.x+(-way.x*0.2);
//ray_e.y=player.position.y;
ray_e.z=player.position.z+(-way.z*0.2);


let qp={x:ray_b.x-ray_e.x,y:ray_b.y-ray_e.y,z:ray_b.z-ray_e.z};
let d=qp.x*normal.x+qp.y*normal.y+qp.z*normal.z;
if(d<=0){ continue; } // return false; НЕТ ВООБЩЕ ПЕРЕСЕЧЕНИЙ
let ap={x:ray_b.x-a.x,y:ray_b.y-a.y,z:ray_b.z-a.z};
let t=ap.x*normal.x+ap.y*normal.y+ap.z*normal.z;
if(t<0){ continue; }
if(t>d){ continue; }
let e={x:qp.y*ap.z-qp.z*ap.y,y:qp.z*ap.x-qp.x*ap.z,z:qp.x*ap.y-qp.y*ap.x};
let v=ac.x*e.x+ac.y*e.y+ac.z*e.z;
if(v<0 || v>d){ continue; }
let w=-(ab.x*e.x+ab.y*e.y+ab.z*e.z);
if(w<0 || v+w>d){ continue; }
let ood=1/d;
v*=ood;
w*=ood;
let u=1-v-w;
let au={x:a.x*u,y:a.y*u,z:a.z*u};
let bv={x:ray_p[i+3]*v,y:ray_p[i+4]*v,z:ray_p[i+5]*v};
let cw={x:c.x*w,y:c.y*w,z:c.z*w};
let cp={x:au.x+bv.x+cw.x,y:au.y+bv.y+cw.y,z:au.z+bv.z+cw.z};
let ray_i_d=Math.sqrt(Math.pow((ray_b.x-cp.x),2)+Math.pow((ray_b.y-cp.y),2)+Math.pow((ray_b.z-cp.z),2));
if(ray_i_d<ray_i.distance){
mesh["player_ray"].position.set(cp.x,cp.y,cp.z);
ray_i.distance=ray_i_d;
ray_i.point=cp;
ray_i.hit=1;
}
}
}
}


let cmax=0;


let total_frame_time=0;
let total_frame_time_max=0;
let total_frame_time_min=Infinity;
let total_frame_time_elapsed=0;


let loop_render_time=0;
let loop_render_time_max=0;
let loop_render_time_min=Infinity;
let loop_render_time_elapsed=0;


let shadow_ground_2_updated=1;


shadow_ground_px=-999; 
shadow_ground_pz=0; 


let mouse={x:0,y:0};
let smooth = 20; // Smoothness of rotation interpolation
let multiplier = 0.1; // Sensitivity multiplier for mouse input


mesh["weapon"]=new THREE.Mesh(new THREE.BoxGeometry(0.01,0.02,0.2),new THREE.MeshBasicMaterial({
color:0xff0000
}));
mesh["weapon"].geometry.translate(0,0.0,-0.1);
mesh["weapon"].position.set(0.1,-0.1,-0.2);
scene.add(mesh["weapon"]);
mesh["weapon"].parent=camera;


function onMouseMove(event){
mouse.x=(event.clientX/screen_width)*2-1;
mouse.y=-(event.clientY/screen_height)*2+1;
}


//document.addEventListener('mousemove', onMouseMove, false);


let hand_position=mesh["weapon"].position;
let hand_rotation=mesh["weapon"].rotation;


let hand_position_x_default=0.1;
let hand_position_x_range=0.05; 
let hand_position_x_min=hand_position_x_default-hand_position_x_range; 
let hand_position_x_max=hand_position_x_default+hand_position_x_range;
let hand_rotation_y_min=-0.2; 
let hand_rotation_y_max=0.2; 


let hand_position_y_default=-0.1; 
let hand_position_y_range=0.03; 
let hand_position_y_min=hand_position_y_default-hand_position_y_range; 
let hand_position_y_max=hand_position_y_default+hand_position_y_range; 
let hand_rotation_x_min=-0.1;
let hand_rotation_x_max=0.1; 


let hand_rotation_z_min=-0.05; 
let hand_rotation_z_max=0.05; 


let hand_go_intensity=0;
let hand_go_time=0;


let hand_sway_intensity=0;


function update_weapon_sway(x,y){


hand_sway_intensity+=0.1*(1.0-hand_go_intensity);


hand_position.x=Math.min(Math.max(hand_position.x,hand_position_x_min),hand_position_x_max);
hand_position.x-=x*0.0001*(1-Math.abs(hand_position.x-hand_position_x_default)/hand_position_x_range);
hand_position.x=Math.min(Math.max(hand_position.x,hand_position_x_min),hand_position_x_max);


hand_position.y=Math.min(Math.max(hand_position.y,hand_position_y_min),hand_position_y_max);
hand_position.y-=y*0.00002*(1-Math.abs(hand_position.y-hand_position_y_default)/hand_position_y_range);
hand_position.y=Math.min(Math.max(hand_position.y,hand_position_y_min),hand_position_y_max);


hand_rotation.x=Math.min(Math.max(hand_rotation.x,hand_rotation_x_min),hand_rotation_x_max);
hand_rotation.x+=y*0.001*(1-Math.abs(hand_rotation.x));
hand_rotation.x=Math.min(Math.max(hand_rotation.x,hand_rotation_x_min),hand_rotation_x_max);


hand_rotation.y=Math.min(Math.max(hand_rotation.y,hand_rotation_y_min),hand_rotation_y_max);
hand_rotation.y+=x*0.0002*(1-Math.abs(hand_rotation.y));
hand_rotation.y=Math.min(Math.max(hand_rotation.y,hand_rotation_y_min),hand_rotation_y_max);


hand_rotation.z=Math.min(Math.max(hand_rotation.z,hand_rotation_z_min),hand_rotation_z_max);
hand_rotation.z-=x*0.001*(1-Math.abs(hand_rotation.z));
hand_rotation.z=Math.min(Math.max(hand_rotation.z,hand_rotation_z_min),hand_rotation_z_max);


}


function updateWeaponSway(){


let hand_bob_move_x=0.02;
let hand_bob_move_y=0.01;
let hand_bob_frequency_x=0.1;
let hand_bob_frequency_y=0.2;
//hand_position.x+=Math.sin(hand_go_time*hand_bob_frequency_x)*hand_bob_move_x*hand_go_intensity;
// ОПУСКАЕМ ЧУТЬ НИЖЕ
//hand_position.y+=(0.01+Math.cos(hand_go_time*hand_bob_frequency_y)*hand_bob_move_y)*hand_go_intensity;
hand_position.x+=(hand_position_x_default-hand_position.x+Math.sin(hand_go_time*hand_bob_frequency_x)*hand_bob_move_x*hand_go_intensity)*(1.0-hand_sway_intensity);
// ОПУСКАЕМ ЧУТЬ НИЖЕ
hand_position.y+=(hand_position_y_default-hand_position.y+(-0.01-Math.cos(hand_go_time*hand_bob_frequency_y)*hand_bob_move_y)*hand_go_intensity)*(1.0-hand_sway_intensity);



let hand_default_move_x=0.001;
let hand_default_move_y=0.003;
let hand_default_frequency_x=0.001;
let hand_default_frequency_y=0.002;
//hand_position.x+=Math.sin(time*hand_default_frequency_x)*hand_default_move_x;
//hand_position.y+=-Math.sin(time*hand_default_frequency_y)*hand_default_move_y;
hand_position.x+=(hand_position_x_default-hand_position.x+Math.sin(time*hand_default_frequency_x)*hand_default_move_x)*(1.0-hand_go_intensity)*(1.0-hand_sway_intensity);
hand_position.y+=(hand_position_y_default-hand_position.y+Math.sin(time*hand_default_frequency_y)*hand_default_move_y)*(1.0-hand_go_intensity)*(1.0-hand_sway_intensity);


//let delta_2=Math.min(Math.max(delta,0),0.016);
let delta_2=0.016;
hand_position.x+=(hand_position_x_default-hand_position.x)*10*delta_2*(1.0-hand_go_intensity);
hand_position.y+=(hand_position_y_default-hand_position.y)*10*delta_2*(1.0-hand_go_intensity);
hand_rotation.x+=-hand_rotation.x*10*delta_2;
hand_rotation.y+=-hand_rotation.y*10*delta_2;
hand_rotation.z+=-hand_rotation.z*10*delta_2;


hand_position.x=Math.min(Math.max(hand_position.x,hand_position_x_min),hand_position_x_max);
hand_position.y=Math.min(Math.max(hand_position.y,hand_position_y_min),hand_position_y_max);
hand_rotation.x=Math.min(Math.max(hand_rotation.x,hand_rotation_x_min),hand_rotation_x_max);
hand_rotation.y=Math.min(Math.max(hand_rotation.y,hand_rotation_y_min),hand_rotation_y_max);
hand_rotation.z=Math.min(Math.max(hand_rotation.z,hand_rotation_z_min),hand_rotation_z_max);


}
