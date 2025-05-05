function set_window(){


window.sun_direction=sun_direction;
window.camera=camera;
window.camera_hud=camera_hud;
window.tex=tex;
window.mat=mat;
window.vs=vs;
window.fs=fs;
window.mesh=mesh;
window.scene=scene;
window.scene_hud=scene_hud;
window.renderer=renderer;
window.underwater_pass=underwater_pass;
window.underwater_ripples_pass=underwater_ripples_pass;
window.correction_pass=correction_pass;
window.unrealbloom_pass=unrealbloom_pass;
window.THREE=THREE;
window.sun=sun;
window.ambient=ambient;
window.scene=scene;
window.scene_2=scene_2;
window.player=player;
window.intersection_ray_triangle=intersection_ray_triangle;
window.RGBELoader=RGBELoader;
window.voice_send=voice_send;
window.composer_rtt=composer_rtt;
window.composer=composer;
window.waterline_rtt=waterline_rtt;
window.water=water;


}


let scene_envMap_backed=new THREE.WebGLCubeRenderTarget(
1024,{
depthBuffer:false,
format:THREE.RGBAFormat,
colorSpace:THREE.SRGBColorSpace
});


let scene_envMap_camera=new THREE.CubeCamera(1,10,scene_envMap_backed);
let scene_envMap_scene=new THREE.Scene();


function SRGB_set(){


mat["terrain"].roughness=0.8;
mesh["terrain"].material=mat["terrain"];


let max_mat_sprite=mat["sprite"].uniforms.map.value.length;
for(let n=0;n<max_mat_sprite;n++){
mat["sprite"].uniforms.map.value[n].colorSpace=THREE.SRGBColorSpace;
mat["sprite"].uniforms.map.value[n].needsUpdate=true;
}


mesh["rock"].material.map.colorSpace=THREE.SRGBColorSpace;
mesh["rock"].material.map.needsUpdate=true;
mesh["wolf"].children[1].material.map.colorSpace=THREE.SRGBColorSpace;
mesh["wolf"].children[1].material.map.needsUpdate=true;
mesh["home"].castShadow=true;
mesh["home"].receiveShadow=true;
mesh["home001"].castShadow=true;
mesh["home001"].receiveShadow=true;


}


function init_core(){


let cube_texture_loader=new THREE.CubeTextureLoader(loadingManager);
cube_texture_loader.setPath("./images/sky/");
//let environment_texture=cube_texture_loader.load(["lf.jpg","rt.jpg","up.jpg","dn.jpg","ft.jpg","bk.jpg"]);
//let environment_texture=cube_texture_loader.load(["lf.png","rt.png","up.png","dn.png","ft.png","bk.png"]);
//let environment_texture=cube_texture_loader.load(["px.png","nx.png","py.png","ny.png","pz.png","nz.png"]);
//let environment_texture=cube_texture_loader.load(["px.jpg","nx.jpg","py.jpg","ny.jpg","pz.jpg","nz.jpg"]);
//let environment_texture=cube_texture_loader.load(["lf.jpg","rt.jpg","up.jpg","dn.jpg","ft.jpg","bk.jpg"],lightProbe_update);
//let environment_texture=cube_texture_loader.load(["px.jpg","nx.jpg","py.jpg","ny.jpg","pz.jpg","nz.jpg"],lightProbe_update);


THREE.ShaderLib.backgroundCube.fragmentShader=THREE.ShaderLib.backgroundCube.fragmentShader.replace(
"#include <tonemapping_fragment>",
`float toneMappingExposure=1.0;
const float StartCompression = 0.8 - 0.04;
const float Desaturation = 0.15;
gl_FragColor.rgb *= toneMappingExposure;
float x = min( gl_FragColor.r, min( gl_FragColor.g, gl_FragColor.b ) );
float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
gl_FragColor.rgb -= offset;
float peak = max( gl_FragColor.r, max( gl_FragColor.g, gl_FragColor.b ) );
if ( peak > StartCompression ){
float d = 1. - StartCompression;
float newPeak = 1. - d * d / ( peak + d - StartCompression );
gl_FragColor.rgb *= newPeak / peak;
float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
gl_FragColor.rgb=mix( gl_FragColor.rgb, vec3( newPeak ), g );
}`
);


scene.background=environment_main;
//scene.background=environment_texture;


scene_2.background=environment_main;


scene_envMap_scene.backgroundBlurriness=0.0;
scene_envMap_scene.background=environment_main;
scene_envMap_camera.update(renderer,scene_envMap_scene);


player.position.x=18.1;
player.position.y=1.8;
player.position.z=53.46;
player.angle.z=170;
player.angle.y=302;
updatePosition({movementX:2,movementY:1});
player.direction.x=Math.cos((-player.angle.y-90)*radian)*(Math.sin(player.angle.z*radian));
player.direction.y=Math.cos(player.angle.z*radian);
player.direction.z=Math.sin((-player.angle.y-90)*radian)*(Math.sin(player.angle.z*radian));
camera.lookAt(player.position.x+player.direction.x,player.position.y+player.direction.y,player.position.z+player.direction.z);


shadow_ground_init();


music_effects_gen();
sounds_effects_gen();
sounds_volume_gen(10);
set_lights();


lightMap.set_uv(mesh);



for(let i in mesh){
if(!mesh[i].material || !mesh[i].material.length){ continue; }
materials_duplicates_remover(mesh[i]);
}


lightMap.set_tex(mesh,tex); 


set_soldiers();
set_gun();


prosto_zapchasti();


instance_long();
instance_set();


set_flare();
set_sprite(THREE,mat,tex,vs,fs,mesh,scene);
set_pseudo();


set_crosshair(THREE,mat,tex,vs,fs,mesh,scene_hud);


water_set();


set_other();
SRGB_set();
press_q();


set_window();


}


