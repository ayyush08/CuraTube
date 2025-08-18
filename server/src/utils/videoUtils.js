import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs-extra';
import path from 'path';
export async function transcodeToHLS(videoUrl, outputDir) {
    await fs.ensureDir(outputDir); // Ensure output directory exists
    const outputPlaylist = path.join(outputDir, 'playlist.m3u8');
    console.log('FFmpeg input:', videoUrl);
    console.log('FFmpeg output:', outputPlaylist);

    return new Promise((resolve, reject) => {
        ffmpeg(videoUrl)
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




export async function getVideoDuration(inputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(inputPath, (err, metadata) => {
            if (err) return reject(err);
            resolve(metadata.format.duration);
        });
    });
}


export const rewriteM3U8Playlist = async (playlistPath, segmentMap) => {
    let content = await fs.promises.readFile(playlistPath, 'utf-8');
    for (const [name, url] of Object.entries(segmentMap)) {
        content = content.replace(new RegExp(name, 'g'), url);
    }
    await fs.promises.writeFile(playlistPath, content, 'utf-8');
};
