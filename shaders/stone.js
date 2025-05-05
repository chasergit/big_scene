vs["stone"]=`


varying vec2 vUv;
attribute vec2 uv2;
varying vec2 vUv2;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vLightDir;
varying vec3 vViewPosition;
varying float fogFactor;
vec3 lightPosition=vec3(60.0,100.0,60.0);


void main(){


vPosition=position;


vec4 mvPosition=modelViewMatrix*vec4(vPosition,1.0);


fogFactor=smoothstep(50.0,800.0,length(mvPosition));


vViewPosition=-mvPosition.xyz;


vec3 vLightPosition=(viewMatrix*vec4(lightPosition,1.0)).xyz;
//vLightDir=vLightPosition-mvPosition.xyz; // POINT LIGHT
vLightDir=normalize(vLightPosition); // DIRECTIONAL LIGHT

vNormal=normalize(normalMatrix*normal);


vUv=uv;
vUv2=uv2;


gl_Position=projectionMatrix*mvPosition;


}


`;


fs["stone"]=`


uniform sampler2D map;
uniform vec2 mapRepeat;
uniform sampler2D normalMap;
uniform vec2 normalScale;
uniform vec2 normalRepeat;
uniform sampler2D specularMap;
uniform vec2 specularRepeat;
uniform sampler2D aoMap;
uniform float shininess;
uniform float glossiness;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vUv2;
varying vec3 vLightDir;
varying vec3 vViewPosition;
varying float fogFactor;
uniform vec3 fogColor;
//vec3 lightColor=vec3(0.99,0.94,0.75);
vec3 lightColor=vec3(0.99,0.87,0.49);
//vec3 specularColor=vec3(0.99,0.94,0.75);
vec3 specularColor=vec3(0.99,0.87,0.49);
vec3 ambient=vec3(0.2,0.2,0.2);
vec3 gamma=vec3(1.0,1.0,1.0);
vec3 rimColor=vec3(0.99,0.94,0.75);


// РАСЧЁТ БЛЕСКА ПО ФОНГУ


#define PI 3.141592653589793


vec3 F_Schlick( const in vec3 specularColor, const in float dotLH ) {
	float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );
	return ( 1.0 - specularColor ) * fresnel + specularColor;
}


#define RECIPROCAL_PI 0.3183098861837907
#define EPSILON 1e-6
float pow2( const in float x ) { return x*x; }


float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}


float G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}


float G1V(float dotNV,float k) {
return 1.0/(dotNV*(1.0-k)+k);
}


vec3 LightingFuncGGX_REF(vec3 N,vec3 V,vec3 L,float roughness,float F0){


float alpha=roughness*roughness;


// half vector
vec3 H=normalize(V+L);
float dotNL=clamp(dot(N,L),0.0,1.0);
float dotNV=clamp(dot(N,V),0.0,1.0);
float dotNH=clamp(dot(N,H),0.0,1.0);
float dotLH=clamp(dot(L,H),0.0,1.0);


// D - microfacet distribution function, shape of specular peak
float alphaSqr=alpha*alpha;


float pi=3.14159;
float denom=dotNH*dotNH*(alphaSqr-1.0)+1.0;
//float D=alphaSqr/(pi*denom*denom);


float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );
// F - fresnel reflection coefficient
//float F=fresnel+(1.0-fresnel)*pow(1.0-dotLH,5.0);
//float F=F0+(1.0-F0)*pow(1.0-dotLH,5.0);


// V / G - geometric attenuation or shadowing factor
float k=alpha/2.0;
float vis=G1V(dotNL,k)*G1V(dotNV,k);


//float specular=dotNL*D*F*vis;


//return specular;


vec3 F = F_Schlick( specularColor, dotLH );
float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );
float  D = D_GGX( alpha, dotNH );
return F * ( G * D );
  
}


float saturate2(float f) {
    return clamp(f, 0.0, 1.0);
}


float chiGGX(float v) {
    return v > 0.0 ? 1.0 : 0.0;
}


float GGX_Distribution(vec3 n, vec3 h, float alpha) {
    float NoH = dot(n,h);
    float alpha2 = alpha * alpha;
    float NoH2 = NoH * NoH;
    float den = NoH2 * alpha2 + (1.0 - NoH2);
    //chiGGX removed to follow Graphics Rants, will get away with NdotL anyway
    return (chiGGX(NoH) * alpha2) / ( PI * den * den );
    //return (alpha2) / ( PI * den * den );
}


float GGX_PartialGeometryTerm(vec3 v, vec3 n, vec3 h, float alpha)
{
    float VoH2 = saturate2(dot(v,h));
    float chi = chiGGX( VoH2 / saturate2(dot(v,n)) );
    VoH2 = VoH2 * VoH2;
    float tan2 = ( 1.0 - VoH2 ) / VoH2;
    //return chi / (1 + tan2);
    //return ( 1 + sqrt( 1 + alpha * alpha * tan2 ));
    return (chi * 2.0) / ( 1.0 + sqrt( 1.0 + alpha * alpha * tan2 ) );
}


vec3 Fresnel_Schlick(float cosT, vec3 F0)
{
  return F0 + (1.0-F0) * pow( 1.0 - cosT, 5.0);
}
vec3 F_Schlick(vec3 F0, float fd90, float cosT)
{
  return F0 + fd90 * pow( 1.0 - cosT, 5.0);
}


float Fr_DisneyDiffuse(float NdotV, float NdotL, float LdotH, float linearRoughness)
{
    float energyBias = mix(0.0, 0.5, linearRoughness);
    float energyFactor = mix(1.0, 1.0 / 1.51, linearRoughness);
    float fd90 = energyBias + 2.0 * LdotH*LdotH * linearRoughness;
    vec3 f0 = vec3(1.0, 1.0, 1.0);
    float lightScatter = F_Schlick(f0, fd90, NdotL).r;
    float viewScatter = F_Schlick(f0, fd90, NdotV).r;
    return lightScatter * viewScatter * energyFactor;
}


mat3 getTSN(vec3 eye_pos,vec3 surf_norm) {


vec3 q0=vec3(dFdx(eye_pos.x),dFdx(eye_pos.y),dFdx(eye_pos.z));
vec3 q1=vec3(dFdy(eye_pos.x),dFdy(eye_pos.y),dFdy(eye_pos.z));
vec2 st0=dFdx(vUv.st);
vec2 st1=dFdy(vUv.st);
float scale=sign(st1.t*st0.s-st0.t*st1.s); // we do not care about the magnitude
vec3 S=normalize((q0*st1.t-q1*st0.t)*scale);
vec3 T=normalize((-q0*st1.s+q1*st0.s)*scale);
vec3 N=normalize(surf_norm);


return mat3(S,T,N);


}


void main(){


mat3 tsn=getTSN(-vViewPosition,vNormal);


vec3 normalTex=texture2D(normalMap,vUv*normalRepeat).xyz*2.0-1.0;
normalTex.xy*=normalScale;


vec3 normal=normalize(tsn*normalTex);


vec3 L=normalize(vLightDir);
vec3 V=normalize(vViewPosition);


float lambert=max(0.0,dot(normal,L));


vec3 diffuse=texture2D(map,vUv*mapRepeat).rgb;


vec3 finalColor=ambient*diffuse+diffuse*lightColor*lambert;



float uIor=1.45;
float metalness=0.0;
float roughness=0.4;

vec3 F0 = vec3(abs((1.0 - uIor) / (1.0 + uIor)));
    F0 = F0 * F0;
    //F0 = vec3(0.04); //0.04 is default for non-metals in UE4
    F0 = mix(F0, ambient, metalness);


vec3 H = normalize(V + L);
vec3 N=normal;
    float VdotH = saturate2(dot(V, H));
    float NdotL = saturate2(dot(N, L));
    float NdotH = saturate2(dot(N, H));
    float NdotV = saturate2(dot(N, V));
    float LdotH = saturate2(dot(L, N));


//F0=vec3(exp2( ( -5.55473 * LdotH - 6.98316 ) * LdotH ));


    float alpha = roughness * roughness;
    float D = GGX_Distribution(N, H, alpha);
    float G = GGX_PartialGeometryTerm(V, N, H, alpha);
    vec3 F = Fresnel_Schlick(VdotH, F0); //VdotH
    float Fd = Fr_DisneyDiffuse(NdotV, NdotL, LdotH, roughness);
   // float denom = saturate2( 4.0 * (NdotV * NdotH + 0.01) );
       float denom = saturate2( 1.0 * (NdotV * NdotH + 0.01) );
    //vec3 indirectSpecular = D * G * F / denom;
    vec3 directSpecular = specularColor * NdotL * D * G * F / denom;;
 //finalColor+=directSpecular;


vec3 H2 = normalize(V + L);
vec3 R=reflect(-L,normal);
float specular=pow(saturate2(dot(H2,normal)),shininess)*glossiness;


float exponential=pow(1.0-VdotH,5.0);
float FF0=4.2;
float fresnel=exponential+FF0*(1.0-exponential);
specular*=fresnel;
float FF=exp2((-5.55473*LdotH-6.98316)*LdotH);
//specular*=FF*20.0;
finalColor+=specularColor*specular;



gl_FragColor=vec4(finalColor,1.0);


}


`;