function set_soldiers(){


mesh["soldier_attack_1"]=SkeletonUtils.clone(mesh["soldier"]);
mesh["soldier_attack_1"].animations=mesh["soldier"].animations;
mixer["soldier_attack_1"]=new THREE.AnimationMixer(mesh["soldier_attack_1"]);
action["soldier_attack_1"]=THREE.AnimationUtils.subclip(mesh["soldier_attack_1"].animations[0],'attack',0,100);
action["soldier_attack_1"]=mixer["soldier_attack_1"].clipAction(action["soldier_attack_1"]);
action["soldier_attack_1"].time=0;
action["soldier_attack_1"].play();
mixers.push(mixer["soldier_attack_1"]);
mesh["soldier_attack_1"].animations=[];
mesh["soldier_attack_1"].scale.set(0.025,0.025,0.025);
mesh["soldier_attack_1"].position.set(-2,0,-8);
mesh["soldier_attack_1"].rotation.y=0;
mesh["soldier_attack_1"].children[1].frustumCulled=false;
mesh["soldier_attack_1"].children[1].onAfterRender=function(){
this.frustumCulled=true;
this.onAfterRender=function(){};
}
scene.add(mesh["soldier_attack_1"]);


mesh["soldier_attack_2"]=SkeletonUtils.clone(mesh["soldier"]);
mesh["soldier_attack_2"].animations=mesh["soldier"].animations;
mixer["soldier_attack_2"]=new THREE.AnimationMixer(mesh["soldier_attack_2"]);
action["soldier_attack_2"]=THREE.AnimationUtils.subclip(mesh["soldier_attack_2"].animations[0],'attack',0,100);
action["soldier_attack_2"]=mixer["soldier_attack_2"].clipAction(action["soldier_attack_2"]);
action["soldier_attack_2"].time=0;
action["soldier_attack_2"].play();
mixers.push(mixer["soldier_attack_2"]);
mesh["soldier_attack_2"].animations=[];
mesh["soldier_attack_2"].scale.set(0.025,0.025,0.025);
mesh["soldier_attack_2"].position.set(2,0,-8);
mesh["soldier_attack_2"].rotation.y=0;
mesh["soldier_attack_2"].children[1].frustumCulled=false;
mesh["soldier_attack_2"].children[1].onAfterRender=function(){
this.frustumCulled=true;
this.onAfterRender=function(){};
}
scene.add(mesh["soldier_attack_2"]);


}


function set_gun(){


let hand;
mesh["soldier_attack_1"].traverse(function(child){
if(child.name=="swatRightHand"){ hand=child; }
});


mesh["pistol"]=mesh["gun"].clone();
mesh["pistol"].rotation.y=1.57;
mesh["pistol"].scale.set(20,20,20);
mesh["pistol"].position.set(0,-0.04,-0.05);
scene.add(mesh["pistol"]);
mesh["pistol"].add(gun_light);
mesh["pistol"].parent=mesh["weapon"];


mesh["gun"].parent=hand;
mesh["gun"].position.set(-12,-2,3);
mesh["gun"].scale.set(2000,2000,2000);
mesh["gun"].rotation.set(1.57,3.3,0);


scene_2.children.push(mesh["pistol"]);
scene_2.children.push(mesh["weapon"]);


}


dummy["shot_spread"]=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,1),new THREE.MeshStandardMaterial({color:0xff0000}));
dummy["shot_spread"].matrixAutoUpdate=false;
dummy["shot_spread"].updateMatrixWorld=function(){};
dummy["shot_spread"].geometry.translate(0,0,0.5);
scene.add(dummy["shot_spread"]);


mesh["test"]=new THREE.Mesh(new THREE.SphereGeometry(0.01,32,32),new THREE.MeshPhongMaterial({color:0xffc000}));
scene.add(mesh["test"]);


let spread=new THREE.Vector3();
let m_radius=1.0;
let theta=2*Math.PI*Math.random();
let r=Math.sqrt(Math.random());
r=0.45;
spread.x=r*m_radius*Math.cos(theta);
spread.y=r*m_radius*Math.sin(theta);
spread.z=-1;
spread.normalize();
dummy["shot_spread"].lookAt(spread);
dummy["shot_spread"].updateMatrix();
mesh["test"].position.set(spread.x,spread.y,spread.z);


