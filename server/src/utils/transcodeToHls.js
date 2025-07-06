import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs-extra';
import path from 'path';
export async function transcodeToHLS(videoPath, outputDir) {
    await fs.ensureDir(outputDir); // Ensure output directory exists
    const outputPlaylist = path.join(outputDir, 'playlist.m3u8');
    console.log('FFmpeg input:', videoPath);
    console.log('FFmpeg output:', outputPlaylist);

    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .outputOptions([
                '-profile:v baseline',
                '-level 3.0',
                '-start_number 0',
                '-hls_time 10',
                '-hls_list_size 0',
                '-f hls'
            ])
            .output(outputPlaylist)
            .on('start', command => console.log('FFmpeg command:', command))
            .on('end', () => resolve())
            .on('error', err => reject(new Error(`HLS transcoding failed: ${err}`)))
            .run();
    });
}




