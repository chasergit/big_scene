

// ____________________ WATER LINE TEXTURE ____________________


let waterline_rtt=new THREE.WebGLRenderTarget(screen_width,screen_height);
// IT IS IMPORTANT TO SET HIGH TEXTURE QUALITY FOR THE WATER LINE
waterline_rtt.depthBuffer=true;
waterline_rtt.texture.type=THREE.FloatType;
waterline_rtt.texture.minFilter=THREE.NearestFilter;
waterline_rtt.texture.magFilter=THREE.NearestFilter;


// ____________________ TEXTURE OF THE UNDERWATER SCENE ____________________


let water_rtt_scene=new THREE.WebGLRenderTarget(screen_width,screen_height);
water_rtt_scene.depthTexture=new THREE.DepthTexture();
water_rtt_scene.depthTexture.type=THREE.FloatType;
water_rtt_scene.texture.wrapS=water_rtt_scene.texture.wrapT=THREE.MirroredRepeatWrapping;
// WE SET FILTERS TO AVOID SMALL ARTIFACTS WHEN USING REFRACTION
// FOR EXAMPLE, AN OBJECT ABOVE THE WATER WILL HAVE ITS OWN PIXELS VISIBLE AROUND IT
water_rtt_scene.texture.minFilter=THREE.NearestFilter;
water_rtt_scene.texture.magFilter=THREE.NearestFilter;


// ____________________ REFRACTION TEXTURE ____________________


let water_rtt_refraction=new THREE.WebGLRenderTarget(screen_width,screen_height);
water_rtt_refraction.depthTexture=new THREE.DepthTexture();
water_rtt_refraction.depthTexture.type=THREE.FloatType;
water_rtt_refraction.texture.wrapS=water_rtt_refraction.texture.wrapT=THREE.MirroredRepeatWrapping;
water_rtt_refraction.texture.minFilter=THREE.NearestFilter;
water_rtt_refraction.texture.magFilter=THREE.NearestFilter;


let ray_hide_ocean_waterline=new THREE.Raycaster();
ray_hide_ocean_waterline.ray.direction.set(0,-1,0);
ray_hide_ocean_waterline.ray.origin.y=10000;


// GEOMETRY WHERE THERE SHOULD NOT BE AN OCEAN WATER LINE SO IT DOESN'T APPEAR ON THE LAKE
mesh["hide_ocean_waterline"]=new THREE.Mesh(new THREE.BoxGeometry(500,1,400),new THREE.MeshBasicMaterial());
mesh["hide_ocean_waterline"].position.set(0,0,0);


let underwater_pass_uniforms=underwater_pass.material.uniforms;


let water_eyes_status=1;
let water_eyes_intensity=0;
let water_eyes_height=0;