function rzh(){
theta+=0.01;
spread.x=r*m_radius*Math.cos(theta);
spread.y=r*m_radius*Math.sin(theta);
spread.z=-1;
spread.normalize();
dummy["shot_spread"].lookAt(spread);
dummy["shot_spread"].updateMatrix();
let ddd=new THREE.Quaternion();
camera.getWorldQuaternion(ddd);
spread.applyQuaternion(ddd);
mesh["test"].position.set(spread.x+camera.position.x,spread.y+camera.position.y,spread.z+camera.position.z);
}


let pclose_g_1;
let pclose_g_2;
let pclose_g_3;


function prosto_zapchasti(){


mesh["Box002"].castShadow=true;


mesh["big_box"]=new THREE.Mesh(new THREE.BoxGeometry(1,5,1),new THREE.MeshStandardMaterial({color:0xffffff}));
mesh["big_box"].castShadow=true;
mesh["big_box"].position.set(47.8,1.8,61.8);
scene.add(mesh["big_box"]);


mesh["big_box_2"]=new THREE.Mesh(new THREE.BoxGeometry(3,5,3),new THREE.MeshStandardMaterial({map:tex["wall_118"]}));
mesh["big_box_2"].castShadow=true;
mesh["big_box_2"].position.set(32,-2.2,85);
scene.children.push(mesh["big_box_2"]);
scene_2.children.push(mesh["big_box_2"]);


mesh["big_box_3"]=new THREE.Mesh(new THREE.BoxGeometry(2,5,2),new THREE.MeshStandardMaterial({color:0xffff00}));
mesh["big_box_3"].castShadow=true;
mesh["big_box_3"].position.set(32,1.8,28);
scene.add(mesh["big_box_3"]);


mesh["big_box_4"]=new THREE.Mesh(new THREE.BoxGeometry(0.1,10,0.1),new THREE.MeshStandardMaterial({color:0xffff00}));
mesh["big_box_4"].castShadow=true;
mesh["big_box_4"].position.set(35.5,0.5,66.5);
scene.children.push(mesh["big_box_4"]);
scene_2.children.push(mesh["big_box_4"]);


mesh["big_box_5"]=new THREE.Mesh(new THREE.BoxGeometry(0.01,10,0.01),new THREE.MeshStandardMaterial({color:0xffff00}));
mesh["big_box_5"].castShadow=true;
mesh["big_box_5"].position.set(32,0.5,72);
scene.children.push(mesh["big_box_5"]);
scene_2.children.push(mesh["big_box_5"]);


mesh["big_box_6"]=new THREE.Mesh(new THREE.BoxGeometry(2,0.4,2),new THREE.MeshStandardMaterial({map:tex["wall_277"],normalMap:tex["wall_278"],normalScale:{x:1.5,y:1.5},roughnessMap:tex["wall_279"],roughness:10}));
mesh["big_box_6"].castShadow=true;
mesh["big_box_6"].position.set(23,-1,94);
scene.children.push(mesh["big_box_6"]);
scene_2.children.push(mesh["big_box_6"]);


mesh["big_box_7"]=new THREE.Mesh(new THREE.BoxGeometry(10,50,10),new THREE.MeshStandardMaterial({color:0xffffff}));
mesh["big_box_7"].castShadow=true;
mesh["big_box_7"].position.set(130,25,50);
scene.add(mesh["big_box_7"]);


mesh["big_box_8"]=new THREE.Mesh(new THREE.BoxGeometry(4,30,1),new THREE.MeshStandardMaterial({color:0xffffff}));
mesh["big_box_8"].castShadow=true;
mesh["big_box_8"].position.set(130,40,55.5);
scene.add(mesh["big_box_8"]);


mesh["big_box_9"]=new THREE.Mesh(new THREE.BoxGeometry(4,30,0.5),new THREE.MeshStandardMaterial({color:0xffffff}));
mesh["big_box_9"].castShadow=true;
mesh["big_box_9"].position.set(0,0,0);
mesh["big_box_9"].rotation.z=1.57;
mesh["big_box_8"].add(mesh["big_box_9"]);


mesh["big_box_10"]=new THREE.Mesh(new THREE.BoxGeometry(1,5,1),new THREE.MeshStandardMaterial({color:0xff0000}));
mesh["big_box_10"].castShadow=true;
mesh["big_box_10"].receiveShadow=true;
mesh["big_box_10"].position.set(34,-2.2,90);
scene.children.push(mesh["big_box_10"]);
scene_2.children.push(mesh["big_box_10"]);


mesh["big_box_11"]=new THREE.Mesh(new THREE.BoxGeometry(1,5,1),new THREE.MeshStandardMaterial({color:0x00ff00}));
mesh["big_box_11"].castShadow=true;
mesh["big_box_11"].receiveShadow=true;
mesh["big_box_11"].position.set(34,-2.2,92);
scene.children.push(mesh["big_box_11"]);
scene_2.children.push(mesh["big_box_11"]);


mesh["big_box_12"]=new THREE.Mesh(new THREE.BoxGeometry(1,5,1),new THREE.MeshStandardMaterial({color:0x0000ff}));
mesh["big_box_12"].castShadow=true;
mesh["big_box_12"].receiveShadow=true;
mesh["big_box_12"].position.set(34,-2.2,94);
scene.children.push(mesh["big_box_12"]);
scene_2.children.push(mesh["big_box_12"]);


mesh["big_box_13"]=new THREE.Mesh(new THREE.BoxGeometry(2,1,0.2),new THREE.MeshStandardMaterial({map:tex["wall_118"]}));
mesh["big_box_13"].castShadow=true;
mesh["big_box_13"].position.set(32,-0.5,86.6);
scene.children.push(mesh["big_box_13"]);
scene_2.children.push(mesh["big_box_13"]);


mesh["mbox"]=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({map:tex["wall_118"]}));
mesh["mbox"].castShadow=true;
mesh["mbox"].position.set(30,-0.5,70);
scene.children.push(mesh["mbox"]);
scene_2.children.push(mesh["mbox"]);


