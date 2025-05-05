

function instances_section_pass(){


let started_1=performance.now();
let started_2=performance.now();


/*
for(let i=0;i<25;i++){
let cell_name=(section_100_x+ways_25[i][0])+"_"+(section_100_z+ways_25[i][1]);
if(section_100_objects[cell_name]!=undefined){
let max_section_100_objects=section_100_objects[cell_name].length;
for(let n=0;n<max_section_100_objects;n++){
scene.remove(mesh[section_100_objects[cell_name][n]]);
}
}
}
*/


let count=0;


for(let i=0;i<25;i++){


let cell_name=(p_section_100_x+ways_25[i][0])+"_"+(p_section_100_z+ways_25[i][1]);


if(section_100_objects[cell_name]==undefined){ continue; }


let max_objects=section_100_objects[cell_name].length;


for(let n=0;n<max_objects;n++){


let item=mesh[section_100_objects[cell_name][n]].geometry.attributes;


if(item.scale==undefined){ continue; }
count+=item.scale.array.length;


}


}


let scale=new Float32Array(count);
let offset=new Float32Array(count*3);
let orientation=new Float32Array(count*4);
let color=new Float32Array(count*3);


let one_c=0;
let three_c=0;
let four_c=0;


for(let i=0;i<25;i++){


let cell_name=(p_section_100_x+ways_25[i][0])+"_"+(p_section_100_z+ways_25[i][1]);


if(section_100_objects[cell_name]==undefined){ continue; }


let max_objects=section_100_objects[cell_name].length;


for(let n=0;n<max_objects;n++){


let item=mesh[section_100_objects[cell_name][n]].geometry.attributes;


if(item.scale==undefined){ continue; }


let i_scale=item.scale.array;
let i_offset=item.offset.array;
let i_color=item.color.array;
let i_orientation=item.orientation.array;


let max_one_elements=i_scale.length;


for(let j=0;j<max_one_elements;j++){


scale[j+one_c]=i_scale[j];


let j_zero=j*3;
let p=j_zero+three_c;
let p_one=p+1;
let p_two=p+2;
let j_one=j_zero+1;
let j_two=j_zero+2;
offset[p]=i_offset[j_zero];
offset[p_one]=i_offset[j_one];
offset[p_two]=i_offset[j_two];
color[p]=i_color[j_zero];
color[p_one]=i_color[j_one];
color[p_two]=i_color[j_two];


j_zero=j*4;
p=j_zero+four_c;
orientation[p]=i_orientation[j_zero];
orientation[p+1]=i_orientation[j_zero+1];
orientation[p+2]=i_orientation[j_zero+2];
orientation[p+3]=i_orientation[j_zero+3];
}


one_c+=max_one_elements;
three_c=one_c*3;
four_c=one_c*4;


//scene.add(mesh[section_100_objects[cell_name][n]]);
//mesh["instance_grass_long"].geometry.attributes.offset.
}
}


started_2=(performance.now()-started_2).toFixed(3);


let started_3=performance.now();


let item=mesh["instance_grass_long"].geometry.attributes;
item.scale=new THREE.InstancedBufferAttribute(scale,1).setUsage(THREE.DynamicDrawUsage);
item.offset=new THREE.InstancedBufferAttribute(offset,3).setUsage(THREE.DynamicDrawUsage);
item.orientation=new THREE.InstancedBufferAttribute(orientation,4).setUsage(THREE.DynamicDrawUsage);
item.color=new THREE.InstancedBufferAttribute(color,3).setUsage(THREE.DynamicDrawUsage);


mesh["instance_grass_long"].geometry._maxInstanceCount=count;


section_100_x=p_section_100_x;
section_100_z=p_section_100_z;
document.getElementById("section_100_x").innerHTML=section_100_x;
document.getElementById("section_100_z").innerHTML=section_100_z;


document.getElementById("section_pass").innerHTML="SECTION PASS TOTAL: "+(performance.now()-started_1).toFixed(3)+" FIRST: "+started_2+" SECOND: "+(performance.now()-started_3).toFixed(3)+" GRASS: "+count;


}
