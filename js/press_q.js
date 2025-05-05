let press_q_can_fetch=1;
let press_q_can_num=0;


function press_q(){


document.onkeydown=(e)=>{


key(event.keyCode,1);
if(event.keyCode==81 && press_q_can_fetch){
press_q_can_fetch=0;


fetch("./shaders/water.js?v="+performance.now())
.then(response=>response.text())
.then(contents=>{
eval(contents);
mat["lake"].fragmentShader=fs["water"];
mat["lake"].vertexShader=vs["water"];
mat["lake"].needsUpdate=true;


mat["ocean"].fragmentShader=fs["water"];
mat["ocean"].vertexShader=vs["water"];
mat["ocean"].needsUpdate=true;


mat["sea"].fragmentShader=fs["water"];
mat["sea"].vertexShader=vs["water"];
mat["sea"].needsUpdate=true;


mat["river"].fragmentShader=fs["water"];
mat["river"].vertexShader=vs["water"];
mat["river"].needsUpdate=true;


fetch("./shaders/grass.js?v="+performance.now())
.then(response=>response.text())
.then(contents=>{
eval(contents);


mat["grass_long_1"].fragmentShader=fs["grass"];
mat["grass_long_1"].vertexShader=vs["grass"];
mat["grass_long_1"].needsUpdate=true;


mat["grass_long_1_depth"].fragmentShader=fs["grass_depth"];
mat["grass_long_1_depth"].vertexShader=vs["grass_depth"];
mat["grass_long_1_depth"].needsUpdate=true;


})
.catch(error=>{
console.error(error);
press_q_can_fetch=1;
});


fetch("./shaders/water_refraction.js?v="+performance.now())
.then(response=>response.text())
.then(contents=>{
eval(contents);
mat["lake_refraction"].fragmentShader=fs["water_refraction"];
mat["lake_refraction"].vertexShader=vs["water_refraction"];
mat["lake_refraction"].needsUpdate=true;


mat["ocean_refraction"].fragmentShader=fs["water_refraction"];
mat["ocean_refraction"].vertexShader=vs["water_refraction"];
mat["ocean_refraction"].needsUpdate=true;

})
.catch(error=>{
console.error(error);
press_q_can_fetch=1;
});


fetch("./shaders/basic_ao.js?v="+performance.now())
.then(response=>response.text())
.then(contents=>{
eval(contents);


tex["Box002"]=RGBELoader.load("images/lightmap/Box002VRayRawTotalLightingMap.hdr?v="+Date.now());
tex["Box004"]=RGBELoader.load("images/lightmap/Box004VRayRawTotalLightingMap.hdr?v="+Date.now());
tex["home"]=RGBELoader.load("images/lightmap/homeVRayRawTotalLightingMap.hdr?v="+Date.now());
tex["home001"]=RGBELoader.load("images/lightmap/home001VRayRawTotalLightingMap.hdr?v="+Date.now());
mesh["Box002"].material.uniforms.lightMap.value=tex["Box002"];
mesh["Box004"].material.uniforms.lightMap.value=tex["Box004"];
mesh["home"].material[0].uniforms.lightMap.value=tex["home"];
mesh["home"].material[1].uniforms.lightMap.value=tex["home"];
mesh["home"].material[2].uniforms.lightMap.value=tex["home"];
mesh["home001"].material[0].uniforms.lightMap.value=tex["home001"];
mesh["home001"].material[1].uniforms.lightMap.value=tex["home001"];


mesh["Box002"].material.fragmentShader=fs["basic_ao"];
mesh["Box002"].material.vertexShader=vs["basic_ao"];
mesh["Box002"].material.needsUpdate=true;


mesh["Box004"].material.fragmentShader=fs["basic_ao"];
mesh["Box004"].material.vertexShader=vs["basic_ao"];
mesh["Box004"].material.needsUpdate=true;


mesh["home"].material[0].fragmentShader=fs["basic_ao"];
mesh["home"].material[0].vertexShader=vs["basic_ao"];
mesh["home"].material[0].needsUpdate=true;
mesh["home"].material[1].fragmentShader=fs["basic_ao"];
mesh["home"].material[1].vertexShader=vs["basic_ao"];
mesh["home"].material[1].needsUpdate=true;
mesh["home"].material[2].fragmentShader=fs["basic_ao"];
mesh["home"].material[2].vertexShader=vs["basic_ao"];
mesh["home"].material[2].needsUpdate=true;


mesh["home001"].material[0].fragmentShader=fs["basic_ao"];
mesh["home001"].material[0].vertexShader=vs["basic_ao"];
mesh["home001"].material[0].needsUpdate=true;
mesh["home001"].material[1].fragmentShader=fs["basic_ao"];
mesh["home001"].material[1].vertexShader=vs["basic_ao"];
mesh["home001"].material[1].needsUpdate=true;


})
.catch(error=>{
console.error(error);
press_q_can_fetch=1;
});


fetch("./shaders/overlay_damage_blood.js?v="+performance.now())
.then(response=>response.text())
.then(contents=>{
eval(contents);


mat["overlay_damage_blood"].fragmentShader=fs["overlay_damage_blood"];
mat["overlay_damage_blood"].vertexShader=vs["overlay_damage_blood"];
mat["overlay_damage_blood"].needsUpdate=true;


})
.catch(error=>{
console.error(error);
press_q_can_fetch=1;
});


fetch("./shaders/underwater_pass.js?v="+performance.now())
.then(response=>response.text())
.then(contents=>{


contents=contents.replace(/const underwater_pass/,"window.underwater2");
contents=contents.replace(/export default underwater_pass;/,"");
eval(contents);


underwater_pass.material.fragmentShader=underwater2.fragmentShader;
underwater_pass.material.vertexShader=underwater2.vertexShader;
underwater_pass.material.needsUpdate=true;


})
.catch(error=>{
console.error(error);
press_q_can_fetch=1;
});


fetch("./shaders/underwater_ripples_pass.js?v="+performance.now())
.then(response=>response.text())
.then(contents=>{


contents=contents.replace(/const underwater_ripples_pass/,"window.underwater_ripples2");
contents=contents.replace(/export default underwater_ripples_pass;/,"");
eval(contents);


underwater_ripples_pass.material.fragmentShader=underwater_ripples2.fragmentShader;
underwater_ripples_pass.material.vertexShader=underwater_ripples2.vertexShader;
underwater_ripples_pass.material.needsUpdate=true;


})
.catch(error=>{
console.error(error);
press_q_can_fetch=1;
});


fetch("./shaders/correction_pass.js?v="+performance.now())
.then(response=>response.text())
.then(contents=>{


contents=contents.replace(/const correction_pass/,"window.correction2");
contents=contents.replace(/export default correction_pass;/,"");
eval(contents);


correction_pass.material.fragmentShader=correction2.fragmentShader;
correction_pass.material.vertexShader=correction2.vertexShader;
correction_pass.material.needsUpdate=true;


})
.catch(error=>{
console.error(error);
press_q_can_fetch=1;
});



press_q_can_num++;
console.log("water shader changed "+press_q_can_num);
press_q_can_fetch=1;


sounds_play(null,"shader_changed",false,false,1,0,1,false,"","");


})
.catch(error=>{
console.error(error);
press_q_can_fetch=1;
});
}
}


}