scene_2.children.push(mesh["terrain"]);


let angx=90;
let angy=10;
let xr=angx*radian;
let yr=(-angy-90)*radian;
let x=Math.cos(yr)*Math.sin(xr);
let y=Math.cos(xr);
let z=Math.sin(yr)*Math.sin(xr);
//dummy["shot_spread"].lookAt(x,y,z);


let alpha=Math.atan(z/x);
let beta=Math.atan(y/z);


let yaw=Math.atan(y/x);
let pitch=Math.atan(z/Math.sqrt(x^2+y^2));

let degrees=yaw*180/Math.PI;

let ax=Math.atan(z/y);
let ay=Math.atan(x/z);


/*

dummy["shot_spread"].lookAt(0.5,0,0.5);
dummy["shot_spread"].updateMatrix();
dummy["shot_spread"].matrix.multiplyMatrices(camera.matrixWorld,dummy["shot_spread"].matrix);
dummy["shot_spread"].updateMatrixWorld();


let xcv=new THREE.Vector3(0,0,1);
xcv.applyQuaternion(camera.quaternion);
xcv.x+=camera.position.x;
xcv.y+=camera.position.y;
xcv.z+=camera.position.z;
dummy["shot_spread"].position.set(camera.position.x,camera.position.y,camera.position.z);
dummy["shot_spread"].updateMatrix();
dummy["shot_spread"].lookAt(xcv);
dummy["shot_spread"].updateMatrix();


camera.getWorldDirection(xcv);
xcv.x+=camera.position.x;
xcv.y+=camera.position.y;
xcv.z+=camera.position.z;
dummy["shot_spread"].position.set(camera.position.x,camera.position.y,camera.position.z);
dummy["shot_spread"].updateMatrix();
dummy["shot_spread"].lookAt(xcv);
dummy["shot_spread"].updateMatrix();


let ddd=new THREE.Quaternion();
camera.getWorldQuaternion(ddd);
dummy["shot_spread"].quaternion._x=0;
dummy["shot_spread"].quaternion._y=0;
dummy["shot_spread"].quaternion._z=0;
dummy["shot_spread"].quaternion._w=1;
dummy["shot_spread"].applyQuaternion(ddd);
dummy["shot_spread"].position.x=camera.position.x;
dummy["shot_spread"].position.y=camera.position.y;
dummy["shot_spread"].position.z=camera.position.z;
dummy["shot_spread"].updateMatrix();


let aa=new THREE.Vector3();
aa.x=r*m_radius*Math.cos(theta);
aa.y=r*m_radius*Math.sin(theta);
aa.z=-1;
mesh["d1"].lookAt(aa);
mesh["s1"].position.set(aa.x,aa.y,aa.z);
aa.normalize();
mesh["d2"].lookAt(aa);
mesh["s2"].position.set(aa.x,aa.y,aa.z);
let bb=new THREE.Vector2(aa.x,aa.y);
bb.length();


*/





//pclose_g_1=new THREE.Geometry().fromBufferGeometry(mesh["Box002"].geometry);
//pclose_g_2=new THREE.Geometry().fromBufferGeometry(mesh["home001"].geometry);
//pclose_g_3=new THREE.Geometry().fromBufferGeometry(mesh["home"].geometry);


pclose_g_1=mesh["Box002"].geometry;
pclose_g_2=mesh["home001"].geometry;
pclose_g_3=mesh["home"].geometry;


//ajax_timeout=setTimeout("ajax_send();",1000);


mesh["wall_001"].material=new THREE.MeshStandardMaterial({
map:tex["wall_237"],
envMap:tex["env_sunny"],
normalMap:tex["wall_238_n"],
normalScale:{x:1,y:-1},
roughness:0.4,
metalness:0.5
});


mesh["wall_002"].material=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["wall_237"]},
normalRepeat:{value:[1,1]},
normalScale:{value:[1,-1]},
normalMap:{value:tex["wall_238_n"]},
specularMap:{value:tex["specular_test"]},
fogColor:{value:fogColor},
},
vertexShader:vs["wall"],
fragmentShader:fs["wall"],
extensions:{derivatives:true}
});


mesh["wall_003"].material=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["wall_237"]},
mapRepeat:{value:[1,1]},
aoMap:{value:tex["wall_003CompleteMap"]},
normalMap:{value:tex["wall_238_n"]},
normalRepeat:{value:[1,1]},
normalScale:{value:[1,-1]},
specularMap:{value:tex["specular_test"]},
specularRepeat:{value:[1,1]},
shininess:{value:60},
glossiness:{value:1},
fogColor:{value:fogColor},
envMap:{value:scene.background}
},
vertexShader:vs["stone"],
fragmentShader:fs["stone"],
extensions:{derivatives:true}
});