function water_set(){


underwater_ripples_pass.material.uniforms.normal_map.value=tex["underwater_ripples"];
underwater_ripples_pass.material.uniforms.eyes_normal_map.value=tex["underwater_eyes"];
underwater_pass_uniforms.waterline_rtt.value=waterline_rtt.texture;
underwater_ripples_pass.material.uniforms.waterline_rtt.value=waterline_rtt.texture;
underwater_pass_uniforms.sun_direction.value=sun_direction;
underwater_pass_uniforms.position_from_depth_projection.value=new THREE.Matrix4();


waters_set();


mesh["water_refraction"]=new THREE.Group();
mesh["water_refraction"].matrixWorldAutoUpdate=false;


for(let i in water){

	
let item=water[i];

	
if(i!="ocean"){
if(item.from_mesh!=null){ water_from_mesh(item); }
else{
item.left=Number((item.position.x-item.width/2).toFixed(2));
item.right=Number((item.position.x+item.width/2).toFixed(2));
item.top=Number((item.position.z+item.depth/2).toFixed(2));
item.bottom=Number((item.position.z-item.depth/2).toFixed(2));
}
water_lake_create(item,item.cells_size[0][0],i,null);
let max_lod=item.cells_size.length;
if(max_lod>1){
for(let n=1;n<max_lod;n++){
water_lake_create(item,item.cells_size[n][0],i,i+"_"+n);	
}
}
}


if(i=="ocean"){ water_ocean_create(); }
waterline_create(i);
// WATER HEIGHT TAKING INTO ACCOUNT WAVES
let wave=item.waves_amplitude;
// ADD 0.2 TO THE HEIGHT BECAUSE IF YOU PLACE IT CLOSE IN HEIGHT, THEN IN THIS PLACE WHEN THE CAMERA IS TILTED THE WATER LINE IS NOT VISIBLE
let amplitude=Number((item.waves_amplitude+0.2).toFixed(2));
item.height_top=Number((item.position.y+amplitude).toFixed(2));
mat[i].uniforms.wave_max_height={value:amplitude};
// WATER DEPTH
item.height_bottom=item.position.y-item.deep;


if(item.refraction==0 && water_stats){
console.log(i+" REFRACTION TRIANGLES: 0");
}


if(item.refraction==1){


let refraction_width=500;
let refraction_depth=500;
if(i!="ocean"){
refraction_width=item.width;
refraction_depth=item.depth;
}
 

let vertices=[];
let indices=[];
let w_half=refraction_width/2;
let h_half=refraction_depth/2;


vertices.push(-w_half,0,h_half,w_half,0,h_half,-w_half,0,-h_half,w_half,0,-h_half);
indices.push(0,1,2,2,1,3);


mat[i+"_refraction"]=new THREE.ShaderMaterial({
uniforms:{
move:{value:[0,0,0]},	
holes_map:item.holes_map,
holes_pars:item.holes_pars
},
vertexShader:vs["water_refraction"],
fragmentShader:fs["water_refraction"],
});


if(item.holes_map.value){ mat[i+"_refraction"].defines.holes=true; }
if(i=="ocean"){ mat[i+"_refraction"].defines.ocean=true; }


let geometry=new THREE.BufferGeometry();
geometry.setIndex(indices);
geometry.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));
geometry.boundingSphere=new THREE.Sphere();
geometry.boundingSphere.center.set(0,0,0);
geometry.boundingSphere.radius=Math.sqrt(refraction_width*refraction_width+refraction_depth*refraction_depth)/2;


let object=mesh[i+"_refraction"]=new THREE.Mesh(geometry,mat[i+"_refraction"]);
if(i!="ocean"){
object.position.x=item.position.x;	
object.position.z=item.position.z;	
}
object.position.y=item.position.y;
if(item.use_waves){ object.position.y-=item.waves_amplitude; }
object.updateMatrixWorld();
object.matrixWorldAutoUpdate=false;
mesh["water_refraction"].add(object);


if(i=="ocean"){ mesh["ocean_refraction"].frustumCulled=false; }


if(water_stats){
console.log(i+" REFRACTION TRIANGLES: 2");
}


}


if(item.refraction==2){

	
mat[i+"_refraction"]=new THREE.ShaderMaterial({
uniforms:{
time:{value:0},
move:{value:[0,0,0]},
gerstner_waves:{value:item.gerstner_waves},	
gerstner_waves_speed:item.gerstner_waves_speed,	
holes_map:item.holes_map,
holes_pars:item.holes_pars
},
defines:{
use_waves:item.use_waves,
waves_amount:item.gerstner_waves.length
},
vertexShader:vs["water_refraction"],
fragmentShader:fs["water_refraction"],
wireframe:water_debug,
});


if(item.holes_map.value){ mat[i+"_refraction"].defines.holes=true; }
if(i=="ocean"){ mat[i+"_refraction"].defines.ocean=true; }


let geometry=mesh[i].geometry.clone();


let object=mesh[i+"_refraction"]=new THREE.Mesh(geometry,mat[i+"_refraction"]);
if(i!="ocean"){
object.position.x=item.position.x;	
object.position.z=item.position.z;	
}
object.position.y=item.position.y;
object.updateMatrixWorld();
object.matrixWorldAutoUpdate=false;
mesh["water_refraction"].add(object);
	

if(i=="ocean"){ mesh["ocean_refraction"].frustumCulled=false; }


if(water_stats){
console.log(i+" REFRACTION TRIANGLES: "+geometry.index.count/3);
}

	
}


}


}


function gerstner_wave_get_position(name){
	
	
if(!water[name].use_waves){ return; }

	
let item=water[name].waves;
let max=item.length;


for(let n=0;n<max;n++){


let mytime=item[n].c*time*water[name].gerstner_waves_speed.value;


let f=item[n].k*(item[n].x*water_mx+item[n].y*water_mz-mytime);
let a=item[n].a;
let a_cos=a*Math.cos(f);
water_nx+=item[n].x*a_cos;
water_ny+=a*Math.sin(f);
water_nz+=item[n].y*a_cos;


}
	
	
}


function water_from_mesh(item){
	

let object=item.from_mesh;


// TAKE DATA FROM AN OLD LAKE TO CREATE A NEW ONE
object.geometry.computeBoundingBox();
let bounding=object.geometry.boundingBox;


item.left=Number(bounding.min.x.toFixed(2));
item.right=Number(bounding.max.x.toFixed(2));
item.top=Number(bounding.max.z.toFixed(2));
item.bottom=Number(bounding.min.z.toFixed(2));
item.width=Math.abs(item.right-item.left);
item.depth=Math.abs(item.top-item.bottom);
item.position.x=item.left+item.width/2;
item.position.y=Number(bounding.min.y.toFixed(2));
item.position.z=Number(item.bottom)+item.depth/2;


// DELETE THE OLD LAKE
object.geometry.dispose();
object.material.dispose();
scene.remove(object);
object.delete();
delete item.from_mesh;


}


