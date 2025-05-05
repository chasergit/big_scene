
function intersection_ray_AABB(origin,direction,distance,array){


let result=0;
let originX=origin.x;
let originY=origin.y;
let originZ=origin.z;
let directionX=direction.x;
let directionY=direction.y;
let directionZ=direction.z;


let max=array.length
for(let n=0;n<max;n++){


let item=array[n];
let dirInverse={x:1/directionX,y:1/directionY,z:1/directionZ};
let position=item.position;
let boundingBox=item.geometry.boundingBox;


let bmin=boundingBox.min;
let bmax=boundingBox.max;
let positionX=position.x;
let positionY=position.y;
let positionZ=position.z;


let lbx=bmin.x+positionX,lby=bmin.y+positionY,lbz=bmin.z+positionZ;
let rtx=bmax.x+positionX,rty=bmax.y+positionY,rtz=bmax.z+positionZ;


let t1=(lbx-originX)*dirInverse.x;
let t2=(rtx-originX)*dirInverse.x;
let t3=(lby-originY)*dirInverse.y;
let t4=(rty-originY)*dirInverse.y;
let t5=(lbz-originZ)*dirInverse.z;
let t6=(rtz-originZ)*dirInverse.z;


let dmax=Math.min(Math.min(Math.max(t1,t2),Math.max(t3,t4)),Math.max(t5,t6));



if(dmax<0){ continue; }
let dmin=Math.max(Math.max(Math.min(t1,t2),Math.min(t3,t4)),Math.min(t5,t6));
if(dmin>dmax){ continue; }


let d=dmin;

if(dmin<0){ let d=dmax; }



if(d>distance){ continue; }


distance=d;
result=d;


}


return result;


}


export{intersection_ray_AABB};
