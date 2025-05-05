<?php


echo '<!DOCTYPE HTML>
<html>
<head>
<title>GEAR</title>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="shortcut icon" href="./images/favicon.png" type="image/x-icon" />
<link href="./css/style.css" rel="stylesheet" type="text/css">
</head>


<body>


<div id="project" style="font-family:tahoma;">


<div id="voice_status" class="voice_status" style="display:block;">Micro off</div>
<div id="status_i_ray_sphere" class="status_i_ray_sphere"></div>
<div id="status_i_ray_AABB" class="status_i_ray_AABB"></div>
<div class="health_common" style="display:block;"><div class="health_pad"><div class="health_value"></div></div></div>
<div class="ammo_common"><div class="ammo_count">30</div><div class="ammo_title">Bullets</div></div>
<div class="grenade_common"><div class="grenade_count">4</div><div class="grenade_title">Grenades</div></div>
<div id="statistic" class="statistic">


<table class="loop_time" cellpadding="0px" cellspacing="0px">
<tr><td>TOTAL:</td><td>JS:</td><td>RENDER</td></tr>
<tr><td id="total_frame"></td><td id="loop_js_time"></td><td id="loop_render"></td></tr>
</table>


<div id="section_pass" class="section_pass">&nbsp;</div>
<table class="my_pos" cellpadding="0px" cellspacing="0px">
<tr><td>POSITION:</td><td id="my_pos_x"></td><td id="my_pos_y"></td><td id="my_pos_z"></td></tr>
</table>
<table class="section_100" cellpadding="0px" cellspacing="0px">
<tr><td>SECTION&nbsp;100:</td><td id="section_100_x"></td><td id="section_100_z"></td></tr>
</table>
<div class="raycast">Raycast: <span id="raycast"></span></div>
<div class="sprites">Sprites: <span id="sprites"></span></div>
<div class="closest_point">Closest: <span id="closest_point"></span></div>
<div class="shadow_ground"><div id="shadow_ground_text_1"></div><div id="shadow_ground_text_2">&nbsp;</div></div>
</div>


<div id="loading" style="position:absolute;display:block;top:50%;width:100%;text-align:center;font-family:arial;font-size:40px;color:#ffffff;text-shadow:1px 1px 4px #393342;">LOADED <span id="loading_amount" style="font-family:arial;font-size:40px;"></span></div>
<div id="begin" style="cursor:pointer;position:absolute;display:none;top:50%;width:100%;text-align:center;font-family:arial;font-size:40px;color:#ffffff;text-shadow:1px 1px 4px #393342;">START</div>
<canvas id="canvas" style="display:block;"></canvas>
</div>


<script type="importmap">
{
"imports":{
"three": "./js/0_three/three_172.js",
"three/addons/": "./js/0_three/"
}
}
</script>


<script type="module">


"use strict"


import * as THREE from "three";
import Stats from "./js/stats/stats.js";
import GPUStatsPanel from "./js/stats/GPUStatsPanel.js";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import * as THREE_BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import * as THREE_OBJLoader from "three/addons/loaders/OBJLoader.js"; // MODIFIED
import * as THREE_FBXLoader from "three/addons/loaders/FBXLoader.js"; // MODIFIED
import * as THREE_RGBELoader from "three/addons/loaders/RGBELoader.js";
import * as THREE_UltraHDRLoader from "three/addons/loaders/UltraHDRLoader.js";
import {LightProbeHelper} from "three/addons/helpers/LightProbeHelper.js";
import {LightProbeGenerator} from "three/addons/lights/LightProbeGenerator.js";
import {PositionalAudioHelper} from "three/addons/helpers/PositionalAudioHelper.js";


import {EffectComposer} from "three/addons/postprocessing/EffectComposer.js";
import {RenderPass} from "three/addons/postprocessing/RenderPass.js";
import {ShaderPass} from "three/addons/postprocessing/ShaderPass.js"; // MODIFIED
import {UnrealBloomPass} from "three/addons/postprocessing/UnrealBloomPass.js";
import {FXAAShader} from "three/addons/shaders/FXAAShader.js";


import underwater_shader from "./shaders/underwater_pass.js";
import underwater_ripples_shader from "./shaders/underwater_ripples_pass.js";
import correction_shader from "./shaders/correction_pass.js";
import {materials_duplicates_remover} from "./js/utils/materials_duplicates_remover.js";
import {lightMap} from "./js/utils/lightMap.js";
import {intersection_ray_AABB} from "./js/ray/intersection_ray_AABB.js";
import {intersection_ray_sphere} from "./js/ray/intersection_ray_sphere.js";
import {intersection_ray_triangle} from "./js/ray/intersection_ray_triangle.js";
import {closest_point_same_side,closest_point_to_segment,closest_point_to_sides,closest_point_to_triangle,closest_point_search,closest_point_type_1,closest_point} from "./js/closest_point.js";
import {set_crosshair} from "./js/objects/crosshair.js";
import {set_sprite} from "./js/objects/sprite.js";


';


$js_files=array(
'./js/stats/renderer_stats.js',


'./js/shadow_ground.js',

'./js/sounds.js',
'./js/lights.js',
'./js/sounds_list.js',
'./js/loader.js',
'./js/common.js',
'./js/init_core.js',
'./js/init_end.js',

'./js/press_q.js',


'./shaders/water.js',
'./shaders/waterline.js',
'./shaders/water_refraction.js',
'./shaders/crosshair.js',
'./shaders/overlay_damage_blood.js',
'./shaders/sprite.js',
'./shaders/sprite_additive.js',
'./shaders/stone.js',
'./shaders/wall.js',
'./shaders/basic_ao.js',
'./shaders/grass.js',
'./shaders/tree_basic.js',
'./shaders/tree_sprite.js',
'./shaders/terrain_single.js',
'./shaders/terrain_triplanar.js',


'./js/waters_list.js',
'./js/water_core.js',


'./js/voice.js',
'./js/ajax.js',
'./js/loop.js',


'./js/instances_gen.js',
'./js/instances_section_pass.js',


'./js/textures_list.js',


'./js/models/models_list.js',
'./js/models/common.js',
'./js/models/lightmap.js',
'./js/models/jetski.js',
'./js/models/soldier.js',
'./js/models/gun.js',
'./js/models/ammo.js',
'./js/models/uaz.js',
'./js/models/ship_cruise.js',
'./js/models/wolf.js',
'./js/models/gull.js',
'./js/models/grass_long.js',


);


foreach($js_files as $i){
echo file_get_contents($i);
}


echo '</script>
</body>
</html>';


?>
