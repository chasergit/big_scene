function loop(){


if(mat["terrain"].uniforms!==undefined && mat["terrain"].uniforms.shadowGroundMap!==undefined){
// ЧТОБЫ НЕ БЫЛО СКАЧКА FPS ПРИ ПЕРВОМ ПЕРЕХОДЕ ПО СЕКТОРУ
if(shadow_ground_2_updated!=0){
shadow_ground_2_updated++;
}
if(shadow_ground_2_updated==60){
shadow_ground_2_updated=0;

tex["shadow_ground_2"].needsUpdate=true;
}
}


let total_frame_time_start=performance.now();
let loop_js_time=performance.now();


requestAnimationFrame(loop); // СТАВИМ В НАЧАЛО ФУНКЦИИ, ЧТОБЫ СРАБОТАЛО ДАЖЕ ПРИ ОШИБКЕ


stats.update();


delta=clock.getDelta();


let max_mixers=mixers.length;


for(let n=0;n<max_mixers;n++){
mixers[n].update(delta);
}


time=Date.now()-start_time;


p_section_100_x=Math.floor(camera.position.x/100);
p_section_100_z=Math.floor(camera.position.z/100);

let bbb=0;
if(p_section_100_x!=section_100_x || p_section_100_z!=section_100_z){ bbb=1; instances_section_pass(); }


// СОЗДАЁМ ТЕНИ ПО СЕКТОРАМ
//shadow_ground_f[shadow_ground_m]();


let mini=2; // ЕСЛИ НАДО УМЕНЬШИТЬ СЕКТОР, ЧТОБЫ ЧАЩЕ РИСОВАЛО ТЕНИ И ОНИ НЕ РАСТЯГИВАЛИСЬ ВДАЛИ (АРТЕФАКТ), ТО СТАВИМ 2
let shadow_cell_size_1=62.5/mini;
let shadow_cell_size_2=shadow_cell_size_1/mini;


shadow_ground_nx=Math.floor(camera.position.x/shadow_cell_size_1);
shadow_ground_nz=Math.floor(camera.position.z/shadow_cell_size_1);


let shadow_ground_w=0;


if(camera.position.x>shadow_ground_px*shadow_cell_size_1+shadow_cell_size_1+shadow_cell_size_2){ shadow_ground_w=1; }
if(camera.position.z<shadow_ground_pz*shadow_cell_size_1-shadow_cell_size_2){ shadow_ground_w=2; }
if(camera.position.x<shadow_ground_px*shadow_cell_size_1-shadow_cell_size_1){ shadow_ground_w=3; }
if(camera.position.z>shadow_ground_pz*shadow_cell_size_1+shadow_cell_size_1){ shadow_ground_w=4; }
if(shadow_ground_w>0 || bbb==1){


document.getElementById("shadow_ground_text_1").innerHTML=performance.now()+" "+shadow_ground_w;


shadow_ground_px=shadow_ground_nx;
shadow_ground_pz=shadow_ground_nz;


mesh["pseudo"].geometry.attributes.position=new THREE.BufferAttribute();
mesh["pseudo"].geometry.attributes.position.copy(mesh["instance_grass_long"].geometry.attributes.offset);
mesh["pseudo"].geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
mesh["pseudo"].geometry.attributes.position.needsUpdate=true;


/*
shadow_ground_nx=Math.floor(camera.position.x/shadow_cell_size_1);
shadow_ground_nz=Math.floor(camera.position.z/shadow_cell_size_1);
mat["terrain"].uniforms.shadowGroundOffset.value[0]=-shadow_ground_nx*(0.125/mini)+0.5;
mat["terrain"].uniforms.shadowGroundOffset.value[1]=-shadow_ground_nz*(0.125/mini)+0.375;
mat["pseudo"].uniforms.offset.value[0]=500.0*mat["terrain"].uniforms.shadowGroundOffset.value[0];
mat["pseudo"].uniforms.offset.value[1]=500.0*(-shadow_ground_nz*(0.125/mini)-0.625);
*/

renderer.setRenderTarget(rtt_shadow);
renderer.clear();
renderer.render(mesh["pseudo"],camera);
renderer.render(mesh["pseudo2"],camera);
renderer.setRenderTarget(null);
//mesh["home001"].material=new THREE.MeshBasicMaterial({map:rtt_shadow.texture});


//mat["terrain"].uniforms.shadowGroundMap.value=rtt_shadow.texture;


}


document.getElementById("my_pos_x").innerHTML=player.position.x.toFixed(2);
document.getElementById("my_pos_y").innerHTML=player.position.y.toFixed(2);
document.getElementById("my_pos_z").innerHTML=player.position.z.toFixed(2);


player.velocity.y-=9.8*2*delta;


go_half=0;


if(go_left==1){ go_half++; }
if(go_right==1){ go_half++; }
if(go_up==1){ go_half++; }
if(go_down==1){ go_half++; }


if(go_half>1){ go_half=0.68; }


let dd=delta/0.017;


if(go_left==1){ player.position.x-=go_lrc*go_half*dd; player.position.z+=go_lrs*go_half*dd; }
if(go_right==1){ player.position.x+=go_lrc*go_half*dd; player.position.z-=go_lrs*go_half*dd; }
//if(go_up==1){ player.position.x+=go_udc*go_half*dd; player.position.z-=go_uds*go_half*dd; }
//if(go_down==1){  player.position.x-=go_udc*go_half*dd; player.position.z+=go_uds*go_half*dd; }


//220325 ЭТО ДЛЯ ПОЛЁТА

if(go_up==1){
player.position.x+=player.direction.x*player.speed;
player.position.y+=player.direction.y*player.speed;
player.position.z+=player.direction.z*player.speed;
}
if(go_down==1){
player.position.x-=player.direction.x*player.speed;
player.position.y-=player.direction.y*player.speed;
player.position.z-=player.direction.z*player.speed;
}


if(go_up || go_down || go_left || go_right){
hand_go_time+=1;
hand_go_intensity+=0.11;
}
else{
hand_go_time+=1*hand_go_intensity;
}

hand_go_intensity-=0.05;
hand_go_intensity=Math.min(Math.max(hand_go_intensity,0),1);
hand_sway_intensity-=0.05;
hand_sway_intensity=Math.min(Math.max(hand_sway_intensity,0),1);


// С ЛАНДШАФТОМ


/*
ray_b={x:player.position.x,y:player.position.y,z:player.position.z};
ray_e={x:player.position.x,y:player.position.y-2,z:player.position.z};
for(let n=0;n<100;n++){
ray_st([mesh["terrain"].geometry.attributes,mesh["Box002"].geometry.attributes]);
}


if(ray_i.hit==1){
player.position.x=ray_i.point.x;
player.position.y=ray_i.point.y+2;
player.position.z=ray_i.point.z;
jump_can=1;
jump_n=0.16;
}
*/


// С ОБЪЕКТАМИ


/*
ray_b={x:player.position.x,y:player.position.y,z:player.position.z};
ray_e={x:player.position.x,y:player.position.y,z:player.position.z};
for(let n=0;n<1;n++){
walk([mesh["terrain"].geometry.attributes,mesh["Box002"].geometry.attributes,mesh["home001"].geometry.attributes,mesh["home"].geometry.attributes,mesh["box"].geometry.attributes,mesh["Cylinder_014"].geometry.attributes,mesh["Cylinder"].geometry.attributes,mesh["pinetree001"].geometry.attributes]);
}


if(ray_i.hit==1){
let inter_ang=Math.atan2(player.position.z-ray_i.point.z,player.position.x-ray_i.point.x)/radian;
player.position.x=ray_i.point.x+Math.cos(inter_ang*radian)*0.2;
player.position.z=ray_i.point.z+Math.sin(inter_ang*radian)*0.2;
jump_can=1;
jump_n=0.16;
}
*/


let raycast_ms=performance.now();


/*
directionX=0;
directionY=-1;
directionZ=0;
originX=player.position.x;
originY=player.position.y;
originZ=player.position.z;
*/


direction.x=0;
direction.y=-1;
direction.z=0;


if(gravity==1){
player.position.y+=player.velocity.y*delta;
}

let result=0;
for(let n=0;n<1;n++){
result=intersection_ray_triangle(player.position,direction,1.7,[mesh["terrain"].geometry.attributes]);
//result=intersection_ray_triangle(player.position,{x:player.position.x,y:player.position.y-1.7,z:player.position.z},Infinity,[mesh["terrain"].geometry.attributes]);
}


document.getElementById("raycast").innerHTML=(performance.now()-raycast_ms).toFixed(3)+"ms";


if(result!=0){
player.position.x+=direction.x*result;
player.position.y+=direction.y*result+1.7;
player.position.z+=direction.z*result;
jump_can=1;
player.velocity.y=0;
}
else{
// ЧТОБЫ НЕ СМОГ СДЕЛАТЬ ПРЫЖОК В ВОЗДУХЕ ВО ВРЕМЯ ПАДЕНИЯ
jump_can=0;
}

/*
if(result!=0){
player.position.x=result.x;
player.position.y=result.y+1.7;
player.position.z=result.z;
jump_can=1;
jump_n=0.16;
}
*/


/*
ray_floor.ray.origin.copy(player.position);
ray_floor.ray.origin.y-=1.3;
let hits=ray_floor.intersectObjects([mesh["terrain"]]);
if(hits.length>0 && hits[0].face.normal.y>0 && hits[0].distance<=0.27){
player.position.y=hits[0].point.y+1.7;
jump_can=1;
jump_n=0.16;
}
*/


camera.position.set(player.position.x,player.position.y,player.position.z);


mesh["mbox"].position.x=30;
mesh["mbox"].position.y=1;
mesh["mbox"].position.z=70


mat["sprite"].uniforms.cameraDirection.value=player.direction;


mat["sprite"].uniforms.time.value=time;
mat["sprite"].uniforms.cameraAngle.value=[-player.angle.z*radian,-player.angle.y*radian];


let sprites_ms_1=performance.now();
particles_update();
let sprites_ms_2=(performance.now()-sprites_ms_1).toFixed(3);
document.getElementById("sprites").innerHTML="["+particles.length+"] "+sprites_ms_2+"ms";


movePoint();


let started=performance.now();
result=closest_point(camera.position,5,[pclose_g_1]);
let end=(performance.now()-started).toFixed(3);
if(end>cmax){ cmax=end; }
document.getElementById("closest_point").innerHTML=end+" "+cmax;


if(result!=0){


mesh["green_cone"].position.set(0,0,0);
mesh["green_cone"].lookAt(result.nx,result.ny,result.nz);
mesh["green_cone"].position.set(result.x,result.y,result.z);


if(result.t==0 && result.d<0.3){
/*
let cyl_d=Math.sqrt(Math.pow(player.position.x-result.x,2)+Math.pow(player.position.z-result.z,2));
let cyl_a=Math.atan2(player.position.z-result.z,player.position.x-result.x);
player.position.x=result.x+Math.cos(cyl_a)*0.27;
player.position.z=result.z+Math.sin(cyl_a)*0.27;
*/


}


if(result.t==1 && result.d<0.2 && result.ny==0 && (result.nx!=0 || result.nz!=0)){
/*
let inter_ang=Math.atan2(player.position.z-result.z,player.position.x-result.x)/radian;
player.position.x=result.x+Math.cos(inter_ang*radian)*0.2;
player.position.z=result.z+Math.sin(inter_ang*radian)*0.2;
*/
//player.position.x=result.x+result.nx*0.66+(player.direction.x-result.nx)*(0.06);
//player.position.z=result.z+result.nz*0.66+(player.direction.z-result.nz)*(0.06);
}


}


result=intersection_ray_triangle(player.position,player.direction,Infinity,[mesh["terrain"].geometry.attributes,mesh["home"].geometry.attributes,mesh["home001"].geometry.attributes,mesh["Box002"].geometry.attributes,mesh["wall_001"].geometry.attributes,mesh["wall_002"].geometry.attributes,mesh["wall_003"].geometry.attributes]);


if(result!=0){
mesh["object_i_ray_triangle"].position.set(player.position.x+player.direction.x*result,player.position.y+player.direction.y*result,player.position.z+player.direction.z*result);
}


started=performance.now();
result=intersection_ray_sphere(player.position,player.direction,50,[mesh["object_i_ray_sphere_1"],mesh["object_i_ray_sphere_2"]]);
end=(performance.now()-started).toFixed(3);
if(result==0){ document.getElementById("status_i_ray_sphere").innerHTML="no"; }
else{
mesh["status_i_ray_sphere"].position.set(player.position.x+player.direction.x*result,player.position.y+player.direction.y*result,player.position.z+player.direction.z*result);
document.getElementById("status_i_ray_sphere").innerHTML="Distance="+result+"<br>x:"+(player.position.x+player.direction.x*result)+"<br>y:"+(player.position.y+player.direction.y*result)+"<br>z:"+(player.position.z+player.direction.z*result)+"<br>time: "+end+"ms";
}


started=performance.now();
result=intersection_ray_AABB(player.position,player.direction,50,[mesh["home"],mesh["home001"]]);
end=(performance.now()-started).toFixed(3);
if(result==0){ document.getElementById("status_i_ray_AABB").innerHTML="no"; }
else{
mesh["status_i_ray_AABB"].position.set(player.position.x+player.direction.x*result,player.position.y+player.direction.y*result,player.position.z+player.direction.z*result);
document.getElementById("status_i_ray_AABB").innerHTML="Distance="+result+"<br>x:"+(player.position.x+player.direction.x*result)+"<br>y:"+(player.position.y+player.direction.y*result)+"<br>z:"+(player.position.z+player.direction.z*result)+"<br>time: "+end+"ms";
}


rzh();


mesh["big_box_8"].rotation.z=-time*0.002;


mesh["big_box_6"].position.y=-1+Math.sin(time*0.004)*0.02;
mesh["big_box_6"].rotation.x=Math.sin(time*0.004)*0.01;
mesh["big_box_6"].rotation.z=Math.sin(time*0.003)*0.014;


mesh["jetski"].position.y=-1.3+Math.sin(time*0.004)*0.02;
mesh["jetski"].rotation.x=-1.57+Math.sin(time*0.004)*0.01;
mesh["jetski"].rotation.z=-2+Math.sin(time*0.003)*0.014;


mesh["gull_fly_1"].position.x=40+Math.sin(time*0.0005)*20;
mesh["gull_fly_1"].position.y=10+Math.sin(time*0.0002)*10;
mesh["gull_fly_1"].position.z=130+Math.cos(time*0.0005)*20;
mesh["gull_fly_1"].lookAt(40+Math.sin((time+1)*0.0005)*20,10+Math.sin((time+1)*0.0002)*10,130+Math.cos((time+1)*0.0005)*20);


mesh["gull_fly_2"].position.x=50+Math.sin(time*0.0004)*20;
mesh["gull_fly_2"].position.y=15+Math.sin(time*0.0002)*15;
mesh["gull_fly_2"].position.z=150+Math.cos(time*0.0004)*30;
mesh["gull_fly_2"].lookAt(50+Math.sin((time+1)*0.0004)*20,15+Math.sin((time+1)*0.0002)*15,150+Math.cos((time+1)*0.0004)*30);


document.getElementById("loop_js_time").innerHTML=(performance.now()-loop_js_time).toFixed(4);


updateWeaponSway();


particles_other_a[26].offset[2]=1.5+Math.sin(time*0.002)*15;
particles_other_a[29].offset[2]=6+Math.sin(time*0.01)*15;


let loop_render_time=performance.now();

/*
renderer.info.reset();
renderer.clear(); // ОЧИЩАЕМ ПОЛНОСТЬЮ
renderer.render(scene,camera); // ОСНОВНАЯ СЦЕНА
renderer_stats_update(0);
renderer.clearDepth(); // УБИРАЕМ ГЛУБИНУ ОТ ПРОШЛОЙ СЦЕНЫ, ТО ЕСТЬ ЛИШНЕЕ
renderer.render(scene_hud,camera_hud); // HUD СЦЕНА
renderer_stats_update(1);
*/


sun_position_update();
mesh["weapon"].updateMatrixWorld();


gpuPanel_shader_name="";


if(gpuPanel_shader_name==""){ gpuPanel.startQuery(); }


water_render();
renderer_stats_update(0);
renderer.info.reset();


/*
renderer.info.reset();
renderer.clear(); // ОЧИЩАЕМ ПОЛНОСТЬЮ
renderer.render(scene,camera); // ОСНОВНАЯ СЦЕНА
renderer_stats_update(0);
renderer.clearDepth(); // УБИРАЕМ ГЛУБИНУ ОТ ПРОШЛОЙ СЦЕНЫ, ТО ЕСТЬ ЛИШНЕЕ
renderer.render(scene_hud,camera_hud); // HUD СЦЕНА
renderer_stats_update(1);
*/


composer.render();
renderer_stats_update(1);
renderer.info.reset();
renderer.clearDepth(); // УБИРАЕМ ГЛУБИНУ ОТ ПРОШЛОЙ СЦЕНЫ, ТО ЕСТЬ ЛИШНЕЕ
renderer.render(scene_hud,camera_hud); // HUD СЦЕНА
//renderer.render(mesh["overlay_damage_blood"],camera_hud); // HUD СЦЕНА
renderer_stats_update(2);
renderer.info.reset();


if(gpuPanel_shader_name==""){ gpuPanel.endQuery(); }


let loop_render_time_end=String(performance.now()-loop_render_time).replace(/(\..{4}).*/,'$1');
if(loop_render_time_end>=loop_render_time_max){ loop_render_time_max=loop_render_time_end; }
if(loop_render_time_end<loop_render_time_min){ loop_render_time_min=loop_render_time_end; }
if(loop_render_time_elapsed>5){ loop_render_time_elapsed=0; loop_render_time_max=loop_render_time_end; loop_render_time_min=loop_render_time_end; }
loop_render_time_elapsed+=delta;
document.getElementById("loop_render").innerHTML="now "+loop_render_time_end+"<br> max "+loop_render_time_max+"<br> min "+loop_render_time_min;


let total_frame_time_end=Number((performance.now()-total_frame_time_start).toFixed(3));
if(total_frame_time_end>=total_frame_time_max){ total_frame_time_max=total_frame_time_end; }
if(total_frame_time_elapsed>0.5){ total_frame_time_elapsed=0; total_frame_time_max=total_frame_time_end; total_frame_time_min=total_frame_time_end; }
total_frame_time_elapsed+=delta;
document.getElementById("total_frame").innerHTML="now "+total_frame_time_end+"<br>  max "+total_frame_time_max+"<br>  min "+total_frame_time_min;


}