/*
mat["terrain"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["terrain_grass"]},
dirt:{value:tex["terrain_dirt"]},
noise:{value:tex["terrain_noise"]},
aoMap:{value:tex["terrainCompleteMap"]},
shadowGroundMap:{value:tex["shadow_ground_1"]},
shadowGroundOffset:{value:[0,0]},
fogColor:{value:fogColor},
},
vertexShader:vs["terrain_triplanar"],
fragmentShader:fs["terrain_triplanar"],
});
*/


/*
mat["terrain"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["017_color"]},
mapRepeat:{value:[200,200]},
aoMap:{value:tex["terrainCompleteMap"]},
noise:{value:tex["terrain_noise"]},
normalMap:{value:tex["017_normal"]},
normalRepeat:{value:[200,200]},
normalScale:{value:[1,1]},
specularMap:{value:tex["ground_63"]},
specularRepeat:{value:[1,1]},
shininess:{value:60},
glossiness:{value:0.99},
fogColor:{value:fogColor},
},
vertexShader:vs["stone"],
fragmentShader:fs["stone"],
extensions:{derivatives:true}
});
*/


/*
mat["terrain"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["terrain_grass"]},
dirt:{value:tex["terrain_dirt"]},
noise:{value:tex["terrain_noise_2"]},
aoMap:{value:tex["terrainCompleteMap"]},
shadowGroundMap:{value:tex["shadow_ground_1"]},
shadowGroundOffset:{value:[0,0]},
fogColor:{value:fogColor},
},
vertexShader:vs["terrain_single"],
fragmentShader:fs["terrain_single"],
});
*/


/*
mat["terrain"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["ground_1_diffuse"]},
dirt:{value:tex["terrain_dirt"]},
noise:{value:tex["terrain_noise"]},
aoMap:{value:tex["terrainCompleteMap"]},
shadowGroundMap:{value:tex["shadow_ground_1"]},
shadowGroundOffset:{value:[0,0]},
fogColor:{value:fogColor},
},
vertexShader:vs["terrain_triplanar"],
fragmentShader:fs["terrain_triplanar"],
});
*/


mat["terrain"]=new THREE.MeshStandardMaterial({
map:tex["ground_1_diffuse"],
aoMapIntensity:0,
//roughnessMap:tex["ground_1_roughness"],
roughness:0.8,
normalMap:tex["ground_1_normal"],
normalScale:{x:1,y:1},
});


mesh["terrain"].material=mat["terrain"];


mat["terrain"].alphaMap=tex["terrain_noise"];
mat["terrain"].aoMap=tex["dirt"];


mat["terrain"].onBeforeCompile=(shader)=>{
//console.log(shader.vertexShader);
//console.log(shader.fragmentShader);


shader.fragmentShader=shader.fragmentShader.replace("#include <normal_fragment_begin>",
`
float faceDirection=gl_FrontFacing?1.0:-1.0;


vec3 normal=normalize(vNormal);


#ifdef DOUBLE_SIDED
normal*=faceDirection;
#endif


mat3 tbn=getTangentFrame(-vViewPosition,normal,vNormalMapUv);


#if defined( DOUBLE_SIDED )
tbn[0]*=faceDirection;
tbn[1]*=faceDirection;
#endif


vec3 nonPerturbedNormal=normal;
`);


shader.fragmentShader=shader.fragmentShader.replace("#include <normal_fragment_maps>",
`
vec3 mapN=texture2D(normalMap,vNormalMapUv).xyz*2.0-1.0;
mapN.xy*=normalScale;
normal=normalize(tbn*mapN);




vec3 eye_pos=-vViewPosition;
vec2 vUv=vNormalMapUv;
vec3 N=vNormal;


vec3 q0=dFdx(eye_pos.xyz);
vec3 q1=dFdy(eye_pos.xyz);
vec2 st0=dFdx(vUv);
vec2 st1=dFdy(vUv);
vec3 q1perp=cross(q1,N);
vec3 q0perp=cross(N,q0);
vec3 T=q1perp*st0.x+q0perp*st1.x;
vec3 B=q1perp*st0.y+q0perp*st1.y;
float det=max(dot(T,T),dot(B,B));
float scale=(det==0.0)?0.0:inversesqrt(det);
normal=normalize(T*(mapN.x*scale)+B*(mapN.y*scale)+N*mapN.z);



`);


//shader.fragmentShader=shader.fragmentShader.replace("#include <alphamap_fragment>",
//`diffuseColor.rgb*=texture2D(alphaMap,vUv/30.0).rgb*1.0;`);


shader.fragmentShader=shader.fragmentShader.replace("#include <alphamap_fragment>",
`
vec3 tex=texture2D(map,vMapUv).rgb;
float gamma=texture2D(normalMap,vMapUv/50.0).g;
// ДОПОЛНИТЕЛЬНАЯ КАРТА НОРМАЛИ БОЛЬШАЯ
//diffuseColor.rgb=pow(tex,vec3(0.6+gamma/1.0));
diffuseColor.rgb=mix(diffuseColor.rgb,texture2D(aoMap,vMapUv).rgb,texture2D(alphaMap,vMapUv/20.0).r);
diffuseColor.rgb=mix(diffuseColor.rgb,texture2D(aoMap,vMapUv).rgb,texture2D(alphaMap,vMapUv/100.0).r);
//vec3 tex=texture2D(map,vMapUv).rgb*texture2D(map,vMapUv/35.0).rgb*8.0;
//diffuseColor.rgb=tex;
//diffuseColor.rgb=mix(tex,texture2D(aoMap,vMapUv).rgb,texture2D(alphaMap,vMapUv/70.0).r);
//diffuseColor.rgb=mix(texture2D(map,vMapUv).rgb,texture2D(aoMap,vUv).rgb,texture2D(alphaMap,vMapUv/70.0).r);
`);

shader.fragmentShader=shader.fragmentShader.replace("#include <lightmap_fragment>",
``);

shader.fragmentShader=shader.fragmentShader.replace("#include <aomap_fragment>",
`float ambientOcclusion;`);


shader.vertexShader=shader.vertexShader.replace("#include <common>",
`#include <common>
varying vec3 vPosition;
`);


shader.vertexShader=shader.vertexShader.replace("#include <begin_vertex>",
`#include <begin_vertex>
vPosition = vec3( position );
`);


shader.fragmentShader=shader.fragmentShader.replace("#include <common>",
`#include <common>
varying vec3 vPosition;
`);


shader.fragmentShader=shader.fragmentShader.replace("#include <metalnessmap_fragment>",
`#include <metalnessmap_fragment>
metalnessFactor=smoothstep(-0.5,-0.9,vPosition.y)*0.6;
roughnessFactor=mix(0.8,1.0,smoothstep(-0.5,-0.9,vPosition.y));


`);


};


