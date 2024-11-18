import React, { useState } from 'react';
import { FileVideo, Film, Loader2 } from 'lucide-react';
import { createGIF } from '../utils/gifEncoder';
import { createVideo } from '../utils/videoEncoder';

interface ExportButtonsProps {
  frames: string[];
  onExportStart: () => void;
  onExportEnd: () => void;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ frames, onExportStart, onExportEnd }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportGIF = async () => {
    if (frames.length === 0) return;
    
    setIsExporting(true);
    onExportStart();

    try {
      await createGIF(frames, 'glitch-art.gif');
    } catch (error) {
      console.error('Failed to create GIF:', error);
    }

    setIsExporting(false);
    onExportEnd();
  };

  const handleExportVideo = async () => {
    if (frames.length === 0) return;
    
    setIsExporting(true);
    onExportStart();

    try {
      await createVideo(frames, 'glitch-art.mp4');
    } catch (error) {
      console.error('Failed to create video:', error);
    }

    setIsExporting(false);
    onExportEnd();
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleExportGIF}
        disabled={isExporting || frames.length === 0}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors"
      >
        {isExporting ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <Film size={20} />
        )}
        Export as GIF
      </button>
      <button
        onClick={handleExportVideo}
        disabled={isExporting || frames.length === 0}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors"
      >
        {isExporting ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <FileVideo size={20} />
        )}
        Export as Video
      </button>
    </div>
  );
};

export default ExportButtons;