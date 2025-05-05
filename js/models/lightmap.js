// ____________________ LIGHTMAP ____________________


OBJLoader.load("./models/lightmap.obj",function(object){


let show_names=0; 
let text="\r\n";
let was=[];


while(object.children.length){


let tex_name=object.children[0].name+"VRayRawTotalLightingMap";
lightMap.push_uv([object.children[0].name,tex_name,new THREE.Float32BufferAttribute(object.children[0].geometry.attributes.uv.array,2)]);


if(show_names && was[tex_name]==undefined){
was[tex_name]=1;
//text+="tex[\""+tex_name+"\"]=texture_loader.load(\"images/lightmap/"+tex_name+".png\");\r\n";
//text+="tex[\""+tex_name+"\"].colorSpace=THREE.SRGBColorSpace;\r\n";
text+="tex[\""+tex_name+"\"]=RGBELoader.load(\"images/lightmap/"+tex_name+".hdr\");\r\n";
}


object.children.splice(0,1);


}


if(show_names){
console.log(text);
}


});
