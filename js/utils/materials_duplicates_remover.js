function materials_duplicates_remover(object){


if(object.material.length==undefined){ return; }


let mat_name=[]; 
let mat_new=[]; 
let mat_same_found=0; 


let max=object.material.length;
for(let n=0;n<max;n++){
let material=object.material[n];
let uuid=material.uuid;
if(mat_name[uuid]==undefined){
mat_name[uuid]=[];
mat_new.push(material);
}
else{
mat_same_found=1; 
}
mat_name[uuid].push(n);
}


if(!mat_same_found){ return; }


object.material=mat_new;


let attributes=[];


for(let i in object.geometry.attributes){
attributes[i]=[];
}


let groups=[];
let num=0;
let start=0;


for(let i in mat_name){


groups[num]=[start,0];


let item_mat=mat_name[i];
let max_mat=item_mat.length;


for(let n=0;n<max_mat;n++){


let group=object.geometry.groups[item_mat[n]];


let att=object.geometry.attributes;
for(let b in att){
let end=group.start+group.count;
for(let h=group.start;h<end;h++){
let item_att=att[b];
let max_att_size=item_att.itemSize;
for(let m=0;m<max_att_size;m++){
attributes[b].push(item_att.array[h*max_att_size+m]);
}
}
}


start+=group.count;
groups[num][1]+=group.count; 
}


num++;


}


object.geometry.groups=[];


max=groups.length;
for(let n=0;n<max;n++){
object.geometry.groups[n]={start:groups[n][0],count:groups[n][1],materialIndex:n};
}


for(let i in attributes){
object.geometry.attributes[i].array=new Float32Array(attributes[i]);
}


}


export{materials_duplicates_remover};
