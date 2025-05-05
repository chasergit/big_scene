function intersection_ray_triangle(origin,direction,distance,item){


let result=0;
let originX=origin.x;
let originY=origin.y;
let originZ=origin.z;
let directionX=direction.x;
let directionY=direction.y;
let directionZ=direction.z;


let max_1=item.length;


for(let j=0;j<max_1;j++){


let p=item[j].position;
let vp=p.array;
let max_2=p.count*3;


for(let i=0;i<max_2;i+=9){


let ax=vp[i],ay=vp[i+1],az=vp[i+2];
let bx=vp[i+3],by=vp[i+4],bz=vp[i+5];
let cx=vp[i+6],cy=vp[i+7],cz=vp[i+8];


let bax=bx-ax,bay=by-ay,baz=bz-az;
let cax=cx-ax,cay=cy-ay,caz=cz-az;


let pvecX=directionY*caz-directionZ*cay;
let pvecY=directionZ*cax-directionX*caz;
let pvecZ=directionX*cay-directionY*cax;


let det=bax*pvecX+bay*pvecY+baz*pvecZ;


if(det<0.000001){ continue; } 


let diffX=originX-ax,diffY=originY-ay,diffZ=originZ-az;
let u=diffX*pvecX+diffY*pvecY+diffZ*pvecZ;


if(u<0 || u>det)continue;


let qvecX=diffY*baz-diffZ*bay;
let qvecY=diffZ*bax-diffX*baz;
let qvecZ=diffX*bay-diffY*bax;


let v=directionX*qvecX+directionY*qvecY+directionZ*qvecZ;


if(v<0 || u+v>det){ continue; }


let d=(cax*qvecX+cay*qvecY+caz*qvecZ)/det;



if(d<0 || d>distance){ continue; }


distance=d;
result=d;


}
}


return result;


}


export{intersection_ray_triangle};
