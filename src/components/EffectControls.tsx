import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { EffectSettings } from './types';

interface EffectControlsProps {
  settings: EffectSettings;
  isPlaying: boolean;
  onSettingChange: (key: keyof EffectSettings, value: number) => void;
  onPlayPause: () => void;
  onReset: () => void;
}

const EffectControls: React.FC<EffectControlsProps> = ({
  settings,
  isPlaying,
  onSettingChange,
  onPlayPause,
  onReset,
}) => {
  const EffectSlider = ({ name, value, label }: { name: keyof EffectSettings; value: number; label: string }) => (
    <div className="mb-4">
      <label className="text-sm text-white font-medium flex justify-between">
        <span>{label}</span>
        <span>{value.toFixed(2)}</span>
      </label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => onSettingChange(name, Number(e.target.value))}
        className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );

  return (
    <div className="w-full md:w-64 bg-purple-900/50 p-6 rounded-lg backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-purple-200">Effect Controls</h3>
        <div className="flex gap-2">
          <button
            onClick={onPlayPause}
            className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
            title="Reset Effects"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold mb-3 text-purple-300">Glitch Effects</h4>
          <EffectSlider name="intensity" value={settings.intensity} label="Glitch Intensity" />
          <EffectSlider name="rgbSplit" value={settings.rgbSplit} label="RGB Split" />
          <EffectSlider name="scanlines" value={settings.scanlines} label="Scanlines" />
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3 text-purple-300">Color Effects</h4>
          <EffectSlider name="colorShift" value={settings.colorShift} label="Color Shift" />
          <EffectSlider name="hueRotate" value={settings.hueRotate} label="Hue Rotation" />
          <EffectSlider name="saturation" value={settings.saturation} label="Saturation" />
          <EffectSlider name="contrast" value={settings.contrast} label="Contrast" />
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3 text-purple-300">Distortion</h4>
          <EffectSlider name="waveAmplitude" value={settings.waveAmplitude} label="Wave Amplitude" />
          <EffectSlider name="waveFrequency" value={settings.waveFrequency} label="Wave Frequency" />
          <EffectSlider name="pixelation" value={settings.pixelation} label="Pixelation" />
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3 text-purple-300">VCR Effects</h4>
          <EffectSlider name="noise" value={settings.noise} label="Noise" />
          <EffectSlider name="vhsTracking" value={settings.vhsTracking} label="VHS Tracking" />
          <EffectSlider name="signalInterference" value={settings.signalInterference} label="Signal Interference" />
        </div>
      </div>
    </div>
  );
};

export default EffectControls;