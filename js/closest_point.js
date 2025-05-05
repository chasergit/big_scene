function closest_point_same_side(p1,p2,a,b){


let ax=b.x-a.x,ay=b.y-a.y,az=b.z-a.z;
let bx=p1.x-a.x,by=p1.y-a.y,bz=p1.z-a.z;
let cp1x=ay*bz-az*by,cp1y=az*bx-ax*bz,cp1z=ax*by-ay*bx;
bx=p2.x-a.x;
by=p2.y-a.y;
bz=p2.z-a.z;
let cp2x=ay*bz-az*by,cp2y=az*bx-ax*bz,cp2z=ax*by-ay*bx;
return cp1x*cp2x+cp1y*cp2y+cp1z*cp2z>=0;


}


function closest_point_to_segment(p,a,b){


let abx=b.x-a.x,aby=b.y-a.y,abz=b.z-a.z;
let l=Math.sqrt(abx*abx+aby*aby+abz*abz);
let nabx=abx/l,naby=aby/l,nabz=abz/l;
let n=nabx*(p.x-a.x)+naby*(p.y-a.y)+nabz*(p.z-a.z);
if(n<0){ return a; }
if(n>l){ return b; }
return {x:a.x+nabx*n,y:a.y+naby*n,z:a.z+nabz*n};


}


function closest_point_to_sides(p,sides){


let min=Infinity;
let result;
for(let i=0;i<3;i++){
let ct=closest_point_to_segment(p,sides[i][0],sides[i][1]);
let d=Math.sqrt(Math.pow((ct.x-p.x),2)+Math.pow((ct.y-p.y),2)+Math.pow((ct.z-p.z),2));
if(d<min){
min=d;
result=ct;
}
}
return {t:1,x:result.x,y:result.y,z:result.z};


}


function closest_point_to_triangle(p,a,b,c){


// БЛИЖЕ К ПЛОСКОСТИ ТРЕУГОЛЬНИКА
if(closest_point_same_side(p,a,b,c) && closest_point_same_side(p,b,a,c) && closest_point_same_side(p,c,a,b)){ return {t:0,x:p.x,y:p.y,z:p.z}; }
// БЛИЖЕ К ГРАНИ ТРЕУГОЛЬНИКА
return closest_point_to_sides(p,[[a,b],[b,c],[a,c]]);


}


function closest_point_search(t,distance,p,fn,vp,n){


let nx=fn[n],ny=fn[n+1],nz=fn[n+2];


let va={x:vp[n],y:vp[n+1],z:vp[n+2]};
let vb={x:vp[n+3],y:vp[n+4],z:vp[n+5]};
let vc={x:vp[n+6],y:vp[n+7],z:vp[n+8]};


let pd=nx*(p.x-va.x)+ny*(p.y-va.y)+nz*(p.z-va.z);


let projection={x:p.x-nx*pd,y:p.y-ny*pd,z:p.z-nz*pd};



let point=closest_point_to_triangle(projection,va,vb,vc);


let d=Math.sqrt(Math.pow((point.x-p.x),2)+Math.pow((point.y-p.y),2)+Math.pow((point.z-p.z),2));


if(d<t && d<=distance){
return {d:d,t:point.t,x:point.x,y:point.y,z:point.z,nx:nx,ny:ny,nz:nz};
}


return 0;


}


function closest_point_type_1(p,distance,item,t){


let fn=item.normal.array;
let vp=item.position.array;
let max=item.position.count*3;
let result=0;


for(let n=0;n<max;n+=9){


//let minX=fn[n+6],minY=fn[n+6],minZ=fn[n+6],maxX=fn[n+6],maxY=fn[n+6],maxZ=fn[n+6];
//let minX=1,minY=1,minZ=1,maxX=1,maxY=1,maxZ=1;
//if(p.x>=minX && p.x<=maxX && p.y>=minY && p.y<=maxY && p.z>=minZ && p.z<=maxZ){ alert("inside"); }


//let ppp=[{x:vp[n],y:vp[n+1],z:vp[n+2]},{x:vp[n+3],y:vp[n+4],z:vp[n+5]},{x:vp[n+6],y:vp[n+7],z:vp[n+8]}];
//let ppp=[vp[n],vp[n+1],vp[n+2],vp[n+3],vp[n+4],vp[n+5],vp[n+6],vp[n+7],vp[n+8]];
let minX=+Infinity;
let minY=+Infinity;
let minZ=+Infinity;
let maxX=-Infinity;
let maxY=-Infinity;
let maxZ=-Infinity;


let x=vp[n];
let y=vp[n+1];
let z=vp[n+2];
if(x<minX)minX=x;
if(y<minY)minY=y;
if(z<minZ)minZ=z;
if(x>maxX)maxX=x;
if(y>maxY)maxY=y;
if(z>maxZ)maxZ=z;
x=vp[n+3];
y=vp[n+4];
z=vp[n+5];
if(x<minX)minX=x;
if(y<minY)minY=y;
if(z<minZ)minZ=z;
if(x>maxX)maxX=x;
if(y>maxY)maxY=y;
if(z>maxZ)maxZ=z;
x=vp[n+6];
y=vp[n+7];
z=vp[n+8];
if(x<minX)minX=x;
if(y<minY)minY=y;
if(z<minZ)minZ=z;
if(x>maxX)maxX=x;
if(y>maxY)maxY=y;
if(z>maxZ)maxZ=z;


minX-=distance;
minY-=distance;
minZ-=distance;
maxX+=distance;
maxY+=distance;
maxZ+=distance;


if(p.x<minX || p.x>maxX || p.y<minY || p.y>maxY || p.z<minZ || p.z>maxZ){ continue; }


let value=closest_point_search(t,distance,p,fn,vp,n);


if(value!=0){ t=value.d; result=value; }


}


return result;


}


function closest_point(p,distance,array){


let t=Infinity;
let result;

let max=array.length;
for(let i=0;i<max;i++){


if(array[i].attributes!=undefined){
let value=closest_point_type_1(p,distance,array[i].attributes,t);
if(value!=0){
t=value.t;
result=value;
}
continue;
}


}


if(t>distance){ return 0; }


result.t=t;
return result;


}


export{closest_point_same_side,closest_point_to_segment,closest_point_to_sides,closest_point_to_triangle,closest_point_search,closest_point_type_1,closest_point};
