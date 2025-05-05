mat["jetski"]=new THREE.MeshStandardMaterial({
envMap:scene.background,
map:tex["jetski"],
metalness:0.7,
roughness:0.2,
});


OBJLoader.load("./models/jetski/jetski.obj",function(object){


while(object.children.length){


let name=object.children[0].name;


mesh[name]=object.children[0];


mesh[name].position.set(30,-1.3,140);
mesh["jetski"].rotation.x=-1.57;
mesh["jetski"].rotation.z=-2;
mesh[name].scale.set(0.3,0.3,0.3);
mesh[name].castShadow=true;
mesh[name].receiveShadow=true;
mesh[name].material=mat["jetski"];


scene.add(mesh[name]);
scene_2.children.push(mesh[name]);


}


});
