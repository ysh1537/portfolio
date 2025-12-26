import{t as s,w as c,n as u,a3 as f,m as p,C as r,z as e,ad as v,a4 as d}from"./three-B9-2A0-2.js";import"./vendor-CqO7gtIP.js";const i={uniforms:{uColorInner:{value:new r("#ffaa00")},uColorOuter:{value:new r("#00ffff")}},vertexShader:`
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,fragmentShader:`
        uniform float uTime;
        uniform vec3 uColorInner;
        uniform vec3 uColorOuter;
        varying vec2 vUv;
        varying vec3 vPosition;

        // Simple Noise
        float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
            // Center is (0.5, 0.5)
            vec2 center = vec2(0.5);
            vec2 pos = vUv - center;
            float r = length(pos) * 2.0; // Radius 0 to 1
            float angle = atan(pos.y, pos.x);

            // Black Hole Event Horizon (Center)
            float eventHorizon = smoothstep(0.15, 0.2, r); // Smaller black hole hole
            
            // Accretion Disk Pattern
            // Spiral rotation
            float spiral = angle + 10.0 / (r + 0.1) - uTime * 2.0;
            float diskNoise = noise(vec2(r * 10.0, spiral * 5.0));
            
            // Soft glow
            float glow = 1.0 / (r + 0.1) * 0.1;
            
            // Disk Ring
            float disk = smoothstep(0.2, 0.5, r) * smoothstep(1.0, 0.4, r); // Wider fade out
            
            // Color mixing
            vec3 color = mix(uColorOuter, uColorInner, diskNoise);
            color += glow * uColorOuter;
            
            // Apply patterns
            float intensity = disk * (0.8 + 0.2 * diskNoise) + glow;
            
            // Final masking
            vec3 finalColor = color * intensity * eventHorizon;
            
            // Alpha fade at edges (Ensure scale is large enough so this fade happens off-screen or smooth)
            float alpha = smoothstep(0.0, 0.1, intensity);

            gl_FragColor = vec4(finalColor, alpha);
        }
    `},x=({isFinished:m})=>{const o=s.useRef();c(l=>{const a=l.clock.getElapsedTime();o.current&&(o.current.uniforms.uTime.value=a*2);const t=1+Math.sin(a*3)*.05;o.current&&o.current.parent&&o.current.parent.scale.set(t,t,1)});const n=s.useMemo(()=>new u({uniforms:{uTime:{value:0},uColorInner:{value:new r("#ffaa00")},uColorOuter:{value:new r("#00ccff")}},vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,transparent:!0,side:p,depthWrite:!1,blending:f}),[]);return e.jsxs("group",{children:[e.jsx(v,{radius:100,depth:50,count:5e3,factor:4,saturation:0,fade:!0,speed:3}),e.jsxs("mesh",{rotation:[-Math.PI/3,0,0],scale:[2,2,2],children:[e.jsx("planeGeometry",{args:[50,50]})," ",e.jsx("primitive",{object:n,attach:"material",ref:o})]}),e.jsx("group",{rotation:[-Math.PI/3,0,0],children:e.jsx(d,{count:500,scale:[20,20,5],size:4,speed:2,opacity:.6,color:"#ffaa00"})}),e.jsxs("mesh",{position:[0,0,.1],children:[e.jsx("sphereGeometry",{args:[2,64,64]}),e.jsx("meshBasicMaterial",{color:"#000000"})]})]})};export{x as default};
