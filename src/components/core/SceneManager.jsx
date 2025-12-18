import { Suspense, lazy } from 'react';
import { useStore } from '../../hooks/useStore';

// Dynamic Imports for Code Splitting
const BootScene = lazy(() => import('../../scenes/system/BootScene'));
const HubScene = lazy(() => import('../../scenes/main/HubScene'));
const ProfileScene = lazy(() => import('../../scenes/main/ProfileScene'));
const Lab01Scene = lazy(() => import('../../scenes/labs/Lab01Scene'));
const Lab02Scene = lazy(() => import('../../scenes/labs/Lab02Scene'));
const Lab03Scene = lazy(() => import('../../scenes/labs/Lab03Scene'));
const Lab04Scene = lazy(() => import('../../scenes/labs/Lab04Scene'));
const ContactScene = lazy(() => import('../../scenes/main/ContactScene'));

const SceneManager = () => {
    const activeScene = useStore((state) => state.currentScene);

    return (
        <Suspense fallback={null}>
            <group>
                {activeScene === 'boot' && <BootScene />}
                {activeScene === 'hub' && <HubScene />}
                {activeScene === 'profile' && <ProfileScene />}
                {activeScene === 'lab01' && <Lab01Scene />}
                {activeScene === 'contact' && <ContactScene />}

                {activeScene === 'lab02' && <Lab02Scene />}
                {activeScene === 'lab03' && <Lab03Scene />}
                {activeScene === 'lab04' && <Lab04Scene />}
            </group>
        </Suspense>
    );
};

export default SceneManager;
