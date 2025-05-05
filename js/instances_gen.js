function instance_set(){


dummy["instance"]=new THREE.Object3D();


for(let i=0;i<50;i++){
for(let j=0;j<10;j++){

instance_gen(-50+i*100,0,-50+j*100,100,50,1.50,"grass","grass_long","grass_long_1");
//instance_gen(-2500+i*100,0,-500+j*100,100,5000,1.50,"grass","grass_long","grass_long_1");


//instance_gen(-50+i*100,0,-50+j*100,100,2000,1.50,"grass","grass_long","grass_long_1");
}
}
//instance_gen(50,0,0,100,400,1.50,"grass","grass_long","grass_long_1");
//instance_gen(50,0,50,100,400,1.50,"grass","grass_long","grass_long_1");


}


let total_grass=0;


function instance_gen(ix,iy,iz,is,iamount,iwh,ishader,imesh,itex){


let ray_instance=new THREE.Raycaster();
ray_instance.ray.direction.set(0,-1,0);


let bufferGeometry=mesh[imesh].geometry;
let geometry=new THREE.InstancedBufferGeometry();
geometry.attributes.position=bufferGeometry.attributes.position;
geometry.attributes.uv=bufferGeometry.attributes.uv;
geometry.attributes.normal=bufferGeometry.attributes.normal;


let scale=[];
let offset=[];
let orientation=[];
let color=[];
let x,y,z;
let average={x:0,y:0,z:0};
let i_real_amount=0;


for(let i=0;i<iamount;i++){
x=Number(((Math.random()-0.5)*is+ix).toFixed(2));
//x=(i%3)*5+20;
y=iy+0;
z=Number(((Math.random()-0.5)*is+iz).toFixed(2));
//z=-i*3+10;
let normal=new THREE.Vector3(0,0,1);

//x=22;
//z=-11;




ray_instance.ray.origin.set(x,300,z);
let ray_instance_hits=ray_instance.intersectObjects([mesh["terrain"]]);


if(ray_instance_hits.length==0 || ray_instance_hits[0].face.normal.y<=0){
continue;
}


let shadow_ground_x=Math.floor(x*shadow_ground_pixel);
let shadow_ground_z=Math.floor(z*shadow_ground_pixel);


let ins_cell=Math.floor(x/62.5)+"_"+Math.floor(z/62.5);
if(shadow_ground_cell[ins_cell]==undefined){ shadow_ground_cell[ins_cell]=[]; }
//shadow_ground_cell[ins_cell].push(shadow_ground_x-6,shadow_ground_z-6,13);
shadow_ground_cell[ins_cell].push(shadow_ground_x,shadow_ground_z,1);


i_real_amount++;
total_grass++;


y=ray_instance_hits[0].point.y;
normal=ray_instance_hits[0].face.normal;
//normal=new THREE.Vector3().crossVectors(normal,new THREE.Vector3(0,0,1));
//normal.normalize();


dummy["instance"].lookAt(normal);
//dummy["instance"].lookAt(0,1,0);
dummy["instance"].rotateX(1.57);
dummy["instance"].rotateY(Math.random()*6.28);


offset.push(x,y,z);
//orientation.push(0.4,Math.random()*2-1,0,1);
orientation.push(dummy["instance"].quaternion.x,dummy["instance"].quaternion.y,dummy["instance"].quaternion.z,dummy["instance"].quaternion.w);
scale.push(Math.floor(Math.random()*10)/15+0.5);
//scale.push(Math.floor(Math.random()*20)+30);
//scale.push(1);


let cc_rand=Math.random()/5+0.9;
let cc_r=0.42*cc_rand;
let cc_g=0.47*cc_rand;
let cc_b=0.12*cc_rand;


cc_r=1+Math.random()/5-0.1;
cc_g=1+Math.random()/5-0.1;
cc_b=0.12+Math.random()/10-0.1;


color.push(cc_r,cc_g,cc_b);


average.x+=x;
average.y+=y;
average.z+=z;
}


let i_center={x:Math.floor(average.x/i_real_amount),y:Math.floor(average.y/i_real_amount),z:Math.floor(average.z/i_real_amount)};


let i_radius=0;
for(let i=0;i<i_real_amount;i++){
let i_dist_to_center=Math.sqrt(Math.pow((offset[i*3]-i_center.x),2)+Math.pow((offset[i*3+1]-i_center.y),2)+Math.pow((offset[i*3+2]-i_center.z),2));
if(i_dist_to_center>i_radius){ i_radius=i_dist_to_center; }
}
i_radius=Math.ceil(i_radius);


geometry.setAttribute('offset',new THREE.InstancedBufferAttribute(new Float32Array(offset),3));
geometry.setAttribute('orientation',new THREE.InstancedBufferAttribute(new Float32Array(orientation),4));
geometry.setAttribute('scale',new THREE.InstancedBufferAttribute(new Float32Array(scale),1));
geometry.setAttribute('color',new THREE.InstancedBufferAttribute(new Float32Array(color),3));


let material;


if(ishader=="grass"){
material=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex[itex]},
time:{value:0},
sun_direction:{value:sun_direction},
},
vertexShader:vs["grass"],
fragmentShader:fs["grass"],
side:THREE.DoubleSide,
transparent:true,
});
}


