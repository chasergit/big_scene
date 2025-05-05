/*
CREATION DATE: 080323-010525
IMPORTANT:
1. When 2 normals with the same texture and scale flow, they merge into one texture. Either change the scale, or move diagonally, or different textures.
2. A bad normal texture may be upside down, have stripes around the edges, or not be seamless.
*/


let water_stats=true; // DISPLAY STATISTICS IN CONSOLE
let water_debug=false; // SHOW WATER GRID AND WATER LINE
let water=[];
let water_refaction_enabled=false;


// ____________________ WATER SETTINGS ____________________


function waters_set(){


// ADDING A FUNCTION TO DELETE THE OBJECT WE WILL USE IN from_mesh
mesh["lake"].delete=function(){ delete mesh["lake"]; };


water["lake"]={
from_mesh:mesh["lake"], // TURN OBJECT INTO WATER, ELSE null
width:0, // WIDTH
depth:0, // LENGTH	
deep:12, // DEPTH
position:{x:0,y:0,z:0}, // POSITION
// [LOD CELL SIZE CAN ALSO BE 0 - THEN THERE WILL BE A PLANE OF 2 TRIANGLES, DISTANCE TO THE CENTER OF LOD]
// FOR THE FIRST LOD, THE DISTANCE TO THE CENTER MAY NOT BE SPECIFIED
// ALLOWED CELL SIZES: 0.125,0.25,0.5,1,2,4,8,16,32,64
// EXAMPLE: cells_size:[[0.25,20]], NO LOD
// EXAMPLE: cells_size:[[0.25,20],[0.25,100],[0,200]], 3 LOD
// IF WE NEED FLAT WATER, THEN WE SET: cells_size:[[0,0]], AND use_waves:false
cells_size:[[0,0]],
// GERSTNER WAVES
gerstner_waves:[new THREE.Vector4(-1.0,-1.0,0.05,60.0),new THREE.Vector4(-1.0,-0.6,0.05,31.0),new THREE.Vector4(-1.0,-1.3,0.05,18.0)],
gerstner_waves_speed:{value:0.001}, // WAVE SPEED
water_top_color:{value:new THREE.Color(0.0,0.96,0.48).convertSRGBToLinear()}, // WATER TOP COLOR		
water_bottom_color:{value:new THREE.Color(0.0,0.7,0.7).convertSRGBToLinear()}, // WATER BOTTOM COLOR		
shore_transparent:{value:0.4}, // SHORE TRANSPARENCY 0-1
wave_color:{value:new THREE.Color(0.0,0.6,0.6).convertSRGBToLinear()}, // WAVE COLOR
wave_color_power:{value:1.5}, // WAVE COLOR FRINEL
sss_color:{value:new THREE.Color(0.0,1.0,1.0)}, // SUBSURFACE LIGHT SCATTERING COLOR
sss_value:{value:[0.66,5.0,10.0,0.01]}, // SUBSURFACE LIGHT SCATTERING [DISTORTION,FRESNEL,INTENSITY,REDUCE SUN HEIGHT TO MAINTAIN EFFECT]
shore_smoothing_intensity:{value:10.0}, // SHORE SMOOTHING
refraction_value:{value:[0.05,10.0]}, // REFRACTION [INTENSITY,REFRACTION REDUCTION NEAR THE SHORE]
// NORMAL
normal_a_value:{value:[0.2,0,0.00015]}, // SHALLOW NORMAL A [SCALE,VELOCITY X,VELOCITY Z]
normal_b_value:{value:[0.1,0,-0.00010]}, // SHALLOW NORMAL B [SCALE,X-SPEED,Z-SPEED]
normal_ab:{value:1.0}, // FLIP THE Y NORMAL BY -1. AS WELL AS DECREASE IN INTENSITY
normal_c_value:{value:[0.02,0,0.00010]}, // BIG NORMAL C [SCALE,X-SPEED,Z-SPEED]
normal_d_value:{value:[0.01,0,-0.00005]}, // BIG NORMAL D [SCALE,X-SPEED,Z-SPEED]
normal_cd:{value:1.0}, // FLIP THE Y NORMAL BY -1. AND ALSO DECREASE INTENSITY
normal_small_far_total:{value:[0.5,0.1]}, // HOW MUCH TO MIX THE SMALL NORMAL WITH THE BIG NORMAL, AND HOW MUCH TO MIX THEM WITH THE WAVE APEX
// REFLECTION
env_mix:{value:1.0}, // HOW STRENGTHLY TO MIX THE BASE NORMAL WITH THE TEXTURE NORMAL
env_melt:{value:1.0}, // IF THE NORMAL TEXTURE IS SHARP, THEN THE BLUE FROM THE SKY IS VISIBLE, TO REDUCE IT, WE INCREASE THIS VALUE
env_fresnel_min:{value:0.01}, // MINIMUM FRESNEL
env_fresnel_power:{value:5.0}, // FRESNEL POWER
env_intensity:{value:1.0}, // SKY REFLECTION BRIGHTNESS
env_max:{value:1.0}, // MAXIMUM REFLECTION LEVEL
env_add_background:{value:0.0}, // HOW MUCH TO ADD WATER COLOR TO AFFECT REFLECTION
envMap:{value:scene_envMap_backed.textures[0]}, // REFLECTION TEXTURE
foam_shore_map:{value:tex["water_foam"]}, // TEXTURE OF FOAM SHORE
foam_wave_map:{value:tex["water_foam"]}, // WAVE FOAM TEXTURE
normal_map:{value:tex["water_normal"]}, // NORMAL TEXTURE OR null
holes_map:{value:null}, // BLACK AND WHITE TEXTURE FOR HOLES IN WATER, IF NOT NEEDED, THEN null
holes_pars:{value:[0.001,0.001,0.5,0.5]}, // [SCALE X, SCALE Z, OFFSET UV X, OFFSET UV Z]
depth_offset:{value:0.0}, // DEPTH OFFSET
depth_beers_law:{value:-0.1}, // TOP OF DEPTH
depth_distance:{value:2.5}, // DEPTH TRANSPARENCY
foam_waves_value:{value:[0.1,3.0,1.4]}, // FOAM ON WAVES [TEXTURE SCALE,STRENGTH,BRIGHTNESS]
foam_shore_value:{value:[1.0,0.4,0,0.00002]}, // FOAM AT THE SHORE [WIDTH,TEXTURE SCALE,X-SPEED,Z-SPEED]
specular:{value:[10,100,720]}, // SUN GLARE [INTENSITY,STRENGTH WHEN SUN IS HIGH,STRENGTH WHEN SUN IS ON THE HORIZON]
phong_simple_intensity:{value:0.5}, // SIMPLE PHONG INTENSITY
scattering_intensity:{value:0.5}, // LIGHT SCATTERING INTENSITY. IF YOU SET IT TO MUCH IT MAY LOOK LIKE PLASTIC
// CAUSTIC
caustics_map:{value:tex["water_caustic"]}, // CAUSTIC TEXTURE OR null
caustics_1_dir_speed:{value:[0,0.0001]}, // [X,Z] DIRECTION AND SPEED OF THE FIRST CAUSTICS
caustics_2_dir_speed:{value:[0,0.0002]}, // [X,Z] DIRECTION AND SPEED OF THE SECOND CAUSTICS
caustics_wave:{value:[1,0.1,0.001]}, // CAUSTIC WAVE [FREQUENCY, MAGNITUDE, SPEED AND DIRECTION]
caustics_intensity:{value:2}, // INTENSITY
caustics_scale_power:{value:[0.2,1]}, // SCALE, POWER OF MANIFESTATION
caustics_color:{value:new THREE.Color(1.0,1.0,0.4)}, // COLOR
// UNDER WATER
underwater_gradient_offset:1, // HOW MUCH TO RETRIEVE THE GRADIENT FROM THE TOP OF THE WATER
underwater_gradient_deep:3, // GRADIENT DEPTH
underwater_top_color_deep:4, // TOP COLOR DEPTH
underwater_top_color:new THREE.Color(0.0,0.9,0.2), // TOP COLOR
underwater_bottom_color:new THREE.Color(0.0,0.45,0.45), // BOTTOM COLOR
underwater_sun_flare_color:new THREE.Color(1.0,1.0,0.2), // SUN FLARE COLOR
underwater_sun_flare_intensity:0.5, // SUN FLARE INTENSITY
underwater_darkness_deep:20, // DEPTH OF DARKNESS
underwater_depth_distance:30, // DEPTH TRANSPARENCY
gamma:{value:1.0}, // GAMMA
saturation:{value:1.0}, // SATURATION
normal_far_smoothing:{value:[250,200]}, // FAR NORMAL SMOOTHING [DISTANCE FROM,EXTENSION]
sky_far_mix_value:{value:[450,500]}, // MIXING SKY WITH WATER IN THE DISTANCE [DISTANCE FROM,DISTANCE TO]
// SHOULD I USE THESE FUNCTIONS?
use_transparent_style:true, // FALSE - NORMAL WATER, TRUE - FULLY TRANSPARENT
refraction:1, // 0 - DO NOT USE REFRACTION, 1 - USE BUT FLAT FROM 2 TRIANGLES, 2 - FROM ALL TRIANGLES OF WAVES
use_waves:false, // GERSTNER WAVES
use_sss:false, // SUBSURFACE LIGHT SCATTERING
use_shore_smoothing:true, // SHORE SMOOTHING
use_caustics:true, // CAUSTICS
use_fog:true, // FOG
use_wave_color:true, // WAVE COLOR
use_foam_waves:true, // FOAM ON WAVES
use_foam_shore:true, // FOAM AT THE SHORE AND OBJECTS
use_gamma:false, // GAMMA
use_saturation:false, // SATURATION
use_back:true, // BACK SIDE
use_shadows:true, // SHADOWS
use_sky_far_mix:true, // MIXING THE SKY WITH THE WATER IN THE DISTANCE
use_specular:true, // SUN GLARE
use_phong_simple:true, // SIMPLE PHONG INTENSITY
use_scattering:true, // LIGHT SCATTERING INTENSITY
use_shore_transparent:true, // SHORE TRANSPARENCY
use_underwater_sun_flare:true, // UNDERWATER SUN FLARE
}


water["sea"]={
from_mesh:null, // TURN OBJECT INTO WATER, ELSE null
width:80, // WIDTH
depth:90, // LENGTH	
deep:10, // DEPTH
position:{x:180,y:-3,z:145}, // POSITION
// [LOD CELL SIZE CAN ALSO BE 0 - THEN THERE WILL BE A PLANE OF 2 TRIANGLES, DISTANCE TO THE CENTER OF LOD]
// FOR THE FIRST LOD, THE DISTANCE TO THE CENTER MAY NOT BE SPECIFIED
// ALLOWED CELL SIZES: 0.125,0.25,0.5,1,2,4,8,16,32,64
// EXAMPLE: cells_size:[[0.25,20]], NO LOD
// EXAMPLE: cells_size:[[0.25,20],[0.25,100],[0,200]], 3 LOD
// IF WE NEED FLAT WATER, THEN WE SET: cells_size:[[0,0]], AND use_waves:false
cells_size:[[1.0,0],[2.0,100],[4.0,150],[8.0,200]],
// GERSTNER WAVES
gerstner_waves:[new THREE.Vector4(-1.0,-1.0,0.05,60.0),new THREE.Vector4(-1.0,-0.6,0.05,31.0),new THREE.Vector4(-1.0,-1.3,0.05,18.0)],
gerstner_waves_speed:{value:0.001}, // WAVE SPEED
water_top_color:{value:new THREE.Color(0.05,0.12,0.2)}, // WATER TOP COLOR			
water_bottom_color:{value:new THREE.Color(0.05,0.12,0.2)}, // WATER BOTTOM COLOR	
shore_transparent:{value:0.4}, // SHORE TRANSPARENCY 0-1
wave_color:{value:new THREE.Color(0.0,0.6,0.6).convertSRGBToLinear()}, // WAVE COLOR
wave_color_power:{value:1.5}, // WAVE COLOR FRINEL
sss_color:{value:new THREE.Color(0.0,1.0,1.0)}, // SUBSURFACE LIGHT SCATTERING COLOR
sss_value:{value:[0.66,5.0,10.0,0.01]}, // SUBSURFACE LIGHT SCATTERING [DISTORTION,FRESNEL,INTENSITY,REDUCE SUN HEIGHT TO MAINTAIN EFFECT]
shore_smoothing_intensity:{value:10.0}, // SHORE SMOOTHING
refraction_value:{value:[0.05,10.0]}, // REFRACTION [INTENSITY,REFRACTION DECREASE NEAR THE SHORE]
// NORMAL
normal_a_value:{value:[0.2,0,0.00015]}, // SHALLOW NORMAL A [SCALE,VELOCITY X,VELOCITY Z]
normal_b_value:{value:[0.1,0,-0.00010]}, // SHALLOW NORMAL B [SCALE,VELOCITY X,VELOCITY Z]
normal_ab:{value:1.0}, // FLIP THE Y NORMAL BY -1. AS WELL AS DECREASE IN INTENSITY
normal_c_value:{value:[0.02,0,0.00010]}, // BIG NORMAL C [SCALE,X-SPEED,Z-SPEED]
normal_d_value:{value:[0.01,0,-0.00005]}, // BIG NORMAL D [SCALE,X-SPEED,Z-SPEED]
normal_cd:{value:1.0}, // FLIP THE Y NORMAL BY -1. AND ALSO DECREASE INTENSITY
normal_small_far_total:{value:[0.5,0.1]}, // HOW MUCH TO MIX THE SMALL NORMAL WITH THE BIG NORMAL, AND HOW MUCH TO MIX THEM WITH THE WAVE APEX
// REFLECTION
env_mix:{value:1.0}, // HOW STRENGTHLY TO MIX THE BASE NORMAL WITH THE TEXTURE NORMAL
env_melt:{value:1.0}, // IF THE NORMAL TEXTURE IS SHARP, THEN THE BLUE FROM THE SKY IS VISIBLE, TO REDUCE IT, WE INCREASE THIS VALUE
env_fresnel_min:{value:0.01}, // MINIMUM FRESNEL
env_fresnel_power:{value:0.0}, // FRESNEL POWER
env_intensity:{value:1.0}, // SKY REFLECTION BRIGHTNESS
env_max:{value:1.0}, // MAXIMUM REFLECTION LEVEL
env_add_background:{value:0.0}, // HOW MUCH TO ADD WATER COLOR TO AFFECT REFLECTION
envMap:{value:scene_envMap_backed.textures[0]}, // REFLECTION TEXTURE
foam_shore_map:{value:tex["water_foam"]}, // TEXTURE OF FOAM SHORE
foam_wave_map:{value:tex["water_foam"]}, // WAVE FOAM TEXTURE
normal_map:{value:tex["water_normal"]}, // NORMAL TEXTURE OR null
holes_map:{value:null}, // BLACK AND WHITE TEXTURE FOR HOLES IN WATER, IF NOT NEEDED, THEN null
holes_pars:{value:[0.001,0.001,0.5,0.5]}, // [SCALE X, SCALE Z, OFFSET UV X, OFFSET UV Z]
depth_offset:{value:0.0}, // DEPTH OFFSET
depth_beers_law:{value:-0.1}, // TOP OF DEPTH
depth_distance:{value:2.5}, // DEPTH TRANSPARENCY
foam_waves_value:{value:[0.1,3.0,1.4]}, // FOAM ON WAVES [TEXTURE SCALE,STRENGTH,BRIGHTNESS]
foam_shore_value:{value:[1.0,0.4,0,0.00002]}, // FOAM AT THE SHORE [WIDTH,TEXTURE SCALE,X-SPEED,Z-SPEED]
specular:{value:[10,100,720]}, // SUN GLARE [INTENSITY,STRENGTH WHEN SUN IS HIGH,STRENGTH WHEN SUN IS ON THE HORIZON]
phong_simple_intensity:{value:0.5}, // SIMPLE PHONG INTENSITY
scattering_intensity:{value:0.5}, // LIGHT SCATTERING INTENSITY. IF YOU SET IT TO MUCH IT MAY LOOK LIKE PLASTIC
// CAUSTIC
caustics_map:{value:tex["water_caustic"]}, // CAUSTIC TEXTURE OR null
caustics_1_dir_speed:{value:[0,0.0001]}, // [X,Z] DIRECTION AND SPEED OF THE FIRST CAUSTICS
caustics_2_dir_speed:{value:[0,0.0002]}, // [X,Z] DIRECTION AND SPEED OF THE SECOND CAUSTICS
caustics_wave:{value:[1,0.1,0.001]}, // CAUSTIC WAVE [FREQUENCY, MAGNITUDE, SPEED AND DIRECTION]
caustics_intensity:{value:2}, // INTENSITY
caustics_scale_power:{value:[0.2,1]}, // SCALE, POWER OF MANIFESTATION
caustics_color:{value:new THREE.Color(1.0,1.0,0.4)}, // COLOR
// UNDER WATER
underwater_gradient_offset:1, // HOW MUCH TO RETRIEVE THE GRADIENT FROM THE TOP OF THE WATER
underwater_gradient_deep:3, // GRADIENT DEPTH
underwater_top_color_deep:4, // TOP COLOR DEPTH
underwater_top_color:new THREE.Color(0.0,0.9,0.2), // TOP COLOR
underwater_bottom_color:new THREE.Color(0.05,0.12,0.2), // BOTTOM COLOR
underwater_sun_flare_color:new THREE.Color(1.0,1.0,0.2), // SUN FLARE COLOR
underwater_sun_flare_intensity:0.5, // SUN FLARE INTENSITY
underwater_darkness_deep:20, // DEPTH OF DARKNESS
underwater_depth_distance:30, // DEPTH TRANSPARENCY
gamma:{value:1.0}, // GAMMA
saturation:{value:1.0}, // SATURATION
normal_far_smoothing:{value:[250,200]}, // FAR NORMAL SMOOTHING [DISTANCE FROM,EXTENSION]
sky_far_mix_value:{value:[450,500]}, // MIXING SKY WITH WATER IN THE DISTANCE [DISTANCE FROM,DISTANCE TO]
// SHOULD I USE THESE FUNCTIONS?
use_transparent_style:false, // FALSE - NORMAL WATER, TRUE - COMPLETELY TRANSPARENT
refraction:2, // 0 - DO NOT USE REFRACTION, 1 - USE BUT FLAT FROM 2 TRIANGLES, 2 - FROM ALL TRIANGLES WAVES
use_waves:true, // GERSTNER WAVES
use_sss:false, // SUBSURFACE LIGHT SCATTERING
use_shore_smoothing:true, // SHORE SMOOTHING
use_caustics:false, // CAUSTICS
use_fog:true, // FOG
use_wave_color:false, // WAVE COLOR
use_foam_waves:true, // FOAM ON WAVES
use_foam_shore:true, // FOAM AT THE SHORE AND OBJECTS
use_gamma:false, // GAMMA
use_saturation:false, // SATURATION
use_back:true, // BACK SIDE
use_shadows:true, // SHADOWS
use_sky_far_mix:true, // MIXING THE SKY WITH THE WATER IN THE DISTANCE
use_specular:true, // SUN GLARE
use_phong_simple:true, // SIMPLE PHONG INTENSITY
use_scattering:true, // LIGHT SCATTERING INTENSITY
use_shore_transparent:true, // SHORE TRANSPARENCY
use_underwater_sun_flare:true, // UNDERWATER SUN FLARE
}


water["river"]={
from_mesh:null, // TURN OBJECT INTO WATER, ELSE null
width:40, // WIDTH
depth:70, // LENGTH	
deep:10, // DEPTH
position:{x:120,y:-2,z:125}, // POSITION
// [LOD CELL SIZE CAN ALSO BE 0 - THEN THERE WILL BE A PLANE OF 2 TRIANGLES, DISTANCE TO THE CENTER OF LOD]
// FOR THE FIRST LOD, THE DISTANCE TO THE CENTER MAY NOT BE SPECIFIED
// ALLOWED CELL SIZES: 0.125,0.25,0.5,1,2,4,8,16,32,64
// EXAMPLE: cells_size:[[0.25,20]], NO LOD
// EXAMPLE: cells_size:[[0.25,20],[0.25,100],[0,200]], 3 LOD
// IF WE NEED FLAT WATER, THEN WE SET: cells_size:[[0,0]], AND use_waves:false
cells_size:[[0,0]],
// GERSTNER WAVES
gerstner_waves:[new THREE.Vector4(-1.0,-1.0,0.05,60.0),new THREE.Vector4(-1.0,-0.6,0.05,31.0),new THREE.Vector4(-1.0,-1.3,0.05,18.0)],
gerstner_waves_speed:{value:0.001}, // WAVE SPEED
water_top_color:{value:new THREE.Color(0.0,0.96,0.48).convertSRGBToLinear()}, // WATER TOP COLOR				
water_bottom_color:{value:new THREE.Color(0.0,0.7,0.7).convertSRGBToLinear()}, // WATER BOTTOM COLOR	
shore_transparent:{value:0.4}, // SHORE TRANSPARENCY 0-1
wave_color:{value:new THREE.Color(0.0,0.6,0.6).convertSRGBToLinear()}, // WAVE COLOR
wave_color_power:{value:1.5}, // WAVE COLOR FRINEL
sss_color:{value:new THREE.Color(0.0,1.0,1.0)}, // SUBSURFACE LIGHT SCATTERING COLOR
sss_value:{value:[0.66,5.0,10.0,0.01]}, // SUBSURFACE LIGHT SCATTERING [DISTORTION,FRESNEL,INTENSITY,REDUCE SUN HEIGHT TO MAINTAIN EFFECT]
shore_smoothing_intensity:{value:10.0}, // SHORE SMOOTHING
refraction_value:{value:[0.05,10.0]}, // REFRACTION [INTENSITY,REFRACTION REDUCTION NEAR THE SHORE]
// NORMAL
normal_a_value:{value:[0.2,0,0.00015]}, // SHALLOW NORMAL A [SCALE,VELOCITY X,VELOCITY Z]
normal_b_value:{value:[0.1,0,-0.00010]}, // SHALLOW NORMAL B [SCALE,X-SPEED,Z-SPEED]
normal_ab:{value:1.0}, // FLIP THE Y NORMAL BY -1. AS WELL AS DECREASE IN INTENSITY
normal_c_value:{value:[0.02,0,0.00010]}, // BIG NORMAL C [SCALE,X-SPEED,Z-SPEED]
normal_d_value:{value:[0.01,0,-0.00005]}, // BIG NORMAL D [SCALE,X-SPEED,Z-SPEED]
normal_cd:{value:1.0}, // FLIP THE Y NORMAL BY -1. AND ALSO DECREASE INTENSITY
normal_small_far_total:{value:[0.5,0.1]}, // HOW MUCH TO MIX THE SMALL NORMAL WITH THE BIG NORMAL, AND HOW MUCH TO MIX THEM WITH THE WAVE APEX
// REFLECTION
env_mix:{value:1.0}, // HOW STRENGTHLY TO MIX THE BASE NORMAL WITH THE TEXTURE NORMAL
env_melt:{value:1.0}, // IF THE NORMAL TEXTURE IS SHARP, THEN THE BLUE FROM THE SKY IS VISIBLE, TO REDUCE IT, WE INCREASE THIS VALUE
env_fresnel_min:{value:0.01}, // MINIMUM FRESNEL
env_fresnel_power:{value:5.0}, // FRESNEL POWER
env_intensity:{value:1.0}, // SKY REFLECTION BRIGHTNESS
env_max:{value:1.0}, // MAXIMUM REFLECTION LEVEL
env_add_background:{value:0.0}, // HOW MUCH TO ADD WATER COLOR TO AFFECT REFLECTION
envMap:{value:scene_envMap_backed.textures[0]}, // REFLECTION TEXTURE
foam_shore_map:{value:tex["water_foam"]}, // TEXTURE OF FOAM SHORE
foam_wave_map:{value:tex["water_foam"]}, // WAVE FOAM TEXTURE
normal_map:{value:tex["water_normal"]}, // NORMAL TEXTURE OR null
holes_map:{value:null}, // BLACK AND WHITE TEXTURE FOR HOLES IN WATER, IF NOT NEEDED, THEN null
holes_pars:{value:[0.001,0.001,0.5,0.5]}, // [SCALE X, SCALE Z, OFFSET UV X, OFFSET UV Z]
depth_offset:{value:0.0}, // DEPTH OFFSET
depth_beers_law:{value:-0.1}, // TOP OF DEPTH
depth_distance:{value:2.5}, // DEPTH TRANSPARENCY
foam_waves_value:{value:[0.1,3.0,1.4]}, // FOAM ON WAVES [TEXTURE SCALE,STRENGTH,BRIGHTNESS]
foam_shore_value:{value:[1.0,0.4,0,0.00002]}, // FOAM AT THE SHORE [WIDTH,TEXTURE SCALE,X-SPEED,Z-SPEED]
specular:{value:[10,100,720]}, // SUN GLARE [INTENSITY,STRENGTH WHEN SUN IS HIGH,STRENGTH WHEN SUN IS ON THE HORIZON]
phong_simple_intensity:{value:0.5}, // SIMPLE PHONG INTENSITY
scattering_intensity:{value:0.5}, // LIGHT SCATTERING INTENSITY. IF YOU SET IT TO MUCH IT MAY LOOK LIKE PLASTIC
// CAUSTIC
caustics_map:{value:tex["water_caustic"]}, // CAUSTIC TEXTURE OR null
caustics_1_dir_speed:{value:[0,0.0001]}, // [X,Z] DIRECTION AND SPEED OF THE FIRST CAUSTICS
caustics_2_dir_speed:{value:[0,0.0002]}, // [X,Z] DIRECTION AND SPEED OF THE SECOND CAUSTICS
caustics_wave:{value:[1,0.1,0.001]}, // CAUSTIC WAVE [FREQUENCY, MAGNITUDE, SPEED AND DIRECTION]
caustics_intensity:{value:2}, // INTENSITY
caustics_scale_power:{value:[0.2,1]}, // SCALE, POWER OF MANIFESTATION
caustics_color:{value:new THREE.Color(1.0,1.0,0.4)}, // COLOR
// UNDER WATER
underwater_gradient_offset:1, // HOW MUCH TO RETRIEVE THE GRADIENT FROM THE TOP OF THE WATER
underwater_gradient_deep:5, // GRADIENT DEPTH
underwater_top_color_deep:4, // TOP COLOR DEPTH
underwater_top_color:new THREE.Color(0.0,0.9,0.2), // TOP COLOR
underwater_bottom_color:new THREE.Color(0.0,0.45,0.45), // BOTTOM COLOR
underwater_sun_flare_color:new THREE.Color(1.0,1.0,0.2), // SUN FLARE COLOR
underwater_sun_flare_intensity:0.5, // SUN FLARE INTENSITY
underwater_darkness_deep:20, // DEPTH OF DARKNESS
underwater_depth_distance:30, // DEPTH TRANSPARENCY
gamma:{value:1.0}, // GAMMA
saturation:{value:1.0}, // SATURATION
normal_far_smoothing:{value:[250,200]}, // FAR NORMAL SMOOTHING [DISTANCE FROM,EXTENSION]
sky_far_mix_value:{value:[450,500]}, // MIXING SKY WITH WATER IN THE DISTANCE [DISTANCE FROM,DISTANCE TO]
// SHOULD I USE THESE FUNCTIONS?
use_transparent_style:false, // FALSE - NORMAL WATER, TRUE - COMPLETELY TRANSPARENT
refraction:1, // 0 - DO NOT USE REFRACTION, 1 - USE BUT FLAT FROM 2 TRIANGLES, 2 - FROM ALL TRIANGLES OF WAVES
use_waves:false, // GERSTNER WAVES
use_sss:false, // SUBSURFACE LIGHT SCATTERING
use_shore_smoothing:true, // SHORE SMOOTHING
use_caustics:true, // CAUSTICS
use_fog:true, // FOG
use_wave_color:true, // WAVE COLOR
use_foam_waves:true, // FOAM ON WAVES
use_foam_shore:true, // FOAM AT THE SHORE AND OBJECTS
use_gamma:false, // GAMMA
use_saturation:false, // SATURATION
use_back:true, // BACK SIDE
use_shadows:true, // SHADOWS
use_sky_far_mix:true, // MIXING THE SKY WITH THE WATER IN THE DISTANCE
use_specular:true, // SUN GLARE
use_phong_simple:true, // SIMPLE PHONG INTENSITY
use_scattering:true, // LIGHT SCATTERING INTENSITY
use_shore_transparent:true, // SHORE TRANSPARENCY
use_underwater_sun_flare:true, // UNDERWATER SUN FLARE
}


water["ocean"]={ // DO NOT CHANGE ocean NAME
hide:mesh["hide_ocean_waterline"], // GEOMETRY WHERE THE OCEAN WATERLINE SHOULD NOT BE SO IT DOESN'T APPEAR ON THE LAKE. OR null
position:{y:-1}, // POSITION BY HEIGHT
deep:500, // DEPTH
cells_size:2.0, // CELL SIZE OF THE FIRST LOD IN METERS. ALLOWED SIZES: 0.125,0.25,0.5,1,2,4,8,16,32,64
//IF YOU NEED A FLAT OCEAN OF 2 TRIANGLES, THEN SET cells_size:500, cells_amount:1, lod:[], use_waves:false
//PICK AN EVEN NUMBER OF CELLS AT WHICH THE OCEAN TRIANGLES WILL NOT OVERLOAD EACH OTHER, FOR EXAMPLE, cells_amount IS NOT 50, BUT 40
cells_amount:100, // EVEN NUMBER OF CELLS IN THE FIRST LOD
lod:[80,10], // NUMBER OF LOD CELLS. MAXIMUM 2 LOD
last_lod_stretch:50, // HOW MANY METERS TO STRETCH THE CELLS OF THE LAST LOD TO COVER THE VIEW RANGE AND SAVE TRIANGLES
// GERSTNER WAVES
//gerstner_waves:gerstner_waves_gen(12,1.1,0,1232.399963,0.02,5).concat(gerstner_waves_gen(3,1.3,0,1232.399963,0.05,60)),
gerstner_waves:[new THREE.Vector4(-1.0,-1.0,0.05,60.0),new THREE.Vector4(-1.0,-0.6,0.05,31.0),new THREE.Vector4(-1.0,-1.3,0.05,18.0)],
gerstner_waves_speed:{value:0.001}, // WAVE SPEED
ocean_move:16, // STEP OF FOLLOWING THE OCEAN CAMERA SO THAT THE JERKING IS NOTICEABLE
water_top_color:{value:new THREE.Color(0.0,0.96,0.48).convertSRGBToLinear()}, // WATER TOP COLOR	
water_bottom_color:{value:new THREE.Color(0.0,0.4,0.2).convertSRGBToLinear()}, // WATER BOTTOM COLOR		
shore_transparent:{value:0.4}, // SHORE TRANSPARENCY 0-1
wave_color:{value:new THREE.Color(0.0,0.6,0.0).convertSRGBToLinear()}, // WAVE COLOR
wave_color_power:{value:1.5}, // WAVE COLOR FRINEL
sss_color:{value:new THREE.Color(0.0,0.5,0.0)}, // SUBSURFACE LIGHT SCATTERING COLOR
sss_value:{value:[0.66,5.0,10.0,0.01]}, // SUBSURFACE LIGHT SCATTERING [DISTORTION,FRESNEL,INTENSITY,REDUCE SUN HEIGHT TO MAINTAIN EFFECT]
shore_smoothing_intensity:{value:10.0}, // SHORE SMOOTHING
refraction_value:{value:[0.05,10.0]}, // REFRACTION [INTENSITY,REFRACTION REDUCTION NEAR THE SHORE]
// NORMAL
normal_a_value:{value:[0.2,0,0.00015]}, // SHALLOW NORMAL A [SCALE,VELOCITY X,VELOCITY Z]
normal_b_value:{value:[0.1,0,-0.00010]}, // SHALLOW NORMAL B [SCALE,X-SPEED,Z-SPEED]
normal_ab:{value:1.0}, // FLIP THE Y NORMAL BY -1. AS WELL AS DECREASE IN INTENSITY
normal_c_value:{value:[0.02,0,0.00010]}, // BIG NORMAL C [SCALE,X-SPEED,Z-SPEED]
normal_d_value:{value:[0.01,0,-0.00005]}, // BIG NORMAL D [SCALE,X-SPEED,Z-SPEED]
normal_cd:{value:1.0}, // FLIP THE Y NORMAL BY -1. AND ALSO DECREASE INTENSITY
normal_small_far_total:{value:[0.5,0.1]}, // HOW MUCH TO MIX THE SMALL NORMAL WITH THE BIG NORMAL, AND HOW MUCH TO MIX THEM WITH THE WAVE APEX
// REFLECTION
env_mix:{value:1.0}, // HOW STRENGTHLY TO MIX THE BASE NORMAL WITH THE TEXTURE NORMAL
env_melt:{value:1.0}, // IF THE NORMAL TEXTURE IS SHARP, THEN THE BLUE FROM THE SKY IS VISIBLE, TO REDUCE IT, WE INCREASE THIS VALUE
env_fresnel_min:{value:0.01}, // MINIMUM FRESNEL
env_fresnel_power:{value:5.0}, // FRESNEL POWER
env_intensity:{value:1.0}, // SKY REFLECTION BRIGHTNESS
env_max:{value:1.0}, // MAXIMUM REFLECTION LEVEL
env_add_background:{value:0.0}, // HOW MUCH TO ADD WATER COLOR TO AFFECT REFLECTION
envMap:{value:scene_envMap_backed.textures[0]}, // REFLECTION TEXTURE
foam_shore_map:{value:tex["water_foam"]}, // TEXTURE OF FOAM SHORE
foam_wave_map:{value:tex["water_foam"]}, // WAVE FOAM TEXTURE
normal_map:{value:tex["water_normal"]}, // NORMAL TEXTURE OR null
holes_map:{value:tex["ocean_holes"]}, // BLACK AND WHITE TEXTURE FOR HOLES IN WATER, IF NOT NEEDED, THEN null
holes_pars:{value:[0.001,0.001,0.5,0.5]}, // [SCALE X, SCALE Z, OFFSET UV X, OFFSET UV Z]
depth_offset:{value:0.0}, // DEPTH OFFSET
depth_beers_law:{value:-0.1}, // TOP OF DEPTH
depth_distance:{value:2.5}, // DEPTH TRANSPARENCY
foam_waves_value:{value:[0.1,3.0,1.4]}, // FOAM ON WAVES [TEXTURE SCALE,STRENGTH,BRIGHTNESS]
foam_shore_value:{value:[1.0,0.4,0,0.00002]}, // FOAM AT THE SHORE [WIDTH,TEXTURE SCALE,X-SPEED,Z-SPEED]
specular:{value:[10,100,720]}, // SUN GLARE [INTENSITY,STRENGTH WHEN SUN IS HIGH,STRENGTH WHEN SUN IS ON THE HORIZON]
phong_simple_intensity:{value:0.5}, // SIMPLE PHONG INTENSITY
scattering_intensity:{value:0.5}, // LIGHT SCATTERING INTENSITY. IF YOU SET IT TO MUCH IT MAY LOOK LIKE PLASTIC
// CAUSTIC
caustics_map:{value:tex["water_caustic"]}, // CAUSTIC TEXTURE OR null
caustics_1_dir_speed:{value:[0,0.0001]}, // [X,Z] DIRECTION AND SPEED OF THE FIRST CAUSTICS
caustics_2_dir_speed:{value:[0,0.0002]}, // [X,Z] DIRECTION AND SPEED OF THE SECOND CAUSTICS
caustics_wave:{value:[1,0.1,0.001]}, // CAUSTIC WAVE [FREQUENCY, MAGNITUDE, SPEED AND DIRECTION]
caustics_intensity:{value:2}, // INTENSITY
caustics_scale_power:{value:[0.2,1]}, // SCALE, POWER OF MANIFESTATION
caustics_color:{value:new THREE.Color(1.0,1.0,0.4)}, // COLOR
// UNDER WATER
underwater_gradient_offset:1, // HOW MUCH TO RETRIEVE THE GRADIENT FROM THE TOP OF THE WATER
underwater_gradient_deep:5, // GRADIENT DEPTH
underwater_top_color_deep:4, // TOP COLOR DEPTH
underwater_top_color:new THREE.Color(0.0,0.9,0.2), // TOP COLOR
underwater_bottom_color:new THREE.Color(0.0,0.13,0.03), // BOTTOM COLOR
underwater_sun_flare_color:new THREE.Color(1.0,1.0,0.2), // SUN FLARE COLOR
underwater_sun_flare_intensity:0.5, // SUN FLARE INTENSITY
underwater_darkness_deep:20, // DEPTH OF DARKNESS
underwater_depth_distance:70, // DEPTH TRANSPARENCY
gamma:{value:1.0}, // GAMMA
saturation:{value:1.0}, // SATURATION
normal_far_smoothing:{value:[250,200]}, // FAR NORMAL SMOOTHING [DISTANCE FROM,EXTENSION]
sky_far_mix_value:{value:[450,500]}, // MIXING SKY WITH WATER IN THE DISTANCE [DISTANCE FROM,DISTANCE TO]
// SHOULD I USE THESE FUNCTIONS?
use_transparent_style:false, // FALSE - NORMAL WATER, TRUE - COMPLETELY TRANSPARENT
refraction:2, // 0 - DO NOT USE REFRACTION, 1 - USE BUT FLAT FROM 2 TRIANGLES, 2 - FROM ALL TRIANGLES WAVES
use_waves:true, // GERSTNER WAVES
use_sss:true, // SUBSURFACE LIGHT SCATTERING
use_shore_smoothing:true, // SHORE SMOOTHING
use_caustics:true, // CAUSTICS
use_fog:false, // FOG
use_wave_color:true, // WAVE COLOR
use_foam_waves:true, // FOAM ON WAVES
use_foam_shore:true, // FOAM AT THE SHORE AND OBJECTS
use_gamma:false, // GAMMA
use_saturation:false, // SATURATION
use_back:true, // BACK SIDE
use_shadows:true, // SHADOWS
use_sky_far_mix:true, // MIXING THE SKY WITH THE WATER IN THE DISTANCE
use_specular:true, // SUN GLARE
use_phong_simple:true, // SIMPLE PHONG INTENSITY
use_scattering:true, // LIGHT SCATTERING INTENSITY
use_shore_transparent:true, // SHORE TRANSPARENCY
use_underwater_sun_flare:true, // UNDERWATER SUN FLARE
}


// ____________________ CREATION OF MATERIALS ____________________


for(let i in water){


let water_item=water[i];


let material=mat[i]=new THREE.ShaderMaterial({
uniforms:{
position_from_depth_projection:{value:new THREE.Matrix4()},
shadowMap:{value:null},
screen_resolution:{value:null},
screen_texel_size:{value:null},
sun_direction:{value:[0,0,0]},
scene_map:{value:null},
scene_depth_map:{value:null},
water_depth_map:{value:null},
fogDensity:{value:0},
fogColor:{value:[0,0,0]},
fogNear:{value:0},
fogFar:{value:0},
time:{value:0},
},
defines:{
screen_normal_quality:2 // QUALITY OF NORMAL FROM DEPTH TEXTURE: 1 - LOW, 2 - MEDIUM, 3 - HIGH
},
vertexShader:vs["water"],
fragmentShader:fs["water"],
wireframe:water_debug,
side:2
});


if(water_item.use_fog){
if(scene.fog){
if(scene.fog.isFog){
material.fog=true;
material.defines.fog=true;
}
if(scene.fog.isFogExp2){
material.fog=true;
material.defines.fog_exp2=true;
}
}
}


if(water_item.refraction!=0){ material.defines.refraction_use=true; }
if(water_item.refraction==1){ material.defines.refraction_flat=true; }
if(!water_item.use_waves && water_item.refraction==2){ water_item.refraction=1; }
if(water_item.refraction!=0){ water_refaction_enabled=true; }
	

material.defines.use_wave_color=water_item.use_wave_color;
material.defines.use_foam_waves=water_item.use_foam_waves;
material.defines.use_foam_shore=water_item.use_foam_shore;
material.defines.use_gamma=water_item.use_gamma;
material.defines.use_saturation=water_item.use_saturation;
material.defines.use_sss=water_item.use_sss;
material.defines.use_caustics=water_item.use_caustics;
material.defines.use_transparent_style=water_item.use_transparent_style;
material.defines.use_back=water_item.use_back;
material.defines.use_sky_far_mix=water_item.use_sky_far_mix;
material.defines.use_shore_smoothing=water_item.use_shore_smoothing;
material.defines.use_specular=water_item.use_specular;
material.defines.use_phong_simple=water_item.use_phong_simple;
material.defines.use_scattering=water_item.use_scattering;
material.defines.use_shore_transparent=water_item.use_shore_transparent;


if(water_item.use_transparent_style){
water_item.underwater_gradient_deep=500;
water_item.underwater_darkness_deep=500;
water_item.underwater_depth_distance=500;
}


if(water_item.holes_map.value){ material.defines.holes=true; }


let u=material.uniforms;


let gerstner_waves_amount=water_item.gerstner_waves.length;


// NORMALIZING THE DIRECTION OF GERSTNER WAVES
for(let n=0;n<gerstner_waves_amount;n++){
let item=water_item.gerstner_waves[n];
let length=1/Math.sqrt(item.x*item.x+item.y*item.y);
item.x*=length;
item.y*=length;
}


// CREATING GERSTNER WAVES FOR CALCULATIONS


water_item.waves=[];


let waves_amplitude=0;
let waves_dx=0;
let waves_dz=0;
let waves_d_max=0;


if(water_item.use_waves){
for(let n=0;n<gerstner_waves_amount;n++){
let item=water_item.gerstner_waves[n];
let k=6.283185307179586/item.w;
let c=Math.sqrt(9.8/k);
let a=item.z/k; // AMPLITUDE, MAXIMUM HEIGHT
let dx=Math.abs(a*item.x); // MAXIMUM X OFFSET
let dz=Math.abs(a*item.y); // MAXIMUM Z-OFFSET
let d_max=Math.max(dx,dz); // MAXIMUM SQUARE OFFSET FOR CALCULATION OF WATERLINE GEOMETRY DIMENSIONS
waves_amplitude+=a;
waves_dx+=dx;
waves_dz+=dz;
waves_d_max+=d_max;
water_item.waves.push({x:item.x,y:item.y,k:k,c:c,a:a,dx:dx,dz:dz,d_max:d_max});
}
}


water_item.waves_amplitude=waves_amplitude;
water_item.waves_dx=waves_dx;
water_item.waves_dz=waves_dz;
water_item.waves_d_max=waves_d_max;


// FOLLOWING THE WATER LINE WITH THE CAMERA STEP
if(i!=="ocean"){ water_item.waterline_move=water_item.cells_size[0][0]; }
else{ water_item.waterline_move=water_item.cells_size; }
if(!water_item.use_waves){ water_item.waterline_move=0.1; }


u.gerstner_waves={value:water_item.gerstner_waves};	
material.defines.waves_amount=gerstner_waves_amount;
material.defines.use_waves=water_item.use_waves;


u.gerstner_waves_speed=water_item.gerstner_waves_speed;
u.water_top_color=water_item.water_top_color;		
u.water_bottom_color=water_item.water_bottom_color;
u.wave_color=water_item.wave_color;
u.wave_color_power=water_item.wave_color_power;
u.sss_color=water_item.sss_color;
u.sss_value=water_item.sss_value;
u.shore_smoothing_intensity=water_item.shore_smoothing_intensity;
u.env_mix=water_item.env_mix;
u.env_melt=water_item.env_melt;
u.env_fresnel_min=water_item.env_fresnel_min;
u.env_fresnel_power=water_item.env_fresnel_power;
u.env_intensity=water_item.env_intensity;
u.env_max=water_item.env_max;
u.env_add_background=water_item.env_add_background;
u.envMap=water_item.envMap;
u.foam_shore_map=water_item.foam_shore_map;
u.foam_wave_map=water_item.foam_wave_map;
u.normal_map=water_item.normal_map;
u.caustics_map=water_item.caustics_map;
u.caustics_1_dir_speed=water_item.caustics_1_dir_speed;
u.caustics_2_dir_speed=water_item.caustics_2_dir_speed;
u.caustics_wave=water_item.caustics_wave;
u.caustics_intensity=water_item.caustics_intensity;
u.caustics_scale_power=water_item.caustics_scale_power;
u.caustics_color=water_item.caustics_color;
u.depth_offset=water_item.depth_offset;
u.depth_beers_law=water_item.depth_beers_law;
u.depth_distance=water_item.depth_distance;
u.holes_map=water_item.holes_map;
u.holes_pars=water_item.holes_pars;
if(water_item.use_gamma){ u.gamma=water_item.gamma; }
if(water_item.use_saturation){ u.saturation=water_item.saturation; }
u.foam_waves_value=water_item.foam_waves_value;
u.foam_shore_value=water_item.foam_shore_value;
u.specular=water_item.specular;
u.phong_simple_intensity=water_item.phong_simple_intensity;
u.scattering_intensity=water_item.scattering_intensity;
u.shore_transparent=water_item.shore_transparent;
u.refraction_value=water_item.refraction_value;
u.normal_a_value=water_item.normal_a_value;
u.normal_b_value=water_item.normal_b_value;
u.normal_ab=water_item.normal_ab;
u.normal_c_value=water_item.normal_c_value;
u.normal_d_value=water_item.normal_d_value;
u.normal_cd=water_item.normal_cd;
u.normal_small_far_total=water_item.normal_small_far_total;
u.sun_color={value:[0,0,0]};
u.normal_far_smoothing=water_item.normal_far_smoothing;
u.sky_far_mix_value=water_item.sky_far_mix_value;
u.sun_direction.value=sun_direction;
u.sun_color.value=sun.color;
u.scene_map.value=water_rtt_scene.texture;
u.scene_depth_map.value=water_rtt_scene.depthTexture;
u.water_depth_map.value=water_rtt_refraction.depthTexture;


// TO GET SHADOWS
if(water_item.use_shadows){
material.lights=true;
material.defines.use_shadows=true;
}
	
	
// ADDING SHADOW PARAMETERS. TAKEN FROM THE PLACE WHERE THE CODE IS: if ( materialProperties.needsLights ) {
if(material.lights){
u.ambientLightColor={value:null};
u.lightProbe={value:null};
u.directionalLights={value:null};
u.directionalLightShadows={value:null};
u.spotLights={value:null};
u.spotLightShadows={value:null};
u.rectAreaLights={value:null};
u.ltc_1={value:null};
u.ltc_2={value:null};
u.pointLights={value:null};
u.pointLightShadows={value:null};
u.hemisphereLights={value:null};
u.directionalShadowMap={value:null};
u.directionalShadowMatrix={value:null};
u.spotShadowMap={value:null};
u.spotLightMatrix={value:null};
u.spotLightMap={value:null};
u.pointShadowMap={value:null};
u.pointShadowMatrix={value:null};
}


if(i=="ocean"){
u.move={value:[0,0,0]};
material.defines.ocean=true;
}


}


}


// GERSTNER WAVE GENERATOR. EXAMPLE: gerstner_waves_gen(12,1.1,0,1232.399963,0.02,5);


function gerstner_waves_gen(amount,multiply_frequency,iteration,add_iteration,steepness,frequency){


let waves=[];
for(let n=0;n<amount;n++){
waves.push(new THREE.Vector4(-Math.sin(iteration),-Math.cos(iteration),steepness,frequency));
frequency*=multiply_frequency;
iteration+=add_iteration;	
}
return waves;


}