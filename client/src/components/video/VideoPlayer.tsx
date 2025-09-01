
import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";


import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
    PlyrLayout,
    plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";

import '../../index.css';

interface VideoPlayerProps {
    src: string;
    thumbnail: string;
    title: string;
    duration?: number;
    autoPlay?: boolean;
    className?: string;
}

function VideoPlayer({ src, thumbnail, title, duration, autoPlay = true,className='' }:VideoPlayerProps) {
    return (
        <MediaPlayer
            title={title}
            src={src}
            playsInline
            poster={thumbnail}
            crossOrigin
            autoPlay={autoPlay}
            duration={duration}
            className={` h-auto w-full ${className}`}
        >
            <MediaProvider/>
            <PlyrLayout clickToFullscreen clickToPlay  icons={plyrLayoutIcons} />
        </MediaPlayer>
    );
}

export default VideoPlayer;