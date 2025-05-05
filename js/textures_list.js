let maxanisotropy=renderer.capabilities.getMaxAnisotropy();
let vegetation_anisotropy=4;
if(vegetation_anisotropy>maxanisotropy){ vegetation_anisotropy=maxanisotropy; }


let tex=[];
let texture_loader=new THREE.TextureLoader(loadingManager);
let RGBELoader=new THREE_RGBELoader.RGBELoader(loadingManager);
let UltraHDRLoader=new THREE_UltraHDRLoader.UltraHDRLoader(loadingManager);
UltraHDRLoader.setDataType(THREE.FloatType);


tex["sky"]=RGBELoader.load("./images/sky/pizzo_pernice_puresky_1k.hdr");
tex["sky"].mapping=THREE.EquirectangularReflectionMapping;
environment_main=tex["sky"];


tex["shadow"]=texture_loader.load("./images/shadow.png");

tex["shadow_tree"]=texture_loader.load("./images/shadow_tree.png");

tex["crosshair"]=texture_loader.load("./images/crosshair.png");


tex["overlay_damage_blood"]=texture_loader.load("./images/effects/overlay_damage_blood.png");
tex["overlay_damage_blood"].colorSpace=THREE.SRGBColorSpace;


tex["ground_1_diffuse"]=texture_loader.load("./images/ground/ground_1_diffuse.jpg");
tex["ground_1_diffuse"].wrapS=tex["ground_1_diffuse"].wrapT=THREE.RepeatWrapping;
tex["ground_1_diffuse"].repeat.set(50,50);
tex["ground_1_diffuse"].colorSpace=THREE.SRGBColorSpace;
tex["ground_1_normal"]=texture_loader.load("./images/ground/ground_1_normal.png");
tex["ground_1_normal"].wrapS=tex["ground_1_normal"].wrapT=THREE.RepeatWrapping;
tex["ground_1_normal"].repeat.set(50,50);
tex["ground_1_roughness"]=texture_loader.load("./images/ground/ground_1_roughness.jpg");
tex["ground_1_roughness"].wrapS=tex["ground_1_roughness"].wrapT=THREE.RepeatWrapping;
tex["ground_1_roughness"].repeat.set(50,50);
//tex["ground_1_ao"]=texture_loader.load("./images/ground/ground_1_ao.jpg");
//tex["ground_1_ao"].wrapS=tex["ground_1_ao"].wrapT=THREE.MirroredRepeatWrapping;
//tex["ground_1_ao"].repeat.set(0.2,0.2);


tex["bb_diffuse"]=texture_loader.load("./images/rock/bb_diffuse.png");
tex["bb_diffuse"].wrapS=tex["bb_diffuse"].wrapT=THREE.RepeatWrapping;
tex["bb_diffuse"].repeat.set(10,10);
tex["bb_normal"]=texture_loader.load("./images/rock/bb_normal.png");
tex["bb_normal"].wrapS=tex["bb_normal"].wrapT=THREE.RepeatWrapping;


tex["terrain_grass"]=texture_loader.load("./images/ground/ground_grass.png");
tex["terrain_grass"].wrapS=tex["terrain_grass"].wrapT=THREE.RepeatWrapping;


tex["terrain_dirt"]=texture_loader.load("./images/crosshair.png");
tex["terrain_dirt"].wrapS=tex["terrain_dirt"].wrapT=THREE.RepeatWrapping;


tex["terrain_noise"]=texture_loader.load("./images/ground/terrain_noise.png");
tex["terrain_noise"].wrapS=tex["terrain_noise"].wrapT=THREE.RepeatWrapping;


tex["terrain_noise_2"]=texture_loader.load("./images/ground/terrain_noise_2.png");
tex["terrain_noise_2"].wrapS=tex["terrain_noise_2"].wrapT=THREE.RepeatWrapping;


tex["terrain_grass_normal"]=texture_loader.load("./images/crosshair.png");
tex["terrain_grass_normal"].wrapS=tex["terrain_grass_normal"].wrapT=THREE.RepeatWrapping;


tex["dirt"]=texture_loader.load("./images/ground/dirt.jpg");
tex["dirt"].wrapS=tex["dirt"].wrapT=THREE.RepeatWrapping;
tex["dirt"].colorSpace=THREE.SRGBColorSpace;


