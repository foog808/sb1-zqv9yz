import GIF from 'gif.js';

export const createGIF = (frames: string[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: 800,
      height: 600,
    });

    const loadedImages = frames.map(
      (frame) =>
        new Promise<HTMLImageElement>((resolveImage) => {
          const img = new Image();
          img.onload = () => resolveImage(img);
          img.src = frame;
        })
    );

    Promise.all(loadedImages).then((images) => {
      images.forEach((image) => {
        gif.addFrame(image, { delay: 100 });
      });

      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'glitch-art.gif';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resolve();
      });

      gif.render();
    });
  });
};