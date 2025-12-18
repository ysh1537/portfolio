import{M as p,S as z,aa as F,r,a6 as O,u as S,C as b,a as k,_ as w,ab as j,V as I,ac as R}from"./index-DIejhpZU.js";import{v as V}from"./Float-DX9rMsZk.js";function U(e,t,n,o){const l=class extends z{constructor(s={}){const c=Object.entries(e);super({uniforms:c.reduce((a,[f,i])=>{const u=F.clone({[f]:{value:i}});return{...a,...u}},{}),vertexShader:t,fragmentShader:n}),this.key="",c.forEach(([a])=>Object.defineProperty(this,a,{get:()=>this.uniforms[a].value,set:f=>this.uniforms[a].value=f})),Object.assign(this,s)}};return l.key=p.generateUUID(),l}const T=U({time:0,pixelRatio:1},` uniform float pixelRatio;
    uniform float time;
    attribute float size;  
    attribute float speed;  
    attribute float opacity;
    attribute vec3 noise;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vOpacity;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      modelPosition.y += sin(time * speed + modelPosition.x * noise.x * 100.0) * 0.2;
      modelPosition.z += cos(time * speed + modelPosition.x * noise.y * 100.0) * 0.2;
      modelPosition.x += cos(time * speed + modelPosition.x * noise.z * 100.0) * 0.2;
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPostion = projectionMatrix * viewPosition;
      gl_Position = projectionPostion;
      gl_PointSize = size * 25. * pixelRatio;
      gl_PointSize *= (1.0 / - viewPosition.z);
      vColor = color;
      vOpacity = opacity;
    }`,` varying vec3 vColor;
    varying float vOpacity;
    void main() {
      float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
      float strength = 0.05 / distanceToCenter - 0.1;
      gl_FragColor = vec4(vColor, strength * vOpacity);
      #include <tonemapping_fragment>
      #include <${V>=154?"colorspace_fragment":"encodings_fragment"}>
    }`),h=e=>e&&e.constructor===Float32Array,$=e=>[e.r,e.g,e.b],v=e=>e instanceof j||e instanceof I||e instanceof R,A=e=>Array.isArray(e)?e:v(e)?e.toArray():[e,e,e];function m(e,t,n){return r.useMemo(()=>{if(t!==void 0){if(h(t))return t;if(t instanceof b){const o=Array.from({length:e*3},()=>$(t)).flat();return Float32Array.from(o)}else if(v(t)||Array.isArray(t)){const o=Array.from({length:e*3},()=>A(t)).flat();return Float32Array.from(o)}return Float32Array.from({length:e},()=>t)}return Float32Array.from({length:e},n)},[t])}const J=r.forwardRef(({noise:e=1,count:t=100,speed:n=1,opacity:o=1,scale:l=1,size:y,color:s,children:c,...a},f)=>{r.useMemo(()=>O({SparklesImplMaterial:T}),[]);const i=r.useRef(null),u=S(d=>d.viewport.dpr),g=A(l),P=r.useMemo(()=>Float32Array.from(Array.from({length:t},()=>g.map(p.randFloatSpread)).flat()),[t,...g]),x=m(t,y,Math.random),M=m(t,o),C=m(t,n),E=m(t*3,e),_=m(s===void 0?t*3:t,h(s)?s:new b(s),()=>1);return k(d=>{i.current&&i.current.material&&(i.current.material.time=d.clock.elapsedTime)}),r.useImperativeHandle(f,()=>i.current,[]),r.createElement("points",w({key:`particle-${t}-${JSON.stringify(l)}`},a,{ref:i}),r.createElement("bufferGeometry",null,r.createElement("bufferAttribute",{attach:"attributes-position",args:[P,3]}),r.createElement("bufferAttribute",{attach:"attributes-size",args:[x,1]}),r.createElement("bufferAttribute",{attach:"attributes-opacity",args:[M,1]}),r.createElement("bufferAttribute",{attach:"attributes-speed",args:[C,1]}),r.createElement("bufferAttribute",{attach:"attributes-color",args:[_,3]}),r.createElement("bufferAttribute",{attach:"attributes-noise",args:[E,3]})),c||r.createElement("sparklesImplMaterial",{transparent:!0,pixelRatio:u,depthWrite:!1}))});export{J as S};
