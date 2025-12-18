import{b as u,j as e,i as f,r as s,u as p,S as x,D as v,C as m,a as j}from"./index-DIejhpZU.js";import{B as n}from"./Billboard-BI7mxHw8.js";import{T as i}from"./Text-BUKx5TYS.js";import{H as a,F as l}from"./Float-DX9rMsZk.js";import{S as g}from"./Sparkles-DA8llxUF.js";const c={uniforms:{uColor:{value:new m("#00ff41")}},vertexShader:`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,fragmentShader:`
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColor;

        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
            vec2 uv = vUv;
            
            // Grid columns
            float columns = 50.0;
            vec2 ipos = floor(uv * columns);
            vec2 fpos = fract(uv * columns);

            // Rain speed varying per column
            float speed = 2.0 + random(vec2(ipos.x, 0.0)) * 3.0;
            float y = mod(uv.y + uTime * speed * 0.2, 1.0);

            // Trail effect
            float strength = 1.0 - step(0.1, random(vec2(ipos.x, floor(y * 20.0)))); // Random chars
            strength *= (1.0 - fract(y * 10.0)); // Fade trail
            
            // Leading bright head
            float head = 1.0 - step(0.01, y); 
            
            vec3 color = uColor * strength;
            color += vec3(0.8, 1.0, 0.8) * head; // White-ish head

            gl_FragColor = vec4(color, strength);
        }
    `},E=()=>{const r=s.useRef(),{viewport:t}=p(),d=s.useMemo(()=>new x({uniforms:{uTime:{value:0},uColor:{value:new m("#00ff41")}},vertexShader:c.vertexShader,fragmentShader:c.fragmentShader,transparent:!0,depthWrite:!1,side:v}),[]);return j(h=>{if(r.current&&r.current.material&&r.current.material.uniforms){const o=r.current.material.uniforms;o.uTime&&(o.uTime.value=h.clock.getElapsedTime())}}),e.jsxs("mesh",{ref:r,scale:[t.width,t.height,1],position:[0,0,-5],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("primitive",{object:d,attach:"material"})]})},R=()=>{const r=u(t=>t.setScene);return e.jsxs("group",{children:[e.jsx(E,{}),e.jsxs("group",{position:[0,0,0],children:[e.jsxs("mesh",{position:[0,0,-1],children:[e.jsx("planeGeometry",{args:[6,4]}),e.jsx("meshBasicMaterial",{color:"#000000",transparent:!0,opacity:.8}),e.jsxs("lineSegments",{children:[e.jsx("edgesGeometry",{args:[new f(6,4)]}),e.jsx("meshBasicMaterial",{color:"#00ff41"})]})]}),e.jsx(n,{children:e.jsx(i,{position:[0,1.5,0],fontSize:.3,color:"#00ff41",children:"LAB 04: DEBUG_ROOM"})}),e.jsx(n,{children:e.jsx(i,{position:[0,1.1,0],fontSize:.12,color:"#00ff41",anchorX:"center",children:"시스템 상태 모니터링 - 매트릭스 쉐이더 데모"})}),e.jsx(a,{position:[-2.5,1,0],transform:!0,scale:.5,style:{width:"800px",height:"400px",overflow:"hidden",pointerEvents:"none"},children:e.jsxs("div",{className:"font-mono text-green-500 text-lg leading-relaxed",children:[e.jsx("p",{children:"> [SYSTEM] INITIALIZING DEBUG PROTOCOLS..."}),e.jsx("p",{children:"> [KERNEL] LOADING MODULE: MATRIX_RENDERER_V2"}),e.jsx("p",{children:"> [WARNING] UNSTABLE REALITY DETECTED"}),e.jsx("p",{children:"> [INFO] MEMORY USAGE: 14GB / 16GB"}),e.jsx("p",{children:"> [INFO] GPU TEMPERATURE: 72°C"}),e.jsx("p",{children:"> [NETWORK] CONNECTED TO: heoyesol.kr"}),e.jsx("p",{className:"animate-pulse",children:"> _WAITING FOR INPUT..."})]})})]}),e.jsx(l,{speed:4,rotationIntensity:1,floatIntensity:1,children:e.jsxs("mesh",{position:[4,0,0],rotation:[.5,.5,0],children:[e.jsx("icosahedronGeometry",{args:[1,0]}),e.jsx("meshBasicMaterial",{color:"#00ff41",wireframe:!0,transparent:!0,opacity:.3})]})}),e.jsx(l,{speed:3,rotationIntensity:1,floatIntensity:1,children:e.jsxs("mesh",{position:[-4,-1,0],rotation:[.2,0,.5],children:[e.jsx("torusKnotGeometry",{args:[.6,.2,100,16]}),e.jsx("meshBasicMaterial",{color:"#00ff41",wireframe:!0,transparent:!0,opacity:.3})]})}),e.jsx(g,{count:100,scale:10,size:2,speed:.3,opacity:.6,color:"#00ff41"}),e.jsx(a,{position:[0,-2.5,0],center:!0,style:{pointerEvents:"auto"},children:e.jsx("button",{onClick:()=>r("hub"),className:"px-6 py-2 bg-green-900/50 border border-green-500/50 rounded font-mono text-sm text-green-400 hover:bg-green-800/50 hover:border-green-400 transition-all cursor-pointer",children:"[ EXIT DEBUG MODE ]"})})]})};export{R as default};
