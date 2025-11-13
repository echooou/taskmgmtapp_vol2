import { initialize } from "@microsoft/power-apps/app";
import { useEffect, useState, type ReactNode } from "react";

interface PowerProviderProps {
    children: ReactNode;
}

export default function PowerProvider({ children }: PowerProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false);
    const [initError, setInitError] = useState<Error | null>(null);

    useEffect(() => {
        const initApp = async () => {
            try {
                console.log('Power Platform SDK initializing...');
                await initialize();
                console.log('Power Platform SDK initialized successfully');
                setIsInitialized(true);
            } catch (error) {
                console.error('Failed to initialize Power Platform SDK:', error);
                setInitError(error instanceof Error ? error : new Error('Unknown error'));
                // エラーが発生してもアプリを表示
                setIsInitialized(true);
            }
        };
        
        initApp();
    }, []);

    // 初期化中の表示
    if (!isInitialized) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(to bottom right, #eff6ff, #f3e8ff, #fce7f3)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                        fontSize: '2rem', 
                        marginBottom: '1rem',
                        animation: 'spin 1s linear infinite'
                    }}>⚡</div>
                    <p>アプリを読み込んでいます...</p>
                </div>
            </div>
        );
    }

    // 初期化エラーがあっても警告を表示してアプリを続行
    if (initError) {
        console.warn('App is running with SDK initialization error:', initError.message);
    }

    return <>{children}</>;
}
