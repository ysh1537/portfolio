import { useEffect, useRef } from 'react';

/**
 * Google AdSense 배너 컴포넌트
 * - 섹션 사이에 배치하여 자연스럽게 광고 표시
 * - 광고 로딩 실패 시에도 레이아웃 유지
 */
const AdBanner = ({ className = "" }) => {
    const adRef = useRef(null);
    const isLoaded = useRef(false);

    useEffect(() => {
        // 광고가 이미 로드되었거나 ref가 없으면 스킵
        if (isLoaded.current || !adRef.current) return;

        try {
            // AdSense 스크립트가 로드되었는지 확인
            if (typeof window !== 'undefined' && window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                isLoaded.current = true;
            }
        } catch (error) {
            console.log('[AdSense] 광고 로딩 중 오류:', error);
        }
    }, []);

    return (
        <div className={`ad-container flex justify-center items-center py-6 ${className}`}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{
                    display: 'block',
                    minHeight: '90px',
                    width: '100%',
                    maxWidth: '728px'
                }}
                data-ad-client="ca-pub-5874227298630347"
                data-ad-slot="auto"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
};

export default AdBanner;
