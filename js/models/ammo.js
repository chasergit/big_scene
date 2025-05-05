mat["ammo_crate"]=new THREE.MeshStandardMaterial({
map:tex["ammo_d"],
normalMap:tex["ammo_n"],
normalScale:{x:2,y:2},
aoMap:tex["ammo_ao"],
metalnessMap:tex["ammo_ms"],
metalness:0.4,
roughnessMap:tex["ammo_ms"],
roughness:1.2,
side:THREE.DoubleSide,
});


mat["ammo_items"]=new THREE.MeshStandardMaterial({
map:tex["ammo_items"],
});


OBJLoader.load("./models/ammo/ammo.obj",function(object){


while(object.children.length){


let name=object.children[0].name;


mesh[name]=object.children[0];


mesh[name].position.set(0,0,-8.25);
mesh[name].castShadow=true;
mesh[name].receiveShadow=true;


scene.add(mesh[name]);


}


});
