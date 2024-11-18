import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
let loaded = false;

const initFFmpeg = async () => {
  if (ffmpeg && loaded) return ffmpeg;

  try {
    ffmpeg = new FFmpeg();
    
    // Load FFmpeg with correct CORS headers
    await ffmpeg.load({
      coreURL: await toBlobURL(
        'https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.js',
        'text/javascript'
      ),
      wasmURL: await toBlobURL(
        'https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.wasm',
        'application/wasm'
      ),
    });

    loaded = true;
    return ffmpeg;
  } catch (error) {
    console.error('FFmpeg loading error:', error);
    throw new Error('Failed to load FFmpeg');
  }
};

export const createVideo = async (frames: string[]): Promise<void> => {
  try {
    const ffmpeg = await initFFmpeg();
    if (!ffmpeg) throw new Error('FFmpeg failed to initialize');

    // Convert base64 frames to files and write them
    for (let i = 0; i < frames.length; i++) {
      const fileName = `frame${i.toString().padStart(4, '0')}.jpg`;
      await ffmpeg.writeFile(fileName, frames[i]);
    }

    // Generate video from frames
    await ffmpeg.exec([
      '-framerate', '10',
      '-pattern_type', 'glob',
      '-i', 'frame*.jpg',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      'output.mp4'
    ]);

    // Read the output file
    const data = await ffmpeg.readFile('output.mp4');
    const blob = new Blob([data], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);

    // Download the video
    const link = document.createElement('a');
    link.href = url;
    link.download = 'glitch-art.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Cleanup
    frames.forEach((_, i) => {
      const fileName = `frame${i.toString().padStart(4, '0')}.jpg`;
      ffmpeg.deleteFile(fileName);
    });
    ffmpeg.deleteFile('output.mp4');
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};