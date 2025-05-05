mat["wall_237"]=new THREE.MeshStandardMaterial({
});


mat["terrain"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["terrain_grass"]},
dirt:{value:tex["terrain_dirt"]},
noise:{value:tex["terrain_noise"]},
lightMap:{value:null},
fogColor:{value:fogColor},
},
vertexShader:vs["terrain_triplanar"],
fragmentShader:fs["terrain_triplanar"],
});


mat["stone"]=new THREE.MeshStandardMaterial({
map:tex["stone_2_d"],
normalMap:tex["stone_2_n"],
roughness:0.6,
metalness:0.3,
});


mat["rock_23"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["stone_2_d"]},
lightMap:{value:null},
},
vertexShader:vs["basic_ao"],
fragmentShader:fs["basic_ao"],
});


mat["wall_118"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["wall_118"]},
lightMap:{value:null},
shadow_map:{value:tex["wall_118"]},
},
vertexShader:vs["basic_ao"],
fragmentShader:fs["basic_ao"],
});


mat["wall_108"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["wall_108"]},
lightMap:{value:null},
},
vertexShader:vs["basic_ao"],
fragmentShader:fs["basic_ao"],
});


mat["wall_276"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["wall_276"]},
lightMap:{value:null},
},
vertexShader:vs["basic_ao"],
fragmentShader:fs["basic_ao"],
});


mat["home_roof"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["home_roof"]},
lightMap:{value:null},
},
vertexShader:vs["basic_ao"],
fragmentShader:fs["basic_ao"],
});


mat["pinetree"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["pinetree"]},
lightMap:{value:null},
},
vertexShader:vs["basic_ao"],
fragmentShader:fs["basic_ao"],
side:THREE.DoubleSide,
});


OBJLoader.load("./models/common.obj",function(object){


while(object.children.length){


let name=object.children[0].name;


mesh[name]=object.children[0];


if(name=="stone"){


mesh["stone_2"]=mesh["stone"].clone();


mesh["stone_2"].material=new THREE.MeshStandardMaterial({
map:tex["stone_2_d"],
normalMap:tex["stone_2_n"],
roughness:0.6,
metalness:0.3,
});

mesh["stone_2"].castShadow=true;
mesh["stone_2"].receiveShadow=true;
mesh["stone_2"].position.set(0,0,-40);
mesh["stone_2"].scale.set(4,4,4);
mesh["stone_2"].updateMatrixWorld();
mesh["stone_2"].matrixAutoUpdate=false;
mesh["stone_2"].updateMatrixWorld=function(){};
scene.add(mesh["stone_2"]);


}


// ДЛЯ СТАТИЧНЫХ ОБЪЕКТОВ, ЧТОБЫ ПРИ КАЖДОЙ ОТРИСОВКЕ НЕ ПЕРЕРАСЧИТЫВАЛ


mesh[name].matrixAutoUpdate=false;
mesh[name].updateMatrixWorld=function(){};


scene.add(mesh[name]);


}


mesh["home"].geometry.computeBoundingBox();
scene.add(new THREE.BoxHelper(mesh["home"]));


mesh["home001"].geometry.computeBoundingBox();
scene.add(new THREE.BoxHelper(mesh["home001"]));


});
