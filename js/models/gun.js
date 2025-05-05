mat["gun"]=new THREE.MeshStandardMaterial({
map:tex["gun_d"],
normalMap:tex["gun_n"],
normalScale:{x:2,y:2},
aoMap:tex["gun_ao"],
metalnessMap:tex["gun_m"],
metalness:0.4,
roughnessMap:tex["gun_r"],
roughness:1.2,
});


// ____________________ GUN ____________________


OBJLoader.load("./models/gun/gun.obj",function(object){


while(object.children.length){


let name=object.children[0].name;


mesh[name]=object.children[0];


mesh[name].position.set(0,0,0);
mesh[name].scale.set(100,100,100);
mesh[name].castShadow=true;
mesh[name].receiveShadow=true;


scene.add(mesh[name]);


}


});