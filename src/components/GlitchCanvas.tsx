import React, { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import EffectControls from './EffectControls';
import { EffectSettings } from './types';

interface GlitchCanvasProps {
  imageUrl: string | null;
  onCapture: (dataUrl: string) => void;
}

const defaultSettings: EffectSettings = {
  intensity: 0.5,
  colorShift: 0.3,
  pixelation: 0.5,
  noise: 0.2,
  waveAmplitude: 0.3,
  waveFrequency: 0.5,
  rgbSplit: 0.3,
  hueRotate: 0,
  scanlines: 0.3,
  vhsTracking: 0.2,
  signalInterference: 0.3,
  saturation: 0.5,
  contrast: 0.5,
};

const GlitchCanvas: React.FC<GlitchCanvasProps> = ({ imageUrl, onCapture }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const timeRef = useRef<number>(0);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  const [settings, setSettings] = useState<EffectSettings>(defaultSettings);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      originalImageRef.current = img;
      if (canvasRef.current) {
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
      }
    };
  }, [imageUrl]);

  const applyEffects = (time: number) => {
    if (!canvasRef.current || !originalImageRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset canvas with original image
    ctx.drawImage(originalImageRef.current, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d')!;

    // Apply effects
    for (let i = 0; i < data.length; i += 4) {
      // Signal interference
      const interference = Math.sin(time * 0.001 + i * settings.signalInterference) * 50;
      
      // RGB Split
      const rgbOffset = Math.floor(settings.rgbSplit * 20);
      data[i] = data[i + rgbOffset] || data[i];
      data[i + 2] = data[i - rgbOffset] || data[i + 2];

      // VHS Tracking
      const tracking = Math.sin(time * 0.002 + (i / 4) * settings.vhsTracking) * 30;
      
      // Color manipulation
      const saturationFactor = 1 + settings.saturation;
      const contrastFactor = 1 + settings.contrast * 2;
      
      // Apply color effects
      for (let j = 0; j < 3; j++) {
        let value = data[i + j];
        
        // Apply contrast
        value = ((value / 255 - 0.5) * contrastFactor + 0.5) * 255;
        
        // Apply saturation
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        value = avg + (value - avg) * saturationFactor;
        
        // Apply noise and interference
        if (Math.random() < settings.noise) {
          value += (Math.random() - 0.5) * 50;
        }
        value += interference + tracking;
        
        data[i + j] = Math.max(0, Math.min(255, value));
      }
    }

    tempCtx.putImageData(imageData, 0, 0);

    // Wave distortion
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const sliceHeight = Math.max(1, Math.floor(canvas.height / (100 - settings.pixelation * 90)));
    const numSlices = canvas.height / sliceHeight;

    for (let i = 0; i < numSlices; i++) {
      const y = i * sliceHeight;
      const waveOffset = Math.sin(time * 0.001 * settings.waveFrequency + i * 0.1) * 
                        settings.waveAmplitude * 30;

      ctx.drawImage(
        tempCanvas,
        0, y, canvas.width, sliceHeight,
        waveOffset, y, canvas.width, sliceHeight
      );
    }

    // Scanlines
    if (settings.scanlines > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${settings.scanlines * 0.3})`;
      for (let i = 0; i < canvas.height; i += 2) {
        ctx.fillRect(0, i, canvas.width, 1);
      }
    }

    if (isPlaying) {
      timeRef.current = time;
      requestRef.current = requestAnimationFrame(applyEffects);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(applyEffects);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [settings, isPlaying]);

  const handleCapture = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      onCapture(dataUrl);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    if (canvasRef.current && originalImageRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(originalImageRef.current, 0, 0);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <canvas
          ref={canvasRef}
          className="max-w-full border-4 border-purple-500 rounded-lg shadow-xl"
        />
        <button
          onClick={handleCapture}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Camera size={20} />
          Capture Frame
        </button>
      </div>
      <EffectControls
        settings={settings}
        isPlaying={isPlaying}
        onSettingChange={(key, value) => setSettings(prev => ({ ...prev, [key]: value }))}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onReset={handleReset}
      />
    </div>
  );
};

export default GlitchCanvas;