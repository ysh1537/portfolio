# 🌌 Cinematic Multiverse Lab
>
> **"Code is the DNA of a new reality."**

**Cinematic Multiverse Lab**은 단순한 포트폴리오 웹사이트가 아닌, 개발자 **허예솔(Yesol Heo)**의 기술적 상상력이 시각화된 **디지털 실험실**입니다. React와 Three.js를 활용하여, 웹 브라우저 상에서 몰입감 있는 3D 메타버스 경험을 제공합니다.

🔗 **Live Portal**: [https://heoyesol.kr](https://heoyesol.kr)

---

## 🧭 The Sectors (주요 기능)

이 프로젝트는 **'차원 실험실(Dimension Lab)'**이라는 컨셉 아래 4개의 구역으로 나뉩니다.

- **🛸 Sector 01: The Gateway (Main)**
  - 방문자를 맞이하는 3D 허브 공간.
  - 전체 내비게이션 및 포털 역할.
- **🧬 Sector 02: Bio-Data Lab (Creatures)**
  - 생성형 AI와 알고리즘으로 탄생한 '크리처'들을 관리하고 수집하는 공간.
  - 가차(Gacha) 시스템 및 도감 기능 포함.
- **📚 Sector 03: The Archive (Portfolio)**
  - 개발자의 이력, 프로젝트, 기술 스택을 홀로그램 인터페이스로 열람.
- **🚧 Sector 04: The Flux (Debug)**
  - 와이어프레임 쉐이더와 물리 엔진 실험이 이루어지는 개발자 전용 공간.

---

## 🛠 Tech Stack (기술 스택)

### Core

- **React 18**
- **Vite**
- **JavaScript (ES6+)**

### 3D & Graphics

- **Three.js**
- **@react-three/fiber (R3F)**
- **@react-three/drei**
- **@react-three/postprocessing** (Bloom, Vignette, Glitch)
- **GSAP** (Cinematic Animations)

### Styling & UI

- **TailwindCSS**
- **Sass (SCSS)**
- **Framer Motion**

### State Management

- **Zustand**

---

## 🚀 Getting Started (로컬 실행)

이 차원에 접속하려면 다음 절차를 따르십시오.

\`\`\`bash

# 1. Repository Clone

git clone <https://github.com/ysh1537/portfolio.git>

# 2. Install Dependencies

npm install

# 3. Initialize Server

npm run dev

## 🚀 Deployment (Automated)

이 프로젝트는 **GitHub Actions**를 통해 자동 배포됩니다.
`main` 브랜치에 코드가 푸시되면(push), 자동으로 빌드되어 `docs/` 폴더가 업데이트되고 라이브 서버(`heoyesol.kr`)에 반영됩니다.

### 수동 배포가 필요한 경우 (비권장)

```bash
npm run build
git add docs
git commit -m "Manual deploy"
git push
```\`\`

---

## 📄 License

This project is licensed under the MIT License.

---
Created by **Yesol Heo** (Dimension Architect).
