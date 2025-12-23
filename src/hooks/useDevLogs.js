import { useState, useEffect } from 'react';
import { client, isCMSConfigured } from '../lib/sanity';
import { devLogs as localLogs } from '../data/DevLogData';

export const useDevLogs = () => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [source, setSource] = useState('LOCAL'); // 'LOCAL' or 'CMS'

    useEffect(() => {
        const fetchLogs = async () => {
            // 1. CMS 설정이 없는 경우 -> 로컬 데이터 사용
            if (!isCMSConfigured()) {
                console.log("[System] No Sanity Config found. Using Local Archives.");
                setLogs(localLogs);
                setSource('LOCAL');
                setIsLoading(false);
                return;
            }

            // 2. CMS 설정이 있는 경우 -> 데이터 페칭 시도
            try {
                console.log("[System] Connecting to Satellite Link (Sanity.io)...");
                const query = `*[_type == "devLog"] | order(date desc) {
                    _id,
                    title,
                    date,
                    tags,
                    summary,
                    content
                }`;

                const sanityLogs = await client.fetch(query);

                // 데이터 매핑 (Sanity format -> Local format)
                const mappedLogs = sanityLogs.map(log => ({
                    id: log._id,
                    title: log.title,
                    date: log.date,
                    tags: log.tags || [],
                    summary: log.summary,
                    content: log.content // Markdown text
                }));

                // 데이터 병합 (CMS Logs + Local Logs)
                // CMS에서 작성한 글이 위에 오도록 정렬
                const combinedLogs = [...mappedLogs, ...localLogs];

                // 중복 제거 (혹시 ID가 겹칠 경우 CMS 우선)
                const uniqueLogs = Array.from(new Map(combinedLogs.map(log => [log.id, log])).values());

                setLogs(uniqueLogs);
                setSource('HYBRID (CMS + LOCAL)');
                console.log(`[System] Satellite Link Established. ${mappedLogs.length} CMS logs + ${localLogs.length} Local logs.`);

            } catch (error) {
                // 3. 페칭 실패 시 -> 로컬 데이터로 폴백 (안전장치)
                console.error("[System] Satellite Link Failed:", error);
                console.warn("[System] Switching to Emergency Local Backup.");
                setLogs(localLogs);
                setSource('LOCAL_BACKUP');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

    return { logs, isLoading, source };
};