tex["stone_2_d"]=texture_loader.load("./images/rock/bb_diffuse.png");
tex["stone_2_d"].wrapS=tex["stone_2_d"].wrapT=THREE.RepeatWrapping;
tex["stone_2_d"].repeat.set(8,8);
tex["stone_2_d"].colorSpace=THREE.SRGBColorSpace;
tex["stone_2_n"]=texture_loader.load("./images/rock/bb_normal.png");
tex["stone_2_n"].wrapS=tex["stone_2_n"].wrapT=THREE.RepeatWrapping;
tex["stone_2_n"].repeat.set(8,8);


tex["grass_n"]=texture_loader.load("./images/ground/grass_46.png");
tex["grass_n"].wrapS=tex["grass_n"].wrapT=THREE.RepeatWrapping;


tex["ground_22"]=texture_loader.load("./images/ground/ground_22.png");
tex["ground_22"].wrapS=tex["ground_22"].wrapT=THREE.RepeatWrapping;
tex["ground_24"]=texture_loader.load("./images/ground/ground_22.png");
tex["ground_24"].wrapS=tex["ground_24"].wrapT=THREE.RepeatWrapping;
tex["ground_23"]=texture_loader.load("./images/ground/ground_23.png");
tex["ground_23"].wrapS=tex["ground_23"].wrapT=THREE.RepeatWrapping;


tex["wall_237"]=texture_loader.load("./images/wall/wall_237.png");
tex["wall_237"].colorSpace=THREE.SRGBColorSpace;
tex["wall_238_n"]=texture_loader.load("./images/wall/wall_238_n.png");
tex["wall_237"].wrapS=tex["wall_237"].wrapT=THREE.RepeatWrapping;
tex["wall_238_n"].wrapS=tex["wall_238_n"].wrapT=THREE.RepeatWrapping;


tex["ground_63"]=texture_loader.load("./images/ground/ground_63.png");
tex["ground_63"].wrapS=tex["ground_63"].wrapT=THREE.RepeatWrapping;


tex["wall_277"]=texture_loader.load("./images/wall/wall_277.png");
tex["wall_277"].colorSpace=THREE.SRGBColorSpace;
tex["wall_278"]=texture_loader.load("./images/wall/wall_278.png");
tex["wall_279"]=texture_loader.load("./images/wall/wall_279.png");


tex["smoke"]=texture_loader.load("./images/sprite/smoke.png");
tex["cloud"]=texture_loader.load("./images/sprite/cloud.png");
tex["cloud"].flipY=false;
tex["cloud"].needsUpdate=true;
tex["fire"]=texture_loader.load("./images/sprite/fire.png");
tex["sprite_yellow"]=texture_loader.load("./images/sprite/sprite_yellow.png");
tex["beam"]=texture_loader.load("./images/sprite/beam.png");
tex["flare_blue"]=texture_loader.load("./images/sprite/flare_blue.jpg");
tex["glass_1"]=texture_loader.load("./images/sprite/glass_1.jpg");
tex["window"]=texture_loader.load("./images/sprite/window.png");
tex["spark"]=texture_loader.load("./images/sprite/spark.png");
tex["shot"]=texture_loader.load("./images/sprite/shot.png");
tex["water_drop"]=texture_loader.load("./images/sprite/water_drop.png");
tex["water_drop"].wrapS=tex["water_drop"].wrapT=THREE.RepeatWrapping;
tex["homer"]=texture_loader.load("./images/sprite/homer.png");
tex["avatar"]=texture_loader.load("./images/sprite/avatar.png");
tex["tracer"]=texture_loader.load("./images/sprite/tracer.png");
tex["water_splash"]=texture_loader.load("./images/sprite/water_splash.png");


tex["ocean_holes"]=texture_loader.load("./images/water/ocean_holes.png");
tex["ocean_holes"].format=THREE.RedFormat; // УБИРАЕМ ЛИШНИИ ЦВЕТА И ЗАОДНО УМЕНЬШАЕМ ЗАНИМАЕМОЕ МЕСТО НА ВИДЕОКАРТЕ
tex["ocean_holes"].minFilter=tex["ocean_holes"].magFilter=THREE.NearestFilter; // ЧТОБЫ НЕ БЫЛО ДЕФЕКТОВ НА РАССТОЯНИИ
tex["water_foam"]=texture_loader.load("./images/water/water_foam.png");
tex["water_foam"].wrapS=tex["water_foam"].wrapT=THREE.RepeatWrapping;
tex["water_foam"].colorSpace=THREE.SRGBColorSpace;
tex["water_normal"]=texture_loader.load("./images/water/water_normal.png");
tex["water_normal"].wrapS=tex["water_normal"].wrapT=THREE.RepeatWrapping;
tex["water_caustic"]=texture_loader.load("./images/water/water_caustic.png");
tex["water_caustic"].wrapS=tex["water_caustic"].wrapT=THREE.RepeatWrapping;
tex["water_caustic"].colorSpace=THREE.SRGBColorSpace;
tex["underwater_ripples"]=texture_loader.load("./images/water/underwater_ripples.png");
tex["underwater_ripples"].wrapS=tex["underwater_ripples"].wrapT=THREE.RepeatWrapping;
tex["underwater_eyes"]=texture_loader.load("./images/water/underwater_eyes.png");
tex["underwater_eyes"].wrapS=tex["underwater_eyes"].wrapT=THREE.RepeatWrapping;


