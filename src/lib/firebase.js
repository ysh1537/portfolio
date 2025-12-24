/**
 * firebase.js
 * Firebase 설정 및 Firestore 초기화
 * 
 * Spark 요금제 (무료) - 절대 과금되지 않음
 * - 하루 50,000 읽기, 20,000 쓰기
 * - 1GB 저장소
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDSFXuCK0G6l1qaEeHRibMUYfKarOZtZYw",
    authDomain: "portfolio-guestbook-5ee79.firebaseapp.com",
    projectId: "portfolio-guestbook-5ee79",
    storageBucket: "portfolio-guestbook-5ee79.firebasestorage.app",
    messagingSenderId: "341239700624",
    appId: "1:341239700624:web:ac6b3a4e2984a6d83dcc15"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore 인스턴스
export const db = getFirestore(app);

export default app;
