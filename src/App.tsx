import React, { useState, useCallback } from 'react';
import { Upload, Download, Sparkles } from 'lucide-react';
import GlitchCanvas from './components/GlitchCanvas';
import ExportButtons from './components/ExportButtons';

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [capturedFrames, setCapturedFrames] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = useCallback((dataUrl: string) => {
    setCapturedFrames((prev) => [...prev, dataUrl]);
  }, []);

  const handleDownload = (dataUrl: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `glitch-art-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-purple-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
              Psychedelic Art Generator
            </span>
            <Sparkles className="text-purple-400" />
          </h1>
          <p className="text-purple-200 text-lg">
            Transform your images into mesmerizing digital art with real-time effects
          </p>
        </header>

        {!selectedImage ? (
          <div className="flex flex-col items-center justify-center border-4 border-dashed border-purple-500 rounded-xl p-16 bg-purple-900/30 backdrop-blur-sm">
            <Upload size={64} className="text-purple-400 mb-6" />
            <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg transition-colors text-lg font-medium">
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-12">
            <GlitchCanvas imageUrl={selectedImage} onCapture={handleCapture} />
            
            {capturedFrames.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-purple-200">Gallery</h2>
                  <ExportButtons
                    frames={capturedFrames}
                    onExportStart={() => setIsExporting(true)}
                    onExportEnd={() => setIsExporting(false)}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {capturedFrames.map((frame, index) => (
                    <div key={index} className="relative group rounded-lg overflow-hidden">
                      <img
                        src={frame}
                        alt={`Captured frame ${index + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <button
                        onClick={() => handleDownload(frame)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                      >
                        <Download className="w-8 h-8" />
                        <span className="text-sm font-medium">Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;