mat["uaz_body"]=new THREE.MeshStandardMaterial({
map:tex["uaz_d"],
envMap:environment_main,
envMapIntensity:0.5,
normalMap:tex["uaz_n"],
aoMap:tex["uaz_ao"],
aoMapIntensity:1.0,
metalnessMap:tex["uaz_m"],
metalness:1.0,
roughnessMap:tex["uaz_s"],
roughness:0.6,
});


mat["uaz_glass"]=new THREE.MeshStandardMaterial({
map:tex["uaz_glass_d"],
envMap:environment_main,
normalMap:tex["uaz_glass_n"],
aoMap:tex["uaz_glass_ao"],
aoMapIntensity:0.8,
metalnessMap:tex["uaz_glass_m"],
metalness:1,
roughnessMap:tex["uaz_glass_s"],
roughness:1,
transparent:true,
opacity:0.2
});


OBJLoader.load("./models/uaz/uaz-452.obj",function(object){


while(object.children.length){


let name=object.children[0].name;


mesh[name]=object.children[0];


mesh[name].position.set(-5,0,0);
mesh[name].castShadow=true;
mesh[name].receiveShadow=true;


mesh[name].frustumCulled=false;
mesh[name].onAfterRender=function(){
this.frustumCulled=true;
this.onAfterRender=function(){};
}


scene.add(mesh[name]);


}


});
