import{r as n,j as e,u as p,S as E,D as S,C as T,a as h,b as g,M as f}from"./index-DIejhpZU.js";import{H as I,F as j}from"./Float-DX9rMsZk.js";import{S as R}from"./Stars-C6_gKuB7.js";import{S as m}from"./Sparkles-DA8llxUF.js";import{T as l}from"./Text-BUKx5TYS.js";const u=["INITIALIZING KERNEL...","LOADING MEMORY MODULES... [OK]","MOUNTING V-DOM FILESYSTEM...","CHECKING QUANTUM ENTANGLEMENT...","FATAL ERROR: SEGMENTATION FAULT IN SECTOR 0x9F","SYSTEM INTEGRITY COMPROMISED.","INITIATING RECOVERY PROTOCOL...","PERFORMING INTEGRITY CHECK...","REPAIRING CORRUPTED DATA BLOCKS...","REBUILDING DEPENDENCIES... [OK]","BYPASSING SECURITY FIREWALL...","ACCESSING MAINFRAME...","ESTABLISHING SECURE CONNECTION...","SYSTEM RESTORED.","SYSTEM READY."],v=r=>r.includes("FATAL ERROR")||r.includes("COMPROMISED")?"text-red-500 font-bold drop-shadow-md":r.includes("RECOVERY")||r.includes("INTEGRITY")||r.includes("REPAIRING")?"text-yellow-400":r.includes("OK")||r.includes("RESTORED")||r.includes("READY")?"text-green-400":"text-green-500",M=({onComplete:r})=>{const[t,a]=n.useState([]),[o,i]=n.useState(0);return n.useEffect(()=>{if(o>=u.length){r&&r();return}const c=u[o].includes("FATAL")||u[o].includes("INTEGRITY")?800:Math.random()*300+100,x=setTimeout(()=>{a(d=>[...d.slice(-8),u[o]]),i(d=>d+1)},c);return()=>clearTimeout(x)},[o,r]),e.jsx(I,{position:[0,-2,0],center:!0,transform:!0,distanceFactor:5,zIndexRange:[100,0],children:e.jsxs("div",{className:"w-96 font-mono text-xs text-left bg-black/90 p-4 border border-green-500/30 rounded-lg backdrop-blur-md select-none shadow-[0_0_20px_rgba(0,255,0,0.1)]",children:[e.jsxs("div",{className:"border-b border-green-500/30 mb-2 pb-1 text-green-300 font-bold flex justify-between items-center",children:[e.jsx("span",{children:"SYSTEM_BOOT_LOG"}),e.jsxs("span",{className:"text-[10px] opacity-70",children:["PID: ",Math.floor(Math.random()*9e3)+1e3]})]}),e.jsxs("div",{className:"flex flex-col gap-1 min-h-[140px]",children:[t.map((s,c)=>e.jsxs("div",{className:"opacity-90 flex items-start",children:[e.jsxs("span",{className:"mr-2 text-green-800 shrink-0",children:["[",new Date().toLocaleTimeString("en-US",{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"}),"]"]}),e.jsx("span",{className:`${v(s)} break-words leading-tight`,children:s})]},c)),e.jsx("div",{className:"animate-pulse text-green-500 font-bold",children:"_"})]})]})})},N=({opacity:r=.2})=>{const t=n.useRef(),{viewport:a}=p(),o=n.useMemo(()=>new E({uniforms:{uTime:{value:0},uColor:{value:new T("#00ff41")},uOpacity:{value:r}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,fragmentShader:`
                varying vec2 vUv;
                uniform float uTime;
                uniform vec3 uColor;
                uniform float uOpacity;

                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }

                void main() {
                    vec2 uv = vUv;
                    
                    // Grid columns
                    float columns = 60.0;
                    vec2 ipos = floor(uv * columns);
                    
                    // Rain speed varying per column
                    float speed = 1.0 + random(vec2(ipos.x, 1.33)) * 2.0;
                    float y = mod(uv.y + uTime * speed * 0.1, 1.0);

                    // Matrix character flickering / trail
                    float strength = 1.0 - step(0.1, random(vec2(ipos.x, floor(y * 40.0)))); 
                    strength *= (1.0 - fract(y * 10.0)); // Fade trail
                    
                    // Leading bright head
                    float head = 1.0 - step(0.005, y); 
                    
                    vec3 color = uColor * (strength + head * 1.5);
                    gl_FragColor = vec4(color, (strength + head) * uOpacity);
                }
            `,transparent:!0,depthWrite:!1,side:S}),[r]);return h(i=>{if(t.current&&t.current.material&&t.current.material.uniforms){const s=t.current.material.uniforms;s.uTime&&(s.uTime.value=i.clock.getElapsedTime()),s.uOpacity&&(s.uOpacity.value=r)}}),e.jsxs("mesh",{ref:t,scale:[a.width*2,a.height*2,1],position:[0,0,-8],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("primitive",{object:o,attach:"material"})]})},L=()=>{const r=g(s=>s.setScene),[t,a]=n.useState(0),o=n.useRef(),{camera:i}=p();return n.useEffect(()=>{if(t===1){const s=setTimeout(()=>a(2),3e3);return()=>clearTimeout(s)}if(t===2){const s=setTimeout(()=>r("hub"),2e3);return()=>clearTimeout(s)}},[t,r]),h(s=>{const c=s.clock.getElapsedTime();t===1&&o.current&&(o.current.scale.setScalar(1+Math.sin(c*3)*.1),Math.random()>.95?o.current.rotation.y+=(Math.random()-.5)*.3:o.current.rotation.y+=.02,i.position.x=Math.sin(c*10)*.02,i.position.y=Math.cos(c*8)*.02),t===2&&(i.position.z=f.lerp(i.position.z,3,.05),i.position.x=f.lerp(i.position.x,0,.1),i.position.y=f.lerp(i.position.y,0,.1))}),e.jsxs("group",{children:[e.jsxs("mesh",{position:[0,-5,-10],rotation:[-Math.PI/3,0,0],children:[e.jsx("planeGeometry",{args:[50,50]}),e.jsx("meshBasicMaterial",{color:"#001100",wireframe:!0,opacity:.2,transparent:!0})]}),e.jsx("gridHelper",{args:[50,50,"#00ff41","#003311"],position:[0,-5,-5],rotation:[0,0,0]}),e.jsx(N,{count:50}),e.jsx(R,{radius:100,depth:50,count:5e3,factor:4,saturation:0,fade:!0,speed:1}),t===0&&e.jsxs("group",{children:[e.jsx(m,{count:300,scale:15,size:3,speed:.5,opacity:.6,color:"#00ff41"}),e.jsx(l,{position:[0,1,0],fontSize:.5,color:"#00ff41",anchorX:"center",anchorY:"center",outlineWidth:.02,outlineColor:"#003311",children:"SYSTEM_BOOT_SEQUENCE"}),e.jsx(M,{onComplete:()=>a(1)})]}),t>=1&&e.jsxs("group",{children:[e.jsx(m,{count:500,scale:20,size:4,speed:1.5,opacity:t===2?0:.8,color:"#00ff41"}),e.jsxs("group",{ref:o,children:[e.jsxs(j,{speed:5,rotationIntensity:.5,floatIntensity:.5,children:[e.jsxs("mesh",{position:[0,0,0],scale:1.5,children:[e.jsx("icosahedronGeometry",{args:[1,0]}),e.jsx("meshStandardMaterial",{color:"#00ff41",wireframe:!0,transparent:!0,opacity:t===2?0:.3,emissive:"#00ff41",emissiveIntensity:.5})]}),e.jsxs("mesh",{position:[0,0,0],children:[e.jsx("octahedronGeometry",{args:[1,0]}),e.jsx("meshStandardMaterial",{color:"#00ff41",wireframe:!0,transparent:!0,opacity:t===2?0:1,emissive:"#00ff41",emissiveIntensity:1})]}),e.jsxs("mesh",{position:[0,0,0],scale:.3,children:[e.jsx("sphereGeometry",{args:[1,16,16]}),e.jsx("meshStandardMaterial",{color:"#00ff41",transparent:!0,opacity:t===2?0:1,emissive:"#00ff41",emissiveIntensity:3})]})]}),e.jsx("pointLight",{position:[0,0,0],intensity:t===2?0:10,color:"#00ff41",distance:10})]}),e.jsx(l,{position:[0,-1.5,0],fontSize:.3,color:"white",anchorX:"center",outlineWidth:.01,outlineColor:"#00ff41",children:"METAVERSE_OS"})]}),t===2&&e.jsxs("group",{children:[e.jsx(m,{count:1e3,scale:30,size:6,speed:2,opacity:1,color:"#00ff41"}),e.jsx(l,{position:[0,0,2],fontSize:1.2,color:"#00ff41",anchorX:"center",scale:[1,1,1],outlineWidth:.05,outlineColor:"#003311",letterSpacing:.1,children:"ACCESS GRANTED"}),e.jsx(l,{position:[0,-1,2],fontSize:.35,color:"#00ff41",anchorX:"center",scale:[1,1,1],outlineWidth:.02,outlineColor:"#003311",children:"WELCOME, DIRECTOR."}),e.jsxs("mesh",{position:[0,0,0],rotation:[Math.PI/2,0,0],children:[e.jsx("torusGeometry",{args:[3,.05,16,100]}),e.jsx("meshBasicMaterial",{color:"#00ff41",transparent:!0,opacity:.5})]})]})]})};export{L as default};