function water_on_window_resize(){
	
	
for(let i in water){
mat[i].uniforms.screen_resolution.value=screen_resolution;
mat[i].uniforms.screen_texel_size.value=screen_texel_size;
}


if(typeof underwater_pass!="undefined"){
underwater_pass.uniforms.screen_aspect_ratio.value=screen_aspect_ratio;
underwater_pass.uniforms.screen_texel_size.value=screen_texel_size;
}


waterline_rtt.setSize(screen_width,screen_height);
water_rtt_scene.setSize(screen_width,screen_height);
water_rtt_refraction.setSize(screen_width,screen_height);


}


modules_to_resize.push(water_on_window_resize);


let water_nx=0;
let water_ny=0;
let water_nz=0;
let water_mx;
let water_mz;


function water_render(){


water_nx=0;
water_ny=0;
water_nz=0;


let pos_x=30;
let pos_y=water["lake"].position.y;
let pos_z=70+Math.sin(time*0.001)*10;
water_mx=pos_x-water["lake"].position.x;
water_mz=pos_z-water["lake"].position.z;


gerstner_wave_get_position("lake");


mesh["mbox"].position.set(pos_x+water_nx,pos_y+water_ny,pos_z+water_nz);


renderer.setRenderTarget(water_rtt_scene);
renderer.clear();
renderer.autoClear=true;
// DISABLE SHADOW UPDATE, SINCE THEY ARE ALREADY THERE FROM THE FIRST SCENE, ALTHOUGH, IF THE OBJECT IS MOVING, THE SHADOWS MAY NOT MATCH SLIGHTLY
let sun_autoUpdate_status=sun.shadow.autoUpdate;
sun.shadow.autoUpdate=false;
renderer.render(scene_2,camera);
// TURN ON SHADOWS
sun.shadow.autoUpdate=sun_autoUpdate_status;


// ____________________ REFRACTION ____________________


if(water_refaction_enabled){


for(let i in water){
	
	
let item=water[i];
if(item.refraction==0){ continue; }


let cp=camera.position;
if(i=="ocean"){
if(Math.abs(cp.y-item.position.y)>30){ mesh["ocean_refraction"].visible=false; continue; }
mesh["ocean_refraction"].visible=true;
}
else{
if(Math.sqrt((cp.x-item.position.x)**2+(cp.y-item.position.y)**2+(cp.z-item.position.z)**2)>mesh["lake"].geometry.boundingSphere.radius+30){ mesh[i+"_refraction"].visible=false; continue; }
mesh[i+"_refraction"].visible=true;
}


if(i=="ocean"){
// SHIFT THE OCEAN REFRACTION TOWARDS THE CAMERA
let step=item.ocean_move;
let move=[Math.floor(camera.position.x/step)*step,0,Math.floor(camera.position.z/step)*step];
mesh["ocean_refraction"].matrixWorld.elements[12]=move[0];
mesh["ocean_refraction"].matrixWorld.elements[14]=move[2];
mat["ocean_refraction"].uniforms.move.value=move;
}
if(item.refraction==2){
mat[i+"_refraction"].uniforms.time.value=time;
}


}


renderer.setRenderTarget(water_rtt_refraction);
renderer.clear();
renderer.render(mesh["water_refraction"],camera);
renderer.autoClear=false;
renderer.setRenderTarget(null);


}


// ____________________ WATERLINE ____________________


let waterline_mesh=null;
let waterline_name;


// HIDE ALL WATER LINES SO THEY DON'T GET IN THE WAY LATER
for(let i in water){
mesh["waterline_"+i].visible=false;	
}


for(let i in water){


if(i=="ocean"){ continue; }

	
let item=water[i];


// IF THERE IS WATER WITH LOD, THEN FIRST WE HIDE EVERYTHING, AND THEN WE SHOW THE RIGHT ONE


let max_lods=item.cells_size.length;
if(max_lods>1){
mesh[i].visible=false;
let show=i;
let cp=camera.position;	
for(let n=1;n<max_lods;n++){
let show_name=i+"_"+n;
mesh[show_name].visible=false;		
if(Math.sqrt((cp.x-item.position.x)**2+(cp.y-item.position.y)**2+(cp.z-item.position.z)**2)>=item.cells_size[n][1]){ show=show_name; }
}
mesh[show].visible=true;	
}


let pos=camera.position;
let pos_x=pos.x;
let pos_y=pos.y;
let pos_z=pos.z;
if(pos_x>item.left && pos_x<item.right && pos_z<item.top && pos_z>item.bottom && pos_y<item.height_top && pos_y>item.height_bottom){
waterline_mesh=i;
waterline_name="waterline_"+i;
mesh[waterline_name].visible=true;
break;
}
}


if(waterline_mesh==null && water["ocean"] && camera.position.y<water["ocean"].height_top && camera.position.y>water["ocean"].height_bottom){
ray_hide_ocean_waterline.ray.origin.x=camera.position.x;
ray_hide_ocean_waterline.ray.origin.z=camera.position.z;
let go_ocean_waterline=true;
if(water["ocean"].hide!=null){
let hits=ray_hide_ocean_waterline.intersectObject(water["ocean"].hide);
if(hits.length>0){ go_ocean_waterline=false; }
}
if(go_ocean_waterline==true){
waterline_mesh="ocean";
waterline_name="waterline_ocean";
mesh["waterline_ocean"].visible=true;	
}
}


if(waterline_mesh){
	

//MOVE THE WATER LINE TOWARDS THE CAMERA	
let step=water[waterline_mesh].waterline_move;
let move_waterline=[Math.floor(camera.position.x/step)*step,0,Math.floor(camera.position.z/step)*step];
mesh[waterline_name].matrixWorld.elements[12]=move_waterline[0];
mesh[waterline_name].matrixWorld.elements[14]=move_waterline[2];
if(waterline_mesh!="ocean"){
mat[waterline_name].uniforms.move.value=[move_waterline[0]-mesh[waterline_mesh].matrixWorld.elements[12],0.0,move_waterline[2]-mesh[waterline_mesh].matrixWorld.elements[14]];
}
else{
mat[waterline_name].uniforms.move.value=move_waterline;	
}
// UPDATE WATER LINE TIME
mat[waterline_name].uniforms.time.value=time;	


}


//MOVING THE OCEAN TOWARDS THE CAMERA
if(water["ocean"]){
let step=water["ocean"].ocean_move;
let move=[Math.floor(camera.position.x/step)*step,0,Math.floor(camera.position.z/step)*step];
mesh["ocean"].matrixWorld.elements[12]=move[0];
mesh["ocean"].matrixWorld.elements[14]=move[2];
mat["ocean"].uniforms.move.value=move;
}	
	
	
if(waterline_mesh){	


let water_item=water[waterline_mesh];
renderer.setRenderTarget(waterline_rtt);
renderer.clear();
renderer.render(mesh[waterline_name],camera);
renderer.setRenderTarget(null);


water_item.waterline_move;
let v=water_item.underwater_top_color;
let i=underwater_pass_uniforms.top_color.value;
let sun_y_max=Math.max(0.2,sun_direction.y);
i[0]=v.r*sun_y_max;
i[1]=v.g*sun_y_max;
i[2]=v.b*sun_y_max;
v=water_item.underwater_bottom_color;
i=underwater_pass_uniforms.bottom_color.value;
i[0]=v.r*sun_y_max;
i[1]=v.g*sun_y_max;
i[2]=v.b*sun_y_max;
underwater_pass_uniforms.use_transparent_style.value=water_item.use_transparent_style;
underwater_pass_uniforms.gradient_top.value=water_item.height_top+water_item.underwater_gradient_offset;
underwater_pass_uniforms.gradient_bottom.value=water_item.height_top-water_item.underwater_gradient_deep;
underwater_pass_uniforms.top_color_top.value=water_item.height_top+1.0;
underwater_pass_uniforms.top_color_bottom.value=water_item.height_top-water_item.underwater_top_color_deep;
underwater_pass_uniforms.darkness_top.value=water_item.height_top;
underwater_pass_uniforms.darkness_bottom.value=water_item.height_top-water_item.underwater_darkness_deep;
underwater_pass_uniforms.depth_distance.value=water_item.underwater_depth_distance;
underwater_pass_uniforms.use_caustics.value=water_item.use_caustics;
if(water_item.use_caustics){
underwater_pass_uniforms.caustics_map.value=water_item.caustics_map.value;
underwater_pass_uniforms.caustics_top.value=water_item.position.y;
underwater_pass_uniforms.caustics_bottom.value=water_item.position.y-1;
underwater_pass_uniforms.caustics_1_dir_speed.value=water_item.caustics_1_dir_speed.value;
underwater_pass_uniforms.caustics_2_dir_speed.value=water_item.caustics_2_dir_speed.value;
underwater_pass_uniforms.caustics_wave.value=water_item.caustics_wave.value;
underwater_pass_uniforms.caustics_intensity.value=water_item.caustics_intensity.value;
underwater_pass_uniforms.caustics_scale_power.value=water_item.caustics_scale_power.value;
underwater_pass_uniforms.caustics_color.value=water_item.caustics_color.value;
}
underwater_pass_uniforms.gamma.value=water_item.gamma.value;
underwater_pass_uniforms.saturation.value=water_item.saturation.value;
underwater_pass_uniforms.use_shadows.value=water_item.use_shadows;
underwater_pass_uniforms.sun_flare_color.value=water_item.underwater_sun_flare_color;
underwater_pass_uniforms.sun_flare_intensity.value=water_item.underwater_sun_flare_intensity;
underwater_pass_uniforms.use_sun_flare.value=water_item.use_underwater_sun_flare;


underwater_pass_uniforms.time.value=time;
underwater_ripples_pass.material.uniforms.time.value=time;
// WE TAKE THE DEPTH OF THE ENTIRE SCENE, NOT THE WATER
underwater_pass_uniforms.tDepth.value=composer.readBuffer.depthTexture;
underwater_pass_uniforms.cameraPosition.value=camera.position.clone();
underwater_pass_uniforms.position_from_depth_projection.value.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse).invert();


sun_clip_position_update();
underwater_pass_uniforms.sun_3d_position.value=sun_3d_position;


underwater_pass_uniforms.directionalShadowMap.value=[sun.shadow.map.textures[0]];
let dlight={
shadowIntensity:sun.shadow.intensity,
shadowBias:sun.shadow.bias,
shadowNormalBias:sun.shadow.normalBias,
shadowRadius:sun.shadow.radius,
shadowMapSize:sun.shadow.mapSize	
};
underwater_pass_uniforms.directionalLightShadows.value=[dlight];
underwater_pass_uniforms.directionalShadowMatrix.value=[sun.shadow.matrix];


underwater_pass.enabled=true;
underwater_ripples_pass.enabled=true;


}
else{
underwater_pass.enabled=false;	
underwater_ripples_pass.enabled=false;
}


