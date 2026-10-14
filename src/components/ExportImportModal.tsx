import React, { useState } from 'react';
import { X, Download, Upload, Copy, Check, FileText } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

interface ExportImportModalProps {
  onClose: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({ onClose }) => {
  const { exportDataJSON, importDataJSON } = useHabits();
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(
    null
  );

  const jsonStr = exportDataJSON();

  const handleDownload = () => {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitpulse-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyImport = () => {
    if (!importText.trim()) return;
    const res = importDataJSON(importText);
    if (res.success) {
      setImportStatus({ success: true, message: 'Data imported successfully!' });
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setImportStatus({ success: false, message: res.error || 'Failed to parse JSON backup.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Data Backup & Restore
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Export your habits and history as JSON or restore from a backup
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          {/* Export section */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Export Your Data
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download .json File</span>
              </button>
              <button
                onClick={handleCopy}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700/60" />

          {/* Import section */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Import from JSON Text
            </label>
            <textarea
              rows={4}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste raw exported JSON here..."
              className="w-full font-mono text-[11px] p-2.5 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />

            {importStatus && (
              <div
                className={`mt-2 p-2 rounded-lg ${
                  importStatus.success
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                }`}
              >
                {importStatus.message}
              </div>
            )}

            <button
              onClick={handleApplyImport}
              disabled={!importText.trim()}
              className="mt-2 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Restore from Text</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
