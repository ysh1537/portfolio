/**
 * AnonymousGuestbook.jsx
 * Firebase 기반 익명 방명록 컴포넌트
 * 
 * 기능:
 * - 닉네임 + 메시지만 입력
 * - 실시간 방명록 목록 표시
 * - 최신순 정렬
 */
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import {
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';

const AnonymousGuestbook = () => {
    const [entries, setEntries] = useState([]);
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // 실시간 방명록 구독
    useEffect(() => {
        const q = query(
            collection(db, 'guestbook'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newEntries = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEntries(newEntries);
        }, (err) => {
            console.error('[Guestbook] 로드 실패:', err);
            setError('방명록을 불러올 수 없습니다.');
        });

        return () => unsubscribe();
    }, []);

    // 방명록 작성
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nickname.trim() || !message.trim()) {
            setError('닉네임과 메시지를 모두 입력해주세요.');
            return;
        }

        if (nickname.length > 20 || message.length > 500) {
            setError('닉네임은 20자, 메시지는 500자 이내로 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await addDoc(collection(db, 'guestbook'), {
                nickname: nickname.trim(),
                message: message.trim(),
                createdAt: serverTimestamp()
            });

            setNickname('');
            setMessage('');
        } catch (err) {
            console.error('[Guestbook] 작성 실패:', err);
            setError('방명록 작성에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 날짜 포맷
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return new Intl.DateTimeFormat('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="w-full h-full flex flex-col text-white font-mono">
            {/* 헤더 */}
            <div className="text-center mb-4">
                <h3 className="text-cyan-400 font-bold text-lg mb-1">📝 GUESTBOOK UNLOCKED</h3>
                <p className="text-gray-400 text-xs">섹터 안정화에 성공하셨군요! 방명록을 남겨주세요.</p>
            </div>

            {/* 입력 폼 */}
            <form onSubmit={handleSubmit} className="mb-4 space-y-2">
                <input
                    type="text"
                    placeholder="닉네임 (최대 20자)"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={20}
                    className="w-full px-3 py-2 bg-black/50 border border-cyan-500/30 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
                <textarea
                    placeholder="메시지를 남겨주세요 (최대 500자)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full px-3 py-2 bg-black/50 border border-cyan-500/30 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-none"
                />
                {error && (
                    <p className="text-red-400 text-xs">{error}</p>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 rounded text-sm font-bold transition-all ${isSubmitting
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-cyan-600 text-white hover:bg-cyan-500'
                        }`}
                >
                    {isSubmitting ? '전송 중...' : '방명록 남기기'}
                </button>
            </form>

            {/* 방명록 목록 */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {entries.length === 0 ? (
                    <p className="text-gray-500 text-center text-sm py-4">
                        아직 방명록이 없습니다. 첫 번째로 남겨보세요!
                    </p>
                ) : (
                    entries.map((entry) => (
                        <div
                            key={entry.id}
                            className="p-3 bg-black/40 border border-cyan-500/20 rounded"
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-cyan-300 font-bold text-sm">
                                    {entry.nickname}
                                </span>
                                <span className="text-gray-500 text-xs">
                                    {formatDate(entry.createdAt)}
                                </span>
                            </div>
                            <p className="text-gray-200 text-sm whitespace-pre-wrap break-words">
                                {entry.message}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AnonymousGuestbook;