// ____________________ EYE DROPS ____________________


let water_eyes_found=0;


for(let i in water){


if(i=="ocean"){ continue; }

	
let item=water[i];


let pos=camera.position;
let pos_x=pos.x;
let pos_y=pos.y;
let pos_z=pos.z;
if(pos_x>item.left && pos_x<item.right && pos_z<item.top && pos_z>item.bottom && pos_y<item.position.y-item.waves_amplitude && pos_y>item.height_bottom){
water_eyes_height=item.position.y-item.waves_amplitude;
water_eyes_found=1;
break;
}


}


if(!water_eyes_found && water["ocean"] && camera.position.y<water["ocean"].position.y-water["ocean"].waves_amplitude && camera.position.y>water["ocean"].height_bottom){
ray_hide_ocean_waterline.ray.origin.x=camera.position.x;
ray_hide_ocean_waterline.ray.origin.z=camera.position.z;
let go_ocean_waterline=true;
if(water["ocean"].hide!=null){
let hits=ray_hide_ocean_waterline.intersectObject(water["ocean"].hide);
if(hits.length>0){ go_ocean_waterline=false; }
}
if(go_ocean_waterline==true){
water_eyes_height=water["ocean"].position.y-water["ocean"].waves_amplitude;
water_eyes_found=1;
}
}