mesh["rock"]=new THREE.Mesh(new THREE.BoxGeometry(2,2,2),new THREE.MeshStandardMaterial({
map:tex["bb_diffuse"],
roughness:1.0,
normalMap:tex["bb_normal"],
normalScale:{x:1,y:1}
}));
mesh["rock"].position.set(3.5,0,6);
scene.add(mesh["rock"]);


mesh["tower"]=new THREE.Mesh(new THREE.CylinderGeometry(4,4,30,32,1),new THREE.MeshStandardMaterial({
map:tex["bb_diffuse"],
roughness:0.8,
normalMap:tex["bb_normal"],
normalScale:{x:1,y:1}
}));
mesh["tower"].castShadow=true;
mesh["tower"].position.set(-67,50,72);
scene.add(mesh["tower"]);


mesh["tube"]=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,2,32,5),new THREE.MeshStandardMaterial({
color:0xffffff,
envMap:tex["env_sunny"],
metalness:1,
roughness:0,
}));
mesh["tube"].position.set(16.6,1,-8.4);
mesh["tube"].castShadow=true;
mesh["tube"].receiveShadow=true;
scene.add(mesh["tube"]);


mesh["terrain"].receiveShadow=true;
mesh["terrain"].castShadow=true;


for(let x=-2;x<3;x++){
for(let y=-2;y<0;y++){
if(x==0 && y==0){ continue; }
mesh["terrain_"+x+"_"+y]=mesh["terrain"].clone();
mesh["terrain_"+x+"_"+y].position.set(x*500,0,y*500);
mesh["terrain_"+x+"_"+y].matrixAutoUpdate=true;
mesh["terrain_"+x+"_"+y].updateMatrixWorld();
mesh["terrain_"+x+"_"+y].updateMatrixWorld=function(){};
scene.add(mesh["terrain_"+x+"_"+y]);
}
}


}


function instance_long(){


let bufferGeometry=mesh["grass_long"].geometry;
let geometry=new THREE.InstancedBufferGeometry();
geometry.index=bufferGeometry.index;
geometry.attributes.position=bufferGeometry.attributes.position;
geometry.attributes.uv=bufferGeometry.attributes.uv;
geometry.attributes.normal=bufferGeometry.attributes.normal;


geometry.setAttribute('offset',new THREE.InstancedBufferAttribute(new Float32Array(),3));
geometry.setAttribute('orientation',new THREE.InstancedBufferAttribute(new Float32Array(),4));
geometry.setAttribute('scale',new THREE.InstancedBufferAttribute(new Float32Array(),1));
geometry.setAttribute('color',new THREE.InstancedBufferAttribute(new Float32Array(),3));


mat["grass_long_1"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["grass_long_1"]},
wind:{value:tex["wind"]},
noiseMap:{value:tex["grass_color"]},
shadowMap:{value:tex["terrainCompleteMap"]},
time:{value:0},
sun_direction:{value:sun_direction},
},
vertexShader:vs["grass"],
fragmentShader:fs["grass"],
side:2,
transparent:true,
//alphaToCoverage:true,
});


