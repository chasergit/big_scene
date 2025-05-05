

function intersection_ray_sphere(origin,direction,distance,array){


let result=0;
let originX=origin.x;
let originY=origin.y;
let originZ=origin.z;
let directionX=direction.x;
let directionY=direction.y;
let directionZ=direction.z;


let max=array.length;
for(let n=0;n<max;n++){


let item=array[n];
let ig=item.geometry;
let ib=ig.boundingSphere;
let radius=ib.radius;
let position=item.position;
let sc=ib.center;


let ocx=position.x+sc.x-originX,ocy=position.y+sc.y-originY,ocz=position.z+sc.z-originZ;
let tca=ocx*directionX+ocy*directionY+ocz*directionZ;
let d2=ocx*ocx+ocy*ocy+ocz*ocz-tca*tca;
let radius2=radius*radius;


if(d2>radius2)continue;


let thc=Math.sqrt(radius2-d2);

let t0=tca-thc;

let t1=tca+thc;

if(t0<0 && t1<0)continue;

let d=t0;

if(t0<0){ d=t1; }



if(d>distance){ continue; }


distance=d;
result=d;


}


return result;


}


export{intersection_ray_sphere};