if(water_eyes_found && camera.position.y<water_eyes_height){
water_eyes_status=2;
water_eyes_intensity=0.2;
underwater_ripples_pass.enabled=true;
underwater_ripples_pass.material.uniforms.time.value=time;
underwater_ripples_pass.material.uniforms.eyes.value=true;
underwater_ripples_pass.material.uniforms.eyes_intensity.value=water_eyes_intensity;
}
if(water_eyes_status==2 && camera.position.y>water_eyes_height){
water_eyes_status=3;	
water_eyes_intensity=0.2;
underwater_ripples_pass.material.uniforms.eyes.value=true;
}
if(water_eyes_status==3){
water_eyes_intensity-=0.003;
underwater_ripples_pass.material.uniforms.eyes_intensity.value=water_eyes_intensity;	
underwater_ripples_pass.material.uniforms.time.value=time;
underwater_ripples_pass.enabled=true;
if(water_eyes_intensity<0){
water_eyes_status=1;
underwater_ripples_pass.material.uniforms.eyes.value=false;
}
}


// UPDATING MATERIALS


for(let i in water){
let item=mat[i].uniforms;
item.time.value=time;
item.position_from_depth_projection.value.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse).invert();
}
	

}


function water_lake_create(item,cells_size,name,name_2){


let start=performance.now();


let width=item.width;
let height=item.depth;
let grid_size=cells_size;


let position_x=item.position.x;
let position_y=item.position.y;
let position_z=item.position.z;


// FOR BASIC GEOMETRY ONLY, ROUND THE POSITION BY THE STEP SO THAT WATERLINE DOESN'T HAVE AN ARTIFACT WHERE A 1-PIXEL STRIP OF UNPAINTED WATER IS VISIBLE
if(!name_2 && grid_size!=0){
position_x=Math.floor(item.position.x/grid_size)*grid_size;
position_z=Math.floor(item.position.z/grid_size)*grid_size;
if(item.position.x!=position_x){
item.left=Number((position_x-width/2).toFixed(2));	
item.right=Number((position_x+width/2).toFixed(2));	
console.log("water "+name+" changed position x to "+position_x);
}
if(item.position.z!=position_z){
item.top=Number((position_z+height/2).toFixed(2));
item.bottom=Number((position_z-height/2).toFixed(2));		
console.log("water "+name+" changed position z to "+position_z);
}
}


// FOR THE REST OF THE LOD WE SET THE POSITION OF THE MAIN GEOMETRY
if(name_2){
position_x=mesh[name].matrixWorld.elements[12];
position_y=mesh[name].matrixWorld.elements[13];
position_z=mesh[name].matrixWorld.elements[14];
}


let width_segments=1;
let height_segments=1;


if(grid_size!=0){
width_segments=width*(1/grid_size);
height_segments=height*(1/grid_size);
}


let width_half=width/2;
let height_half=height/2;
let grid_x=Math.floor(width_segments);
let grid_y=Math.floor(height_segments);
let grid_x1=grid_x+1;
let grid_y1=grid_y+1;
let segment_width=width/grid_x;
let segment_height=height/grid_y;
let indices=[];
let vertices=[];


for(let iy=0;iy<grid_y1;iy++){
let y=iy*segment_height-height_half;
for(let ix=0;ix<grid_x1;ix++){
let x=ix*segment_width-width_half;
vertices.push(x,0,-y);
}
}


for(let iy=0;iy<grid_y;iy++){
for(let ix=0;ix<grid_x;ix++){
let a=ix+grid_x1*iy;
let b=ix+grid_x1*(iy+1);
let c=ix+1+grid_x1*(iy+1);
let d=ix+1+grid_x1*iy;
indices.push(a,d,b);
indices.push(b,d,c);
}
}


let geometry=new THREE.BufferGeometry();
geometry.setIndex(indices);
geometry.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));
geometry.boundingSphere=new THREE.Sphere();
geometry.boundingSphere.center.set(0,0,0);
geometry.boundingSphere.radius=Math.sqrt(width*width+height*height)/2;


