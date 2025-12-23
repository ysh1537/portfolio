import{r as c,al as M,am as b,an as A,ao as w,j as e,ap as L,a7 as R,a9 as x,$ as G,a3 as N,v as O,o as P,n as U,C as E,x as C,a5 as D,J as j,K as H}from"./three-C3NlESEC.js";import{b as $}from"./index-DfU_v6EJ.js";import"./vendor-CqO7gtIP.js";import"./animation-r5s8DLQG.js";const g={vertexShader:`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,fragmentShader:`
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uSpeed;

        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
            vec2 uv = vUv;
            float columns = 50.0;
            vec2 ipos = floor(uv * columns);
            // 속도 절반으로 줄임 (0.5~1.5)
            float baseSpeed = 0.5 + random(vec2(ipos.x, 0.0)) * 1.0;
            float y = mod(uv.y + uTime * baseSpeed * 0.1 * uSpeed, 1.0);
            float strength = 1.0 - step(0.1, random(vec2(ipos.x, floor(y * 20.0))));
            strength *= (1.0 - fract(y * 10.0));
            float head = 1.0 - step(0.01, y); 
            vec3 color = uColor * strength;
            color += vec3(0.8, 1.0, 0.8) * head;
            gl_FragColor = vec4(color, strength * 0.7);
        }
    `},k=({stabilized:a})=>{const o=c.useRef(),{viewport:u}=O(),d=c.useRef(0),s=c.useMemo(()=>new P({uniforms:{uTime:{value:0},uColor:{value:new E("#ef4444")},uSpeed:{value:1}},vertexShader:g.vertexShader,fragmentShader:g.fragmentShader,transparent:!0,depthWrite:!1,side:U}),[]);return C((i,r)=>{if(o.current&&o.current.material&&o.current.material.uniforms){const l=o.current.material.uniforms;a?(d.current===0&&(d.current=i.clock.elapsedTime),l.uTime.value=d.current,l.uSpeed.value=j.lerp(l.uSpeed.value,0,r*2)):(l.uTime.value=i.clock.getElapsedTime(),l.uSpeed.value=1);const n=a?new E("#06b6d4"):new E("#ef4444");l.uColor.value.lerp(n,r*2)}}),e.jsxs("mesh",{ref:o,scale:[u.width,u.height,1],position:[0,0,-5],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("primitive",{object:s,attach:"material"})]})},B=({text:a,position:o,fontSize:u,color:d,intensity:s=1})=>{const i=c.useRef();return C(()=>{i.current&&(Math.random()>1-.05*s?(i.current.position.x=o[0]+(Math.random()-.5)*.1*s,i.current.position.y=o[1]+(Math.random()-.5)*.1*s):i.current.position.set(...o))}),e.jsxs("group",{ref:i,position:o,children:[e.jsx(x,{position:[.02*s,0,0],fontSize:u,color:"cyan",opacity:.5,anchorX:"center",children:a}),e.jsx(x,{position:[-.02*s,0,0],fontSize:u,color:"red",opacity:.5,anchorX:"center",children:a}),e.jsx(x,{position:[0,0,0],fontSize:u,color:d,anchorX:"center",children:a})]})},f=({id:a,position:o,geometry:u,onPatch:d,isPatched:s,speed:i=2})=>{const r=c.useRef(),[l,n]=c.useState(!1),{playHover:p,playClick:v}=$();C((h,m)=>{if(!r.current)return;s?(r.current.rotation.x+=m*.3,r.current.rotation.y+=m*.2,r.current.position.x=j.lerp(r.current.position.x,o[0],m*5),r.current.position.y=j.lerp(r.current.position.y,o[1],m*5)):(r.current.rotation.x+=m*i*(.5+Math.sin(h.clock.elapsedTime*5)*.3),r.current.rotation.y+=m*i*(.5+Math.cos(h.clock.elapsedTime*4)*.3),Math.random()>.9&&(r.current.position.x=o[0]+(Math.random()-.5)*.2,r.current.position.y=o[1]+(Math.random()-.5)*.2));const t=l?1.3:1;r.current.scale.lerp(new H(t,t,t),.1)});const S=()=>{s||(v(),d(a))};return e.jsx(D,{speed:s?2:8,rotationIntensity:s?1:4,floatIntensity:1,children:e.jsxs("mesh",{ref:r,position:o,onPointerOver:()=>{s||(n(!0),p(),document.body.style.cursor="pointer")},onPointerOut:()=>{n(!1),document.body.style.cursor="auto"},onClick:S,children:[e.jsx("primitive",{object:u,attach:"geometry"}),e.jsx("meshBasicMaterial",{color:s?"#06b6d4":l?"#ffffff":"#ef4444",wireframe:!0,transparent:!0,opacity:s?.8:l?.9:.5})]})})},K=()=>{const[a,o]=c.useState(new Set),[u,d]=c.useState(["[SYSTEM] CRITICAL FAILURE IN SECTOR 04","[KERNEL] REALITY INTEGRITY: 12%","[WARNING] DATA CORRUPTION DETECTED"]),s=4,i=12,r=Math.floor((100-i)/s),l=i+a.size*r,n=a.size>=s,p=c.useCallback(t=>{o(y=>{const I=new Set(y);return I.add(t),I});const T={"mod-1":"QUANTUM_CORE","mod-2":"NEURAL_LINK","mod-3":"MEMORY_STACK","mod-4":"REALITY_ANCHOR"};d(y=>[...y,`[PATCHING] ${T[t]||t}...`,`[SUCCESS] Module restored. Integrity +${r}%`])},[r]);c.useEffect(()=>{n&&d(t=>[...t,"[SYSTEM] ALL MODULES RESTORED","[STATUS] SECTOR STABILIZED","",'>>> "Debugging is Creating." <<<'])},[n]);const v=c.useMemo(()=>new M(.8,0),[]),S=c.useMemo(()=>new b(.5,.15,64,12),[]),h=c.useMemo(()=>new A(.7,0),[]),m=c.useMemo(()=>new w(.6,0),[]);return e.jsxs("group",{children:[e.jsx(k,{stabilized:n}),e.jsxs("group",{position:[0,0,0],children:[e.jsxs("mesh",{position:[0,0,-1],children:[e.jsx("planeGeometry",{args:[6,4]}),e.jsx("meshBasicMaterial",{color:"#000000",transparent:!0,opacity:.9}),e.jsxs("lineSegments",{children:[e.jsx("edgesGeometry",{args:[new L(6,4)]}),e.jsx("meshBasicMaterial",{color:n?"#06b6d4":"#ef4444"})]})]}),e.jsx(R,{children:e.jsx(B,{text:n?"SECTOR STABILIZED":"THE GLITCH [FATAL ERROR]",position:[0,1.5,0],fontSize:.3,color:n?"#06b6d4":"#ef4444",intensity:n?.1:1})}),e.jsx(R,{children:e.jsxs(x,{position:[0,1.1,0],fontSize:.15,color:n?"#06b6d4":"#fbbf24",anchorX:"center",children:["REALITY INTEGRITY: ",l,"%"]})}),e.jsx(G,{position:[-2.5,.8,0],transform:!0,scale:.5,style:{width:"800px",maxHeight:"350px",overflow:"hidden",pointerEvents:"none"},children:e.jsxs("div",{className:"font-mono text-sm leading-relaxed",children:[u.map((t,T)=>e.jsx("p",{className:`
                                ${t.includes("SUCCESS")?"text-emerald-400":""}
                                ${t.includes("PATCHING")?"text-yellow-400":""}
                                ${t.includes("CRITICAL")||t.includes("ERROR")?"text-red-500":""}
                                ${t.includes("STABILIZED")?"text-cyan-400 font-bold":""}
                                ${t.includes("Debugging")?"text-white text-lg font-bold mt-4 animate-pulse":""}
                                ${!t.includes("SUCCESS")&&!t.includes("PATCHING")&&!t.includes("CRITICAL")&&!t.includes("ERROR")&&!t.includes("STABILIZED")&&!t.includes("Debugging")?"text-red-400 opacity-70":""}
                            `,children:t.startsWith("[")?`> ${t}`:t},T)),!n&&e.jsx("p",{className:"text-yellow-500 animate-pulse mt-4",children:"> [HINT] 불안정한 모듈을 클릭하여 패치하세요..."})]})})]}),e.jsx(f,{id:"mod-1",position:[3.5,.8,1],geometry:v,onPatch:p,isPatched:a.has("mod-1"),speed:3}),e.jsx(f,{id:"mod-2",position:[-5,1.5,3],geometry:S,onPatch:p,isPatched:a.has("mod-2"),speed:4}),e.jsx(f,{id:"mod-3",position:[3.5,-1.2,1],geometry:h,onPatch:p,isPatched:a.has("mod-3"),speed:2.5}),e.jsx(f,{id:"mod-4",position:[-3.5,-1.2,1],geometry:m,onPatch:p,isPatched:a.has("mod-4"),speed:3.5}),e.jsx(N,{count:n?100:50,scale:10,size:n?3:5,speed:n?.3:.8,opacity:.8,color:n?"#06b6d4":"#ef4444"})]})};export{K as default};