tex["bump_normal"]=texture_loader.load("./images/bump_normal.png");


tex["env_sunny"]=texture_loader.load("./images/env_sunny.jpg");
tex["env_sunny"].mapping=THREE.EquirectangularRefractionMapping;
tex["env_sunny"].colorSpace=THREE.SRGBColorSpace;


tex["jetski"]=texture_loader.load("./models/jetski/jetski.jpg");
tex["jetski"].colorSpace=THREE.SRGBColorSpace;


tex["ammo_d"]=texture_loader.load("./models/ammo/ammo_d.png");
tex["ammo_d"].colorSpace=THREE.SRGBColorSpace;
tex["ammo_ao"]=texture_loader.load("./models/ammo/ammo_ao.png");
tex["ammo_items"]=texture_loader.load("./models/ammo/ammo_items.png");
tex["ammo_items"].colorSpace=THREE.SRGBColorSpace;
tex["ammo_ms"]=texture_loader.load("./models/ammo/ammo_ms.jpg");
tex["ammo_n"]=texture_loader.load("./models/ammo/ammo_n.png");


tex["soldier_body_d"]=texture_loader.load("./models/soldier/soldier_body_d.png");
tex["soldier_body_d"].colorSpace=THREE.SRGBColorSpace;
tex["soldier_body_d"].wrapS=tex["soldier_body_d"].wrapT=THREE.RepeatWrapping;
tex["soldier_body_n"]=texture_loader.load("./models/soldier/soldier_body_n.png");
tex["soldier_body_s"]=texture_loader.load("./models/soldier/soldier_body_s.png");
tex["soldier_head_d"]=texture_loader.load("./models/soldier/soldier_head_d.png");
tex["soldier_head_d"].colorSpace=THREE.SRGBColorSpace;
tex["soldier_head_n"]=texture_loader.load("./models/soldier/soldier_head_n.png");
tex["soldier_head_s"]=texture_loader.load("./models/soldier/soldier_head_s.png");


tex["gun_ao"]=texture_loader.load("./models/gun/gun_ao.png");
tex["gun_d"]=texture_loader.load("./models/gun/gun_d.png");
tex["gun_d"].colorSpace=THREE.SRGBColorSpace;
tex["gun_m"]=texture_loader.load("./models/gun/gun_m.png");
tex["gun_n"]=texture_loader.load("./models/gun/gun_n.png");
tex["gun_r"]=texture_loader.load("./models/gun/gun_r.png");


tex["uaz_d"]=texture_loader.load("./models/uaz/uaz_d.jpg");
tex["uaz_d"].colorSpace=THREE.SRGBColorSpace;
tex["uaz_n"]=texture_loader.load("./models/uaz/uaz_n.jpg");
tex["uaz_s"]=texture_loader.load("./models/uaz/uaz_s.jpg");
tex["uaz_m"]=texture_loader.load("./models/uaz/uaz_m.jpg");
tex["uaz_ao"]=texture_loader.load("./models/uaz/uaz_ao.jpg");
tex["uaz_o"]=texture_loader.load("./models/uaz/uaz_o.jpg");


tex["uaz_glass_d"]=texture_loader.load("./models/uaz/uaz_glass_d.jpg");
tex["uaz_glass_d"].colorSpace=THREE.SRGBColorSpace;
tex["uaz_glass_n"]=texture_loader.load("./models/uaz/uaz_glass_n.jpg");
tex["uaz_glass_s"]=texture_loader.load("./models/uaz/uaz_glass_s.jpg");
tex["uaz_glass_m"]=texture_loader.load("./models/uaz/uaz_glass_m.jpg");
tex["uaz_glass_ao"]=texture_loader.load("./models/uaz/uaz_glass_ao.jpg");
tex["uaz_glass_o"]=texture_loader.load("./models/uaz/uaz_glass_o.jpg");


tex["wolf"]=texture_loader.load("./models/wolf/STANDARD_WOLF_C.png");
tex["wolf"].colorSpace=THREE.SRGBColorSpace;