let real_name=name;
if(name_2){ real_name=name_2; }


let object=mesh[real_name]=new THREE.Mesh(geometry,mat[name]);
object.matrixAutoUpdate=false;
object.updateMatrixWorld=function(){};
object.position.set(position_x,position_y,position_z);
object.matrixWorld.elements[12]=position_x;
object.matrixWorld.elements[13]=position_y;
object.matrixWorld.elements[14]=position_z;
scene.add(object);


if(water_stats){
console.log("["+((performance.now()-start)/1000).toFixed(6)+"s] "+real_name+" TRIANGLES: "+geometry.index.count/3);
}


}


function water_ocean_create(){
	
	
let start=performance.now();


let item=water["ocean"];


let cells_size=item.cells_size;
let cells_amount=item.cells_amount;
let lod=item.lod;
let last_lod_stretch=item.last_lod_stretch;
let grid_size=cells_size;


let indices=[];
let vertices=[];
let a,b,c,d,e,iy,ix,x,y;
let lod_max=lod.length;
let previous_indices=0;


let cells_size_half=cells_amount*cells_size/2;
let cells_amount_max=cells_amount+1;


for(iy=0;iy<cells_amount_max;iy++){
y=iy*cells_size-cells_size_half;
for(ix=0;ix<cells_amount_max;ix++){
x=ix*cells_size-cells_size_half;
vertices.push(x,0,-y);
}
}	


for(iy=0;iy<cells_amount;iy++){
for(ix=0;ix<cells_amount;ix++){
a=ix+cells_amount_max*iy;
b=ix+cells_amount_max*(iy+1);
c=ix+1+cells_amount_max*(iy+1);
d=ix+1+cells_amount_max*iy;
indices.push(a,d,b);
indices.push(b,d,c);
}
}


let left_column=[0];
let right_column=[cells_amount];
let new_left_column=[];
let new_right_column=[];


for(let n=0;n<cells_amount;n++){
left_column.push((cells_amount+1)*(n+1));
right_column.push(cells_amount+(cells_amount+1)*(n+1));
}


for(let n=0;n<lod_max;n++){


let lod_value=lod[n];


let go_top=previous_indices;
let go_left=previous_indices;


previous_indices=vertices.length/3;
let plus_indices=previous_indices;


let cells=cells_amount/2+2+lod_value*2;
let cells_max=cells_amount/2+2+lod_value*2+1;
let bound_left=-cells_size_half;
let bound_right=cells_size_half;
let bound_top=cells_size_half;
let bound_bottom=-cells_size_half;
cells_size*=2;
cells_size_half=cells*cells_size/2;


for(iy=0;iy<cells_max;iy++){
y=iy*cells_size-cells_size_half;
let real_y=y;
// STRETCHING FURTHER
if(n==1 && iy<lod[1]){ real_y-=(cells_size+last_lod_stretch)*(lod[1]-iy); }
if(n==1 && iy>cells_max-lod[1]-1){ real_y+=(cells_size+last_lod_stretch)*(iy-(cells_max-lod[1])+1); }
for(ix=0;ix<cells_max;ix++){
x=ix*cells_size-cells_size_half;
let real_x=x;
// STRETCHING FURTHER
if(n==1 && ix<lod[1]){ real_x-=(cells_size+last_lod_stretch)*(lod[1]-ix); }
if(n==1 && ix>cells_max-lod[1]-1){ real_x+=(cells_size+last_lod_stretch)*(ix-(cells_max-lod[1])+1); }
if(x<bound_left || x>bound_right || y>bound_top || y<bound_bottom){ vertices.push(real_x,0,-real_y); }
}
}


let index_top;
let index_left;
let index_right;
let index_add=lod_value*2+2;
let was_left=0;
let simple_ad=0;
let simple_bc=0;


new_left_column.push(plus_indices);
new_right_column.push(plus_indices+cells);


for(iy=0;iy<cells;iy++){
for(ix=0;ix<cells;ix++){
// LEFT TOP
if(iy==lod_value && ix==lod_value){
a=ix+cells_max*iy+plus_indices;
b=ix+cells_max*(iy+1)+plus_indices;
c=go_top;
d=a+1;
indices.push(a,c,b);
indices.push(c,a,d);
index_top=d;
index_left=b;
simple_bc++;
}
// TOP
else if(iy==lod_value && ix>lod_value && ix<cells-lod_value-1){
a=index_top;
b=go_top;
c=go_top+2;
d=a+1;
e=go_top+1;
indices.push(a,e,b);
indices.push(a,d,e);
indices.push(d,c,e);
go_top+=2;
index_top=d;
simple_bc++;
}
// RIGHT TOP
else if(iy==lod_value && ix==cells-lod_value-1){
a=index_top;
b=go_top;
c=ix+1+cells_max*(iy+1)+plus_indices-cells_amount/2-1;
d=a+1;
indices.push(a,d,b);
indices.push(b,d,c);
index_right=c;
}
// LEFT
else if(iy>lod_value && iy<cells-lod_value-1 && ix==lod_value){
a=index_left;
b=a+index_add;
c=left_column[was_left*2+2];
d=left_column[was_left*2];
e=left_column[was_left*2+1];
indices.push(a,d,e);
indices.push(a,e,b);
indices.push(b,e,c);
was_left++;
index_left=b;
simple_ad++;
simple_bc++;
if(iy==cells-lod_value-2){ go_left=c; }
}
// EMPTY
else if(iy>lod_value && iy<lod_value+cells_amount/2+1 && ix>lod_value && ix<cells-lod_value-1){
simple_ad++;
simple_bc++;
}
// RIGHT
else if(iy>lod_value && iy<cells-lod_value-1 && ix==cells-lod_value-1){
a=right_column[(was_left-1)*2];
e=right_column[(was_left-1)*2+1];
b=right_column[(was_left-1)*2+2];
c=index_right+index_add;
d=index_right;
indices.push(a,d,e);
indices.push(d,c,e);
indices.push(e,c,b);
index_right=c;
}
// LEFT BOTTOM
else if(iy==cells-lod_value-1 && ix==lod_value){
a=index_left;
b=a+index_add;
c=b+1;
d=go_left;
indices.push(a,d,b);
indices.push(b,d,c);
index_left=c;
simple_ad++;
}
// BOTTOM
else if(iy==cells-lod_value-1 && ix>lod_value && ix<cells-lod_value-1){
a=go_left;
b=index_left;
c=b+1;
d=a+2;
e=a+1;
indices.push(a,e,b);
indices.push(b,e,c);
indices.push(c,e,d);
index_left=c;
go_left+=2;
simple_ad++;
}
// RIGHT BOTTOM
else if(iy==cells-lod_value-1 && ix==cells-lod_value-1){
a=go_left;
b=index_left;
c=b+1;
d=index_right;
indices.push(a,c,b);
indices.push(a,d,c);
}
// SIMPLE
else{
a=ix+cells_max*iy+plus_indices-simple_ad;
b=ix+cells_max*(iy+1)+plus_indices-simple_bc;
c=ix+1+cells_max*(iy+1)+plus_indices-simple_bc;
d=ix+1+cells_max*iy+plus_indices-simple_ad;
indices.push(a,d,b);
indices.push(b,d,c);
if(ix==0){ new_left_column.push(b); }
if(ix==cells-1){ new_right_column.push(c); }
}
}
}
cells_amount=cells;
left_column=new_left_column;
new_left_column=[];
right_column=new_right_column;
new_right_column=[];
}


let geometry=new THREE.BufferGeometry();
geometry.setIndex(indices);
geometry.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));
geometry.boundingSphere=new THREE.Sphere();
geometry.boundingSphere.center.set(0,0,0);
geometry.boundingSphere.radius=10000;


