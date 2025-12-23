import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';

// Sanity Client Configuration
// 프로젝트 ID가 없으면 클라이언트를 생성하지 않음 (로컬 데이터 모드)
export const client = projectId
    ? createClient({
        projectId,
        dataset,
        useCdn: false, // 실시간 데이터 반영을 위해 false로 설정
        apiVersion: '2023-05-03', // API 버전
    })
    : null;

// 이미지 URL 빌더
const builder = client ? imageUrlBuilder(client) : null;

export const urlFor = (source) => {
    return builder ? builder.image(source) : null;
};

// CMS 연결 상태 확인용 함수
export const isCMSConfigured = () => {
    return !!projectId;
};
