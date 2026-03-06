import React from "react";
import { ChatWidgetSettings, PERSONALITY_OPTIONS, LANGUAGE_OPTIONS } from "./types";
import { X, Thermometer, BarChart3, FileText } from "lucide-react";

interface SettingsPanelProps {
  settings: ChatWidgetSettings;
  onChange: (settings: ChatWidgetSettings) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange, onClose }) => {
  return (
    <div className="flex-1 overflow-y-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
        <h3 className="font-semibold text-white/90 text-sm">Settings</h3>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-4 h-4 text-white/50" />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Personality Mode */}
        <div>
          <label className="block text-[11px] font-medium text-white/40 uppercase tracking-wider mb-2">
            Personality Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PERSONALITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ ...settings, personality: opt.value })}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  settings.personality === opt.value
                    ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30"
                    : "bg-white/[0.03] text-white/50 hover:bg-white/[0.06] border border-white/[0.06]"
                }`}
              >
                <span className="text-base">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="block text-[11px] font-medium text-white/40 uppercase tracking-wider mb-2">
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => onChange({ ...settings, language: e.target.value as any })}
            className="w-full px-3 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] text-sm text-white/70 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Temperature Slider */}
        <div>
          <label className="flex items-center gap-2 text-[11px] font-medium text-white/40 uppercase tracking-wider mb-3">
            <Thermometer className="w-3.5 h-3.5" />
            Temperature — {(settings.temperature ?? 0.7).toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={settings.temperature ?? 0.7}
            onChange={(e) => onChange({ ...settings, temperature: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-400/30"
          />
          <div className="flex justify-between text-[10px] text-white/25 mt-1">
            <span>Precise</span>
            <span>Creative</span>
          </div>
        </div>

        {/* Top-P Slider */}
        <div>
          <label className="flex items-center gap-2 text-[11px] font-medium text-white/40 uppercase tracking-wider mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            Top-P — {(settings.topP ?? 0.9).toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.topP ?? 0.9}
            onChange={(e) => onChange({ ...settings, topP: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-400 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-violet-400/30"
          />
          <div className="flex justify-between text-[10px] text-white/25 mt-1">
            <span>Focused</span>
            <span>Diverse</span>
          </div>
        </div>

        {/* System Prompt */}
        <div>
          <label className="flex items-center gap-2 text-[11px] font-medium text-white/40 uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" />
            System Prompt
          </label>
          <textarea
            value={settings.systemPrompt ?? ""}
            onChange={(e) => onChange({ ...settings, systemPrompt: e.target.value })}
            placeholder="Override the AI persona. Leave empty to use personality mode defaults..."
            rows={4}
            className="w-full px-3 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none font-mono text-xs leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