mesh["instance_grass_long"]=new THREE.Mesh(geometry,mat["grass_long_1"]);
mesh["instance_grass_long"].renderOrder=-2; 
mesh["instance_grass_long"].castShadow=true;
mesh["instance_grass_long"].matrixAutoUpdate=false;
mesh["instance_grass_long"].updateMatrixWorld=function(){};
mesh["instance_grass_long"].frustumCulled=false;
mesh["instance_grass_long"].onBeforeRender=function(){ this.material.uniforms.time.value=time*0.002; this.customDepthMaterial.uniforms.time.value=time*0.002; this.customDepthMaterial.uniforms.xz.value=[camera.position.x,camera.position.z]; };
scene.add(mesh["instance_grass_long"]);


mat["grass_long_1_depth"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["grass_long_1"]},
time:{value:0},
xz:{value:[0,0]}
},
vertexShader:vs["grass_depth"],
fragmentShader:fs["grass_depth"],
});


mesh["instance_grass_long"].customDepthMaterial=mat["grass_long_1_depth"];

	
}


function set_flare(){


let geometry=new THREE.InstancedBufferGeometry();
geometry.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array([-0.5,0.5,0,-0.5,-0.5,0,0.5,0.5,0,0.5,-0.5,0,0.5,0.5,0,-0.5,-0.5,0]),3));
geometry.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array([0,1,0,0,1,1,1,0,1,1,0,0]),2));
geometry.setAttribute('offset',new THREE.InstancedBufferAttribute(new Float32Array([-1,1,6,5,1,0,12,1,-5,8,1,0.5,-0.9,0.5,-9,16,0,46]),3));
geometry.setAttribute('scale',new THREE.InstancedBufferAttribute(new Float32Array([5,5,5,5,5,5,0.5,0.5,0.2,0.2,5,5]),2));
geometry.setAttribute('rotating',new THREE.InstancedBufferAttribute(new Float32Array([0.0002,-0.0002,0.0002,0.004,0,0]),1));
geometry.setAttribute('color',new THREE.InstancedBufferAttribute(new Float32Array([1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0]),3));
geometry.setAttribute('alpha',new THREE.InstancedBufferAttribute(new Float32Array([1,0.4,0.1,0.7,0.5,0.5]),1));


mat["flare"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["sprite_yellow"]},
time:{value:0}
},
vertexShader:vs["sprite_additive"],
fragmentShader:fs["sprite_additive"],
transparent:true,
depthWrite:false,
blending:THREE.AdditiveBlending,
side:THREE.DoubleSide
})


mesh["flare"]=new THREE.Mesh(geometry,mat["flare"]);
mesh["flare"].frustumCulled=false;
mesh["flare"].matrixAutoUpdate=false;
mesh["flare"].updateMatrixWorld=function(){};
scene.add(mesh["flare"]);


}


function set_pseudo(){


vs["pseudo"]=`
attribute vec3 position;
uniform vec2 screenTransform;
uniform vec2 offset;
void main() {
// БЫЛО 512/500=1.024 И УМНОЖЕНИЕ position.xz*1.024
gl_Position=vec4((position.xz+offset)*screenTransform.xy+vec2(-1.0,1.0),0.0,1.0);
gl_PointSize=10.0;
}
`;


fs["pseudo"]=`
uniform sampler2D map;
void main() {
gl_FragColor=texture2D(map,gl_PointCoord);
}
`;


mat["pseudo"]=new THREE.RawShaderMaterial({
uniforms:{
map:{value:tex["shadow_tree"]},
// РАЗМЕР СЕКТОРА ЛАНДШАФТА
screenTransform:{value:[2.0/500.0,2.0/500.0]},
offset:{value:[0,0]}
},
vertexShader:vs["pseudo"],
fragmentShader:fs["pseudo"],
depthTest:false,
depthWrite:false,
transparent:true
});


let geometry=new THREE.BufferGeometry();
geometry.setAttribute("position",new THREE.BufferAttribute());
mesh["pseudo"]=new THREE.Points(geometry,mat["pseudo"]);
mesh["pseudo"].matrixAutoUpdate=false;
mesh["pseudo"].updateMatrixWorld=function(){};
mesh["pseudo"].frustumCulled=false;


vs["pseudo2"]=`
attribute vec3 position;
uniform vec2 screenTransform;
uniform vec2 offset;
void main() {
// БЫЛО 512/500=1.024 И УМНОЖЕНИЕ position.xz*1.024
gl_Position=vec4((position.xz+offset)*screenTransform.xy+vec2(-1.0,1.0),0.0,1.0);
gl_PointSize=20.0;
}
`;


fs["pseudo2"]=`
uniform sampler2D map;
void main() {
gl_FragColor=vec4(0.0,0.0,0.0,1.0);
//gl_FragColor=texture2D(map,gl_PointCoord);
}
`;


mat["pseudo2"]=new THREE.RawShaderMaterial({
uniforms:{
map:{value:tex["shadow_tree"]},
// РАЗМЕР СЕКТОРА ЛАНДШАФТА
screenTransform:{value:[2.0/500.0,2.0/500.0]},
offset:{value:[0,0]}
},
vertexShader:vs["pseudo2"],
fragmentShader:fs["pseudo2"],
depthTest:false,
depthWrite:false,
transparent:true
});

let geometry2=new THREE.BufferGeometry();
geometry2.setAttribute("position",new THREE.BufferAttribute(new Float32Array(12),3));
geometry2.attributes.position.array[0]=20;
geometry2.attributes.position.array[2]=-20;
geometry2.attributes.position.array[3]=480;
geometry2.attributes.position.array[5]=-20;
geometry2.attributes.position.array[6]=20;
geometry2.attributes.position.array[8]=-480;
geometry2.attributes.position.array[9]=480;
geometry2.attributes.position.array[11]=-480;


mesh["pseudo2"]=new THREE.Points(geometry2,mat["pseudo2"]);
mesh["pseudo2"].matrixAutoUpdate=false;
mesh["pseudo2"].updateMatrixWorld=function(){};
mesh["pseudo2"].frustumCulled=false;
mesh["pseudo2"].geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
mesh["pseudo2"].geometry.attributes.position.needsUpdate=true;


}


