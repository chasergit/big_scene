mat["ship_cruise_1"]=new THREE.MeshStandardMaterial({
color:0xffffff,
envMap:environment_main,
envMapIntensity:0.5,
metalness:0.2,
roughness:0.8,
side:2
});


mat["ship_cruise_2"]=new THREE.MeshStandardMaterial({
color:0xa0a0a0,
envMap:environment_main,
envMapIntensity:0.5,
metalness:1.0,
roughness:0.6,
side:2
});


mat["ship_cruise_3"]=new THREE.MeshStandardMaterial({
color:0x00a0a0,
envMap:environment_main,
envMapIntensity:0.5,
metalness:1.0,
roughness:0.6,
});


OBJLoader.load("./models/ship_cruise/ship_cruise.obj",function(object){


while(object.children.length){


let name=object.children[0].name;


mesh[name]=object.children[0];


mesh[name].position.set(0,-10,750);
mesh[name].rotation.y=0.5;
mesh[name].scale.set(0.2,0.2,0.2);
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
