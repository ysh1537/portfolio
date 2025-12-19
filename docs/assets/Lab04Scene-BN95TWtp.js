import{r as i,j as e,am as u,a4 as c,a9 as n,a1 as l,a5 as d,Q as x,v as f,l as v,k as j,C as m,x as p}from"./three-Cwdqg_u8.js";import{u as T}from"./index-sb9UF3ya.js";import"./vendor-CqO7gtIP.js";import"./animation-B64uUSMy.js";const h={uniforms:{uColor:{value:new m("#00ff41")}},vertexShader:`
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
    `},g=()=>{const r=i.useRef(),{viewport:t}=f(),o=i.useMemo(()=>new v({uniforms:{uTime:{value:0},uColor:{value:new m("#ef4444")}},vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,transparent:!0,depthWrite:!1,side:j}),[]);return p(a=>{if(r.current&&r.current.material&&r.current.material.uniforms){const s=r.current.material.uniforms;s.uTime&&(s.uTime.value=a.clock.getElapsedTime())}}),e.jsxs("mesh",{ref:r,scale:[t.width,t.height,1],position:[0,0,-5],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("primitive",{object:o,attach:"material"})]})},E=({text:r,position:t,fontSize:o,color:a})=>{const s=i.useRef();return p(()=>{s.current&&(Math.random()>.95?(s.current.position.x=t[0]+(Math.random()-.5)*.1,s.current.position.y=t[1]+(Math.random()-.5)*.1):s.current.position.set(...t))}),e.jsxs("group",{ref:s,position:t,children:[e.jsx(n,{position:[.02,0,0],fontSize:o,color:"cyan",opacity:.5,anchorX:"center",children:r}),e.jsx(n,{position:[-.02,0,0],fontSize:o,color:"red",opacity:.5,anchorX:"center",children:r}),e.jsx(n,{position:[0,0,0],fontSize:o,color:a,anchorX:"center",children:r})]})},I=()=>{const r=T(o=>o.startWarp),[t]=i.useState(()=>Array.from({length:5}).map(()=>`0x${Math.floor(Math.random()*16777215).toString(16)} 0000 0000 ...`));return e.jsxs("group",{children:[e.jsx(g,{}),e.jsxs("group",{position:[0,0,0],children:[e.jsxs("mesh",{position:[0,0,-1],children:[e.jsx("planeGeometry",{args:[6,4]}),e.jsx("meshBasicMaterial",{color:"#000000",transparent:!0,opacity:.9}),e.jsxs("lineSegments",{children:[e.jsx("edgesGeometry",{args:[new u(6,4)]}),e.jsx("meshBasicMaterial",{color:"#ef4444"})]})]}),e.jsx(c,{children:e.jsx(E,{text:"THE GLITCH [FATAL ERROR]",position:[0,1.5,0],fontSize:.3,color:"#ef4444"})}),e.jsx(c,{children:e.jsx(n,{position:[0,1.1,0],fontSize:.12,color:"#ef4444",anchorX:"center",children:"UNSTABLE SECTOR - CAUTION"})}),e.jsx(l,{position:[-2.5,1,0],transform:!0,scale:.5,style:{width:"800px",height:"400px",overflow:"hidden",pointerEvents:"none"},children:e.jsxs("div",{className:"font-mono text-red-500 text-lg leading-relaxed shadow-red-500/20 drop-shadow-lg",children:[e.jsx("p",{children:"> [SYSTEM] CRITICAL FAILURE IN SECTOR 04"}),e.jsx("p",{children:"> [KERNEL] REALITY INTEGRITY: 12% "}),e.jsx("p",{children:"> [WARNING] DATA CORRUPTION DETECTED"}),e.jsx("p",{children:"> [ERROR] 0x8291F - SEGMENTATION FAULT"}),e.jsx("p",{children:"> [INFO] ATTEMPTING CONTAINMENT..."}),e.jsx("p",{children:"> [NETWORK] CONNECTION UNSTABLE"}),e.jsx("p",{className:"animate-pulse font-bold mt-4",children:"> _SYSTEM BREACH IMMINENT_"}),e.jsx("p",{className:"opacity-50 mt-2",children:"> DUMPING MEMORY STACK..."}),t.map((o,a)=>e.jsx("p",{className:"text-xs opacity-70",children:o},a))]})})]}),e.jsx(d,{speed:5,rotationIntensity:2,floatIntensity:1,children:e.jsxs("mesh",{position:[4,0,0],rotation:[.5,.5,0],children:[e.jsx("icosahedronGeometry",{args:[1,0]}),e.jsx("meshBasicMaterial",{color:"#ef4444",wireframe:!0,transparent:!0,opacity:.5})]})}),e.jsx(d,{speed:3,rotationIntensity:3,floatIntensity:1,children:e.jsxs("mesh",{position:[-4,-1,0],rotation:[.2,0,.5],children:[e.jsx("torusKnotGeometry",{args:[.6,.2,100,16]}),e.jsx("meshBasicMaterial",{color:"#ef4444",wireframe:!0,transparent:!0,opacity:.5})]})}),e.jsx(x,{count:50,scale:10,size:5,speed:.8,opacity:.8,color:"#ef4444"}),e.jsx(l,{position:[0,-2.5,0],center:!0,style:{pointerEvents:"auto"},children:e.jsx("button",{onClick:()=>r("hub"),className:"px-6 py-2 bg-red-900/50 border border-red-500/50 rounded font-mono text-sm text-red-400 hover:bg-red-800/80 hover:border-red-400 hover:text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.5)]",children:"[ EMERGENCY EXIT ]"})})]})};export{I as default};
