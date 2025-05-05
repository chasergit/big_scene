let uv=[];


class lightMap{


static push_uv(value){
uv.push(value);
}


static set_uv(mesh){


let max=uv.length;
for(let n=0;n<max;n++){
mesh[uv[n][0]].geometry.setAttribute("uv2",uv[n][2]);
}


}


static set_tex(mesh,tex){


while(uv.length){


let object=mesh[uv[0][0]];


if(object.material.length==undefined){


let pre_mat=object.material.clone();
let u_map;


if(pre_mat.type=="ShaderMaterial"){

if(pre_mat.uniforms.map!=undefined){ u_map=object.material.uniforms.map; }
}


object.material.dispose(); 
object.material=pre_mat;


if(pre_mat.type!="ShaderMaterial"){ object.material.lightMap=tex[uv[0][1]]; }
else{
if(u_map!=undefined){ object.material.uniforms.map=u_map; }
object.material.uniforms.lightMap={};
object.material.uniforms.lightMap.value=tex[uv[0][1]];
}


}
else{


for(let i in object.material){


let pre_mat=object.material[i].clone();
let u_map;


if(pre_mat.type=="ShaderMaterial"){

if(pre_mat.uniforms.map!=undefined){ u_map=object.material[i].uniforms.map; }
}


object.material[i].dispose(); 
object.material[i]=pre_mat;


if(pre_mat.type!="ShaderMaterial"){ object.material[i].lightMap=tex[uv[0][1]]; }
else{
if(u_map!=undefined){ object.material[i].uniforms.map=u_map; }
object.material[i].uniforms.lightMap={};
object.material[i].uniforms.lightMap.value=tex[uv[0][1]];
}


}
}


uv.splice(0,1);


}


}


}


export{lightMap};