mesh["ocean"]=new THREE.Mesh(geometry,mat["ocean"]);
mesh["ocean"].frustumCulled=false;
mesh["ocean"].matrixAutoUpdate=false;
mesh["ocean"].updateMatrixWorld=function(){};
mesh["ocean"].matrixWorld.elements[13]=item.position.y;
scene.add(mesh["ocean"]);


if(water_stats){
console.log("["+((performance.now()-start)/1000).toFixed(6)+"s] OCEAN TRIANGLES: "+geometry.index.count/3);
}
	
	
}


function waterline_create(name){
	

let start=performance.now();


let min_size=1; // MINIMUM SIZE


let item=water[name];	
let cells_size=item.cells_size;
if(name!="ocean"){ cells_size=item.cells_size[0][0]; }


// CALCULATE THE SIZE OF THE GEOMETRY
let size=item.waves_d_max*2; // SINCE THE WAVE SHIFT IN BOTH SIDES, WE MULTIPLY THE MAXIMUM SHIFT BY 2	
size+=item.waterline_move*2; // CONSIDER THE OFFSET STEP
size+=0.1; // ERROR JUST IN CASE
size=Math.max(min_size,size); // SELECT THE MAXIMUM VALUE
let cells_amount=Math.ceil(size/cells_size);
if(cells_amount%2){ cells_amount++; } // MAKE THE NUMBER OF CELLS EVEN


if(!item.use_waves){
cells_amount=1;
cells_size=min_size;
}


let indices=[];
let vertices=[];
let a,b,c,d,e,iy,ix,x,y;
let previous_indices=0;


let cells_size_half=cells_amount*cells_size/2;
let cells_amount_max=cells_amount+1;


for(iy=0;iy<cells_amount_max;iy++){
y=iy*cells_size-cells_size_half;
for(ix=0;ix<cells_amount_max;ix++){
x=ix*cells_size-cells_size_half;
vertices.push(x,0,-y);
}
}	


for(iy=0;iy<cells_amount;iy++){
for(ix=0;ix<cells_amount;ix++){
a=ix+cells_amount_max*iy;
b=ix+cells_amount_max*(iy+1);
c=ix+1+cells_amount_max*(iy+1);
d=ix+1+cells_amount_max*iy;
indices.push(a,d,b);
indices.push(b,d,c);
}
}


let last_index=vertices.length/3-1;
vertices.push(0,-500,0);
let center=vertices.length/3-1;


for(iy=0;iy<cells_amount;iy++){
a=iy;
b=a+1;
indices.push(a,center,b);
c=iy+last_index-cells_amount;
d=c+1;
indices.push(d,center,c);
}


for(ix=0;ix<cells_amount;ix++){
a=ix*cells_amount_max;
b=a+cells_amount_max;
indices.push(b,center,a);
c=a+cells_amount;
d=b+cells_amount;
indices.push(c,center,d);
}


for(ix=0;ix<cells_amount;ix++){
a=ix;
b=a+1;
indices.push(a,center,b);
c=iy+last_index-cells_amount;
d=c+1;
indices.push(d,center,c);
}


let geometry=new THREE.BufferGeometry();
geometry.setIndex(indices);
geometry.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));
geometry.boundingSphere=new THREE.Sphere();
geometry.boundingSphere.center.set(0,0,0);
geometry.boundingSphere.radius=-1;


name="waterline_"+name;


mat[name]=new THREE.ShaderMaterial({
uniforms:{
time:{value:0},
move:{value:[0,0,0]},
gerstner_waves:{value:item.gerstner_waves},	
gerstner_waves_speed:item.gerstner_waves_speed,	
},
defines:{
use_waves:item.use_waves,
waves_amount:item.gerstner_waves.length
},
vertexShader:vs["waterline"],
fragmentShader:fs["waterline"],
wireframe:water_debug,
side:THREE.DoubleSide
});


let object=mesh[name]=new THREE.Mesh(geometry,mat[name]);
object.frustumCulled=false;
object.matrixAutoUpdate=false;
object.updateMatrixWorld=function(){};
object.matrixWorld.elements[13]=item.position.y;
if(water_debug){ scene.add(object); }


if(water_stats){
console.log("["+((performance.now()-start)/1000).toFixed(6)+"s] "+name+" WATERLINE TRIANGLES: "+geometry.index.count/3);
}


}