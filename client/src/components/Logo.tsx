import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { Player } from '@lordicon/react';

import curatubeLogo from "@/assets/curatube-logo.json";

export const Logo: FC = () => {
    const playerRef = useRef<Player>(null);

    useEffect(() => {
        playerRef.current?.playFromBeginning();
    }, []);

    const handleComplete = () => {
        setTimeout(() => {
            playerRef.current?.playFromBeginning();
        }, 2000); // ⏳ wait 2s before replay
    };

    return (
        <div>
            <Player
                ref={playerRef}
                size={45}
                icon={curatubeLogo}
                onComplete={handleComplete}
            />
        </div>
    );
};
