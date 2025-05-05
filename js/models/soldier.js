mat["soldier_body"]=new THREE.MeshStandardMaterial({
map:tex["soldier_body_d"],
normalMap:tex["soldier_body_n"],
normalScale:{x:1,y:1},
//roughnessMap:tex["soldier_body_s"],
//roughness:1,
});


mat["soldier_head"]=new THREE.MeshStandardMaterial({
map:tex["soldier_head_d"],
normalMap:tex["soldier_head_n"],
normalScale:{x:1,y:1},
//roughnessMap:tex["soldier_head_s"],
//roughness:2.2,
});


FBXLoader.load('./models/soldier/soldier.fbx',function(object){


mesh["soldier"]=object;
mesh["soldier"].children[2].material=mat["soldier_body"];
mesh["soldier"].children[3].material[0]=mat["soldier_body"];
mesh["soldier"].children[3].material[1]=mat["soldier_head"];


mesh["soldier"].traverse(function(child){
if(child.isBone){ child.visible=false; }
});


mesh["soldier"].traverse(function(child){
if(child.isMesh){
child.castShadow=true;
child.receiveShadow=true;
}
});


});
