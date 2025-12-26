import{am as j,r as C,C as y,G as A,z as s,ac as z,a8 as P,aa as S,a6 as b,t as f,w as p,m as R,an as U,ao as I,a3 as T,J as w,K as k}from"./three-B9-2A0-2.js";import{u as F,a as D}from"./index-SHItErlE.js";import"./vendor-CqO7gtIP.js";import"./animation-DsH0_-YU.js";import"./postprocessing-Qbs0T82m.js";const E=j({time:0,color1:new y("#4c1d95"),color2:new y("#8b5cf6"),color3:new y("#22d3ee"),rimColor:new y("#ffffff"),rimPower:2,resolution:new C},`
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,`
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    uniform vec3 rimColor;
    uniform float rimPower;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Swirling UVs
      vec2 noisyUv = vUv;
      noisyUv.x += time * 0.02; // Rotation speed
      
      float n = snoise(noisyUv * 3.0 + vec2(0.0, time * 0.1));
      float n2 = snoise(noisyUv * 6.0 - vec2(time * 0.05, 0.0));
      
      // Mix noise layers
      float pattern = n * 0.5 + n2 * 0.25;

      // Color bands
      vec3 finalColor = mix(color1, color2, pattern + 0.5);
      
      // Add Cyan veins
      float vein = smoothstep(0.4, 0.45, abs(n2));
      finalColor = mix(finalColor, color3, vein * 0.3);

      // Rim Lighting (Fresnel)
      vec3 viewDir = normalize(vViewPosition);
      vec3 normal = normalize(vNormal);
      float rim = 1.0 - max(dot(viewDir, normal), 0.0);
      rim = pow(rim, rimPower);
      
      finalColor += rimColor * rim * 0.8;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `);A({GasGiantMaterial:E});const G=m=>{const[u,r]=f.useState(null),a=f.useRef(null),l=f.useRef(null);return f.useEffect(()=>{let c=!0;const n=()=>{l.current&&l.current.getTracks().forEach(e=>e.stop()),a.current&&a.current.close()};return m==="mic"?(n(),(async()=>{try{const t=await navigator.mediaDevices.getUserMedia({audio:!0});l.current=t;const o=new(window.AudioContext||window.webkitAudioContext);a.current=o;const i=o.createMediaStreamSource(t),v=o.createAnalyser();v.fftSize=256,i.connect(v),c&&r(v)}catch(t){console.error("Mic Error:",t)}})()):(n(),setTimeout(()=>{c&&r(null)},0)),()=>{c=!1,n()}},[m]),u},V=({analyser:m,mode:u})=>{const r=f.useRef(),a=500,[l]=f.useState(()=>{const n=new Float32Array(a*3);for(let e=0;e<a;e++)n[e*3]=(Math.random()-.5)*10,n[e*3+1]=(Math.random()-.5)*5,n[e*3+2]=(Math.random()-.5)*5;return n}),c=f.useMemo(()=>new Uint8Array(128),[]);return p(n=>{if(!r.current)return;let e=0;if(u==="mic"&&m)m.getByteFrequencyData(c),e=c.reduce((i,v)=>i+v,0)/c.length/255;else{const i=n.clock.elapsedTime;e=(Math.sin(i)*.5+.5)*.5}const t=r.current.geometry.attributes.position.array;for(let i=0;i<a;i++){let v=l[i*3],x=l[i*3+1],d=l[i*3+2];const g=1+e*2,h=n.clock.elapsedTime,M=Math.sin(h+v)*.2;t[i*3]=v*g+Math.sin(h*2+x)*.1,t[i*3+1]=x*g+Math.cos(h*1.5+v)*.1,t[i*3+2]=d*g+M}r.current.geometry.attributes.position.needsUpdate=!0;const o=r.current.material;o&&(o.size=.05+e*.2,o.color&&o.color.setHSL(.5+e*.5,1,.5))}),s.jsx(U,{ref:r,positions:l,stride:3,children:s.jsx(I,{transparent:!0,color:"#facc15",size:.05,sizeAttenuation:!0,depthWrite:!1,blending:T})})},B=({analyser:m,mode:u})=>{const r=f.useRef(),a=16,l=.6,c=f.useMemo(()=>new Uint8Array(32),[]);return p(n=>{if(!r.current)return;let e=[];if(u==="mic"&&m)m.getByteFrequencyData(c),e=Array.from(c).slice(0,a);else{const t=n.clock.elapsedTime;for(let o=0;o<a;o++){const i=(Math.sin(t*3+o*.5)+Math.cos(t*2+o*.2))*.5+.5;e.push(i*255)}}r.current.children.forEach((t,o)=>{if(e[o]!==void 0&&t.material){const i=e[o]/255,v=.5+i*5;t.scale.y=w.lerp(t.scale.y,v,.2);const x=.5+i*.3;t.material.color&&t.material.color.setHSL(x,1,.5),t.material.emissive&&t.material.emissive.setHSL(x,1,.2),"emissiveIntensity"in t.material&&(t.material.emissiveIntensity=i*3)}})}),s.jsx("group",{ref:r,position:[-9.6/2,-2,0],children:Array.from({length:a}).map((n,e)=>s.jsxs("mesh",{position:[e*l,2,0],children:[s.jsx("boxGeometry",{args:[.4,1,.4]}),s.jsx("meshStandardMaterial",{color:"#06b6d4",roughness:.2,metalness:.8})]},e))})},N=({analyser:m,mode:u})=>{const r=f.useRef(),a=f.useMemo(()=>new Uint8Array(64),[]);return p(l=>{if(!r.current)return;let c=0;u==="mic"&&m?(m.getByteFrequencyData(a),c=a.reduce((o,i)=>o+i,0)/a.length/255):c=(Math.sin(l.clock.elapsedTime)*.5+.5)*.6;const n=r.current.geometry.attributes.position,e=l.clock.elapsedTime;for(let o=0;o<n.count;o++){const i=n.getX(o),v=n.getY(o),x=Math.sqrt(i*i+v*v);let d=Math.sin(x*1.5-e*2)*(.2+c*1.5);d+=Math.cos(i*2+e)*.1,n.setZ(o,d)}n.needsUpdate=!0;const t=r.current.material;if(t&&"emissiveIntensity"in t){const o=c*3;t.emissiveIntensity=w.lerp(t.emissiveIntensity,o,.1)}}),s.jsxs("mesh",{ref:r,position:[0,-3,-2],rotation:[-Math.PI/2.5,0,0],children:[s.jsx("planeGeometry",{args:[20,15,32,32]}),s.jsx("meshPhysicalMaterial",{color:"#ec4899",emissive:"#ec4899",emissiveIntensity:.5,wireframe:!0,transparent:!0,opacity:.3,side:R})]})},q=({analyser:m,mode:u})=>{const r=f.useRef(),a=f.useRef(),l=f.useMemo(()=>new Uint8Array(32),[]);return p(c=>{if(!r.current)return;let n=0;u==="mic"&&m?(m.getByteFrequencyData(l),n=l.slice(0,10).reduce((t,o)=>t+o,0)/10/255):n=(Math.sin(c.clock.elapsedTime*4)*.5+.5)*.8;const e=1.5+n*.3;r.current.scale.lerp(new k(e,e,e),.1),a.current&&(a.current.time=c.clock.elapsedTime,a.current.rimPower=3-n*1.5)}),s.jsxs("mesh",{ref:r,position:[0,0,0],children:[s.jsx("sphereGeometry",{args:[1.5,128,128]}),s.jsx("gasGiantMaterial",{ref:a})]})},O=()=>{const u=F(a=>a.lab03Config).mode,r=G(u);return D(),s.jsxs("group",{children:[s.jsx("color",{attach:"background",args:["#020617"]}),s.jsx("fogExp2",{attach:"fog",args:["#020617",.04]}),s.jsx(z,{preset:"city"}),s.jsx(P,{children:s.jsx(S,{position:[0,6,-5],fontSize:.6,color:"#d8b4fe",anchorX:"center",children:"SONIC GIANT [HARMONICS]"})}),s.jsxs(b,{speed:2,rotationIntensity:.2,floatIntensity:.5,children:[s.jsx(q,{analyser:r,mode:u}),s.jsx(B,{analyser:r,mode:u})]}),s.jsx(N,{analyser:r,mode:u}),s.jsx(V,{analyser:r,mode:u}),s.jsx("gridHelper",{args:[50,50,8141549,1973067],position:[0,-4,0]})]})};export{O as default};
