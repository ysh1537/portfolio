import{r as n,j as e,al as u,a4 as c,a9 as a,a1 as x,a5 as l,Q as d,v as f,l as j,k as v,C as h,x as p}from"./three-jhEprhxK.js";import{u as T}from"./index-BnyOwBxZ.js";import"./vendor-CqO7gtIP.js";import"./animation-t-s-YVCi.js";const m={uniforms:{uColor:{value:new h("#00ff41")}},vertexShader:`
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
    `},g=()=>{const r=n.useRef(),{viewport:t}=f(),s=n.useMemo(()=>new j({uniforms:{uTime:{value:0},uColor:{value:new h("#ef4444")}},vertexShader:m.vertexShader,fragmentShader:m.fragmentShader,transparent:!0,depthWrite:!1,side:v}),[]);return p(i=>{if(r.current&&r.current.material&&r.current.material.uniforms){const o=r.current.material.uniforms;o.uTime&&(o.uTime.value=i.clock.getElapsedTime())}}),e.jsxs("mesh",{ref:r,scale:[t.width,t.height,1],position:[0,0,-5],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("primitive",{object:s,attach:"material"})]})},y=({text:r,position:t,fontSize:s,color:i})=>{const o=n.useRef();return p(()=>{o.current&&(Math.random()>.95?(o.current.position.x=t[0]+(Math.random()-.5)*.1,o.current.position.y=t[1]+(Math.random()-.5)*.1):o.current.position.set(...t))}),e.jsxs("group",{ref:o,position:t,children:[e.jsx(a,{position:[.02,0,0],fontSize:s,color:"cyan",opacity:.5,anchorX:"center",children:r}),e.jsx(a,{position:[-.02,0,0],fontSize:s,color:"red",opacity:.5,anchorX:"center",children:r}),e.jsx(a,{position:[0,0,0],fontSize:s,color:i,anchorX:"center",children:r})]})},S=()=>{T(t=>t.startWarp);const[r]=n.useState(()=>Array.from({length:5}).map(()=>`0x${Math.floor(Math.random()*16777215).toString(16)} 0000 0000 ...`));return e.jsxs("group",{children:[e.jsx(g,{}),e.jsxs("group",{position:[0,0,0],children:[e.jsxs("mesh",{position:[0,0,-1],children:[e.jsx("planeGeometry",{args:[6,4]}),e.jsx("meshBasicMaterial",{color:"#000000",transparent:!0,opacity:.9}),e.jsxs("lineSegments",{children:[e.jsx("edgesGeometry",{args:[new u(6,4)]}),e.jsx("meshBasicMaterial",{color:"#ef4444"})]})]}),e.jsx(c,{children:e.jsx(y,{text:"THE GLITCH [FATAL ERROR]",position:[0,1.5,0],fontSize:.3,color:"#ef4444"})}),e.jsx(c,{children:e.jsx(a,{position:[0,1.1,0],fontSize:.12,color:"#ef4444",anchorX:"center",children:"UNSTABLE SECTOR - CAUTION"})}),e.jsx(x,{position:[-2.5,1,0],transform:!0,scale:.5,style:{width:"800px",height:"400px",overflow:"hidden",pointerEvents:"none"},children:e.jsxs("div",{className:"font-mono text-red-500 text-lg leading-relaxed shadow-red-500/20 drop-shadow-lg",children:[e.jsx("p",{children:"> [SYSTEM] CRITICAL FAILURE IN SECTOR 04"}),e.jsx("p",{children:"> [KERNEL] REALITY INTEGRITY: 12% "}),e.jsx("p",{children:"> [WARNING] DATA CORRUPTION DETECTED"}),e.jsx("p",{children:"> [ERROR] 0x8291F - SEGMENTATION FAULT"}),e.jsx("p",{children:"> [INFO] ATTEMPTING CONTAINMENT..."}),e.jsx("p",{children:"> [NETWORK] CONNECTION UNSTABLE"}),e.jsx("p",{className:"animate-pulse font-bold mt-4",children:"> _SYSTEM BREACH IMMINENT_"}),e.jsx("p",{className:"opacity-50 mt-2",children:"> DUMPING MEMORY STACK..."}),r.map((t,s)=>e.jsx("p",{className:"text-xs opacity-70",children:t},s))]})})]}),e.jsx(l,{speed:5,rotationIntensity:2,floatIntensity:1,children:e.jsxs("mesh",{position:[4,0,0],rotation:[.5,.5,0],children:[e.jsx("icosahedronGeometry",{args:[1,0]}),e.jsx("meshBasicMaterial",{color:"#ef4444",wireframe:!0,transparent:!0,opacity:.5})]})}),e.jsx(l,{speed:3,rotationIntensity:3,floatIntensity:1,children:e.jsxs("mesh",{position:[-4,-1,0],rotation:[.2,0,.5],children:[e.jsx("torusKnotGeometry",{args:[.6,.2,100,16]}),e.jsx("meshBasicMaterial",{color:"#ef4444",wireframe:!0,transparent:!0,opacity:.5})]})}),e.jsx(d,{count:50,scale:10,size:5,speed:.8,opacity:.8,color:"#ef4444"}),e.jsx(d,{count:50,scale:10,size:5,speed:.8,opacity:.8,color:"#ef4444"})]})};export{S as default};