if(ishader=="tree_basic"){
material=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex[itex]},
pos:{value:{x:i_center.x,y:i_center.y,z:i_center.z}},
sun_direction:{value:sun_direction},
},
vertexShader:vs["tree_basic"],
fragmentShader:fs["tree_basic"],
});
}


if(ishader=="tree_sprite"){
material=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex[itex]},
pos:{value:{x:i_center.x,y:i_center.y,z:i_center.z}},
sun_direction:{value:sun_direction},
},
vertexShader:vs["tree_sprite"],
fragmentShader:fs["tree_sprite"],
});
}


let ins_cell=Math.floor(ix/100)+"_"+Math.floor(iz/100);
if(section_100_objects[ins_cell]==undefined){ section_100_objects[ins_cell]=[]; }


let num=Math.floor((section_100_objects[ins_cell].length+1)/2)+1;


let instance_name="instance_"+itex+"_"+ins_cell+"_"+num;
mesh[instance_name]=new THREE.Mesh(geometry,material);
mesh[instance_name].renderOrder=-2; // ЧТОБЫ ЧАСТИЦЫ ПРАВИЛЬНО ОТОБРАЖАЛИСЬ СКВОЗЬ И ПЕРЕД ЭТИМ ПРОЗРАЧНЫМ ОБЪЕКТОМ. Т.К. У ОЗЕРА -1, ТО СТАВИМ -2
mesh[instance_name].geometry.boundingSphere=new THREE.Sphere({x:0,y:0,z:0},i_radius+iwh);
mesh[instance_name].matrixAutoUpdate=false;
mesh[instance_name].updateMatrixWorld=function(){};
//scene.add(mesh[instance_name]);


section_100_objects[ins_cell].push(instance_name);

/*
mesh["instance_sphere_"+ins_cell+"_"+num]=new THREE.Mesh(new THREE.SphereBufferGeometry(i_radius+iwh,9,9),new THREE.MeshBasicMaterial({color:0xffff00,wireframe:true}));
mesh["instance_sphere_"+ins_cell+"_"+num].position.set(i_center.x,i_center.y,i_center.z);
mesh["instance_sphere_"+ins_cell+"_"+num].updateMatrixWorld();
mesh["instance_sphere_"+ins_cell+"_"+num].matrixAutoUpdate=false;
mesh[instance_name].updateMatrixWorld=function(){};
scene.add(mesh["instance_sphere_"+ins_cell+"_"+num]);
section_100_objects[ins_cell].push("instance_sphere_"+ins_cell+"_"+num);
*/

}