function set_other(){


mesh["d1"]=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.2,1),new THREE.MeshPhongMaterial({color:0xffc000}));
mesh["d1"].geometry.translate(0,0,0.5);
mesh["d1"].material.wireframe=true;
scene.add(mesh["d1"]);
mesh["s1"]=new THREE.Mesh(new THREE.SphereGeometry(0.01,32,32),new THREE.MeshPhongMaterial({color:0xffc000}));
scene.add(mesh["s1"]);
mesh["d2"]=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,1),new THREE.MeshPhongMaterial({color:0xffc000}));
mesh["d2"].geometry.translate(0,0,0.6);
mesh["d2"].material.wireframe=true;
scene.add(mesh["d2"]);
mesh["s2"]=new THREE.Mesh(new THREE.SphereGeometry(0.01,32,32),new THREE.MeshPhongMaterial({color:0xffc000}));
scene.add(mesh["s2"]);


mat["overlay_damage_blood"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["overlay_damage_blood"]},
intensity:{value:1.0}
},
vertexShader:vs["overlay_damage_blood"],
fragmentShader:fs["overlay_damage_blood"],
transparent:true,
depthTest:false,
depthWrite:false,
//blending:THREE.AdditiveBlending,
});


mesh["overlay_damage_blood"]=new THREE.Mesh(new THREE.PlaneGeometry(1,1),mat["overlay_damage_blood"]);
modules_to_resize.push(()=>{
mesh["overlay_damage_blood"].matrixWorld.elements[0]=screen_width;
mesh["overlay_damage_blood"].matrixWorld.elements[5]=screen_height;
});


mesh["overlay_damage_blood"].frustumCulled=false;
mesh["overlay_damage_blood"].matrixAutoUpdate=false;
mesh["overlay_damage_blood"].updateMatrixWorld=function(){};
//scene_hud.add(mesh["overlay_damage_blood"]);


mesh["object_i_ray_triangle"]=new THREE.Mesh(new THREE.SphereGeometry(0.2,16,16),new THREE.MeshBasicMaterial({color:0x009000,opacity:0.5,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
scene.add(mesh["object_i_ray_triangle"]);


mesh["object_i_ray_sphere_1"]=new THREE.Mesh(new THREE.SphereGeometry(2,16,16),new THREE.MeshBasicMaterial({color:0x009000,opacity:0.5,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
mesh["object_i_ray_sphere_1"].geometry.computeBoundingSphere();
scene.add(mesh["object_i_ray_sphere_1"]);


mesh["object_i_ray_sphere_2"]=new THREE.Mesh(new THREE.SphereGeometry(1,16,16),new THREE.MeshBasicMaterial({color:0x009000,opacity:0.5,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
mesh["object_i_ray_sphere_2"].geometry.computeBoundingSphere();
scene.add(mesh["object_i_ray_sphere_2"]);


mesh["status_i_ray_sphere"]=new THREE.Mesh(new THREE.SphereGeometry(0.10,3,3),new THREE.MeshLambertMaterial({color:0xffff00}));
scene.add(mesh["status_i_ray_sphere"]);


mesh["status_i_ray_AABB"]=new THREE.Mesh(new THREE.SphereGeometry(0.10,3,3),new THREE.MeshLambertMaterial({color:0xff00ff}));
scene.add(mesh["status_i_ray_AABB"]);


mesh["belmo"]=new THREE.Mesh(
new THREE.PlaneGeometry(2,2,1),
new THREE.MeshBasicMaterial({transparent:true,opacity:0.5})
)


/*
mesh["belmo"].geometry.computeBoundingSphere();
let mem_bb=mesh["belmo"].geometry.boundingSphere.center.x,belmo.geometry.boundingSphere.center.y,belmo.geometry.boundingSphere.center.z];
mesh["belmo"].geometry.center();
mesh["belmo"].geometry.translate(0,1,0);
mesh["belmo"].position.set(mem_bb[0],0,mem_bb[2]);
*/
//mesh["belmo"].position.set(0,100,0);


mesh["belmo"].geometry.translate(0,0.5,0);
scene.add(mesh["belmo"]);


mesh["rotate_sphere"]=new THREE.Mesh(
new THREE.SphereGeometry(0.1,3,3),
new THREE.MeshNormalMaterial()
);
mesh["rotate_sphere"].position.set(2,1,2);
scene.add(mesh["rotate_sphere"]);


}
