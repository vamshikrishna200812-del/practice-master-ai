import React from "react";
import { ChatWidgetSettings, PERSONALITY_OPTIONS, LANGUAGE_OPTIONS } from "./types";
import { X } from "lucide-react";

interface SettingsPanelProps {
  settings: ChatWidgetSettings;
  onChange: (settings: ChatWidgetSettings) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange, onClose }) => {
  return (
    <div className="absolute inset-0 bg-white z-10 flex flex-col animate-fade-in rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 text-sm">Settings</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Personality Mode */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Personality Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PERSONALITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ ...settings, personality: opt.value })}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  settings.personality === opt.value
                    ? "bg-blue-50 text-blue-700 ring-2 ring-blue-500 ring-offset-1"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
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
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => onChange({ ...settings, language: e.target.value as any })}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