tex["gull_d"]=texture_loader.load("./models/gull/gull_d.jpg");
tex["gull_d"].colorSpace=THREE.SRGBColorSpace;


tex["wall_118"]=texture_loader.load("./images/wall/wall_118.jpg");
tex["wall_118"].colorSpace=THREE.SRGBColorSpace;
tex["wall_118"].wrapS=tex["wall_118"].wrapT=THREE.RepeatWrapping;


tex["grass_long_1"]=texture_loader.load("./images/grass/grass_150.png");
tex["grass_long_1"].anisotropy=vegetation_anisotropy;
tex["grass_long_1"].colorSpace=THREE.SRGBColorSpace;


tex["grass_color"]=texture_loader.load("./images/ground/grass_color.png");


tex["wind"]=texture_loader.load("./images/wind.png");
tex["wind"].wrapS=tex["wind"].wrapT=THREE.RepeatWrapping;




tex["wall_108"]=texture_loader.load("./images/wall/wall_108.jpg");
tex["wall_108"].wrapS=tex["wall_108"].wrapT=THREE.RepeatWrapping;
tex["wall_108"].colorSpace=THREE.SRGBColorSpace;
tex["wall_276"]=texture_loader.load("./images/wall/wall_276.jpg");
tex["wall_276"].colorSpace=THREE.SRGBColorSpace;
tex["home_roof"]=texture_loader.load("./images/home/home_roof.jpg");
tex["home_roof"].wrapS=tex["home_roof"].wrapT=THREE.RepeatWrapping;
tex["home_roof"].colorSpace=THREE.SRGBColorSpace;


tex["pinetree"]=texture_loader.load("./images/tree/pinetree.png");
tex["pinetree"].colorSpace=THREE.SRGBColorSpace;


tex["017_color"]=texture_loader.load("./images/tiles/017_color.jpg");
tex["017_color"].wrapS=tex["017_color"].wrapT=THREE.RepeatWrapping;
tex["017_color"].repeat.set(200,200);
tex["017_normal"]=texture_loader.load("./images/tiles/017_normal.png");
tex["017_normal"].wrapS=tex["017_normal"].wrapT=THREE.RepeatWrapping;


tex["specular_test"]=texture_loader.load("./images/specular_test.png");
tex["specular_test"].wrapS=tex["specular_test"].wrapT=THREE.RepeatWrapping;


tex["stoneVRayRawTotalLightingMap"]=RGBELoader.load("./images/lightmap/stoneVRayRawTotalLightingMap.hdr");
tex["boxVRayRawTotalLightingMap"]=RGBELoader.load("./images/lightmap/boxVRayRawTotalLightingMap.hdr");
tex["Cylinder_014VRayRawTotalLightingMap"]=RGBELoader.load("./images/lightmap/Cylinder_014VRayRawTotalLightingMap.hdr");
tex["home001VRayRawTotalLightingMap"]=RGBELoader.load("./images/lightmap/home001VRayRawTotalLightingMap.hdr");
tex["pinetree001VRayRawTotalLightingMap"]=RGBELoader.load("./images/lightmap/pinetree001VRayRawTotalLightingMap.hdr");
tex["homeVRayRawTotalLightingMap"]=RGBELoader.load("./images/lightmap/homeVRayRawTotalLightingMap.hdr");
tex["wall_001VRayRawTotalLightingMap"]=RGBELoader.load("./images/lightmap/wall_001VRayRawTotalLightingMap.hdr");
tex["wall_002VRayRawTotalLightingMap"]=RGBELoader.load("./images/lightmap/wall_002VRayRawTotalLightingMap.hdr");
tex["wall_003VRayRawTotalLightingMap"]=RGBELoader.load("./images/lightmap/wall_003VRayRawTotalLightingMap.hdr");
tex["Box002VRayRawTotalLightingMap"]=RGBELoader.load("./images/lightmap/Box002VRayRawTotalLightingMap.hdr");
tex["Box003VRayRawTotalLightingMap"]=RGBELoader.load("./images/lightmap/Box003VRayRawTotalLightingMap.hdr");
tex["terrainVRayRawTotalLightingMap"]=RGBELoader.load("./images/lightmap/terrainVRayRawTotalLightingMap.hdr");
tex["Box004VRayRawTotalLightingMap"]=RGBELoader.load("./images/lightmap/Box004VRayRawTotalLightingMap.hdr");


// https://github.com/MONOGRID/gainmap-js/
// https://gainmap-creator.monogrid.com/
tex["bbb"]=UltraHDRLoader.load("./images/lightmap/Box002VRayRawTotalLightingMap.jpg");



