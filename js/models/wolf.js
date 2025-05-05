let wolf_tail=[];
let wolf_eye_bone;
let wolf_tail_bone;
let wolf_vector=new THREE.Vector3();



FBXLoader.load('./models/wolf/STANDARD_WOLF.fbx',function(object){
mixer["wolf"]=new THREE.AnimationMixer(object);
action["wolf"]=mixer["wolf"].clipAction(object.animations[0]);
action["wolf"].fadeIn(0.5);
action["wolf"].play();
mixers.push(mixer["wolf"]);
object.traverse(function(child) {


if(child.isMesh){
child.material=new THREE.MeshStandardMaterial({
map:tex["wolf"],
});
child.castShadow=true;
}





if(child.isBone){
child.visible=false;
if(child.name=="STANDARD_WOLF__Neck2"){
wolf_eye_bone=child;
}
if(child.name=="STANDARD_WOLF__Tail4"){
wolf_tail_bone=child;
}
}


});
mesh["wolf"]=object;
mesh["wolf"].position.set(13,0,0);


scene.add(mesh["wolf"]);


mesh["eye_1"]=new THREE.Mesh(new THREE.SphereGeometry(0.02,16,16,16),new THREE.MeshLambertMaterial({color:0xffff00}));
mesh["eye_1"].position.x=0.38;
mesh["eye_1"].position.z=-0.12;
wolf_eye_bone.add(mesh["eye_1"]);


mesh["eye_2"]=new THREE.Mesh(new THREE.SphereGeometry(0.02,16,16,16),new THREE.MeshLambertMaterial({color:0xffff00}));
mesh["eye_2"].position.x=0.38;
mesh["eye_2"].position.z=0.12;
wolf_eye_bone.add(mesh["eye_2"]);


mesh["tail"]=new THREE.Mesh(new THREE.SphereGeometry(0.14,16,16,16),new THREE.MeshBasicMaterial({color:0xffff00}));
mesh["tail"].position.x=0.2;
wolf_tail_bone.add(mesh["tail"]);


dummy["bone"]=new THREE.Object3D();
dummy["bone"].position.x=0.2;
dummy["bone"].matrix.compose(dummy["bone"].position,dummy["bone"].quaternion,dummy["bone"].scale);


wolf_tail.push([dummy["bone"].matrixWorld,wolf_tail_bone.matrixWorld,dummy["bone"].matrix,dummy["bone"].matrixWorld.elements]);


});
