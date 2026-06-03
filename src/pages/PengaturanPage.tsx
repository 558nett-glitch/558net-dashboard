import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useCustomers } from '../context/CustomerContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../utils/cn';
import {
  Save, RefreshCw, Globe, Database, Shield,
  Sun, Moon, AlertCircle, CheckCircle, ExternalLink
} from 'lucide-react';

export const PengaturanPage = () => {
  const { refreshData, loading, isUsingDemo, lastSync } = useCustomers();
  const { isDark, toggleTheme } = useTheme();

  const [scriptUrl, setScriptUrl] = useState(
    localStorage.getItem('558net_script_url') || ''
  );
  const [sheetId, setSheetId] = useState(
    localStorage.getItem('558net_sheet_id') || ''
  );
  const [namaIsp, setNamaIsp] = useState(
    localStorage.getItem('558net_nama_isp') || '558NET'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('558net_script_url', scriptUrl);
    localStorage.setItem('558net_sheet_id', sheetId);
    localStorage.setItem('558net_nama_isp', namaIsp);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const section = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <div className={cn(
      'p-5 rounded-2xl border',
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
    )}>
      <div className="flex items-center gap-2 mb-4">
        <span>{icon}</span>
        <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900')}>{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <Layout title="Pengaturan" subtitle="Konfigurasi sistem 558NET CMS">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Status Demo */}
        {isUsingDemo && (
          <div className={cn(
            'p-4 rounded-2xl border flex items-start gap-3',
            isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'
          )}>
            <AlertCircle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className={cn('text-sm font-semibold', isDark ? 'text-yellow-300' : 'text-yellow-700')}>
                Mode Demo Aktif
              </p>
              <p className={cn('text-xs mt-1', isDark ? 'text-yellow-400' : 'text-yellow-600')}>
                Aplikasi menggunakan data contoh. Konfigurasi Google Apps Script untuk menggunakan data nyata dari Google Spreadsheet.
              </p>
            </div>
          </div>
        )}

        {/* ISP Info */}
        {section('Informasi ISP', <Globe size={18} className="text-blue-400" />, (
          <div className="space-y-3">
            <Input
              label="Nama ISP"
              value={namaIsp}
              onChange={e => setNamaIsp(e.target.value)}
              placeholder="558NET"
            />
          </div>
        ))}

        {/* Google Sheets */}
        {section('Google Spreadsheet Integration', <Database size={18} className="text-green-400" />, (
          <div className="space-y-4">
            <div className={cn(
              'p-3 rounded-xl text-xs space-y-1',
              isDark ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300' : 'bg-blue-50 border border-blue-200 text-blue-700'
            )}>
              <p className="font-semibold">:</p>
              <ol className="space-y-1 list-decimal list-inside text-xs">
               /* <li>Buat Google Spreadsheet baru</li>
                <li>Buat sheet dengan nama <code className="bg-black/20 px-1 rounded">Pelanggan</code></li>
                <li>Buka <strong>Extensions → Apps Script</strong></li>
                <li>Paste kode Google Apps Script (lihat README.md)</li>
                <li>Deploy sebagai Web App</li>
                <li>Copy URL dan paste di bawah</li>*/
              </ol>
            </div>

            <Input
              label="Google Apps Script URL"
              value={scriptUrl}
              onChange={e => setScriptUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
            />
            <Input
              label="Google Sheet ID"
              value={sheetId}
              onChange={e => setSheetId(e.target.value)}
              placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
            />

            <div className="flex gap-2 flex-wrap">
              <Button
                icon={<Save size={16} />}
                onClick={handleSave}
              >
                {saved ? 'Tersimpan!' : 'Simpan Konfigurasi'}
              </Button>
              <Button
                variant="secondary"
                icon={<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />}
                onClick={refreshData}
                loading={loading}
              >
                Refresh & Sync
              </Button>
              <a
                href="https://docs.google.com/spreadsheets/create"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" icon={<ExternalLink size={16} />}>
                  Buat Spreadsheet
                </Button>
              </a>
            </div>

            {saved && (
              <div className="flex items-center gap-2 text-green-400 text-xs">
                <CheckCircle size={14} />
                Konfigurasi berhasil disimpan. Refresh halaman untuk menerapkan.
              </div>
            )}

            {lastSync && (
              <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
                Sinkronisasi terakhir: {lastSync.toLocaleString('id-ID')}
              </p>
            )}
          </div>
        ))}

        {/* Tampilan */}
        {section('Tampilan & Tema', <Sun size={18} className="text-yellow-400" />, (
          <div className="flex items-center justify-between">
            <div>
              <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-slate-900')}>
                {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </p>
              <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
                Klik untuk mengubah tema tampilan
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={cn(
                'relative w-12 h-6 rounded-full transition-all duration-300',
                isDark ? 'bg-blue-500' : 'bg-slate-300'
              )}
            >
              <div className={cn(
                'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300',
                isDark ? 'translate-x-6' : 'translate-x-0.5'
              )}>
                <div className="w-full h-full flex items-center justify-center">
                  {isDark ? <Moon size={10} className="text-blue-500" /> : <Sun size={10} className="text-yellow-500" />}
                </div>
              </div>
            </button>
          </div>
        ))}

        {/* Keamanan */}
        {section('Keamanan', <Shield size={18} className="text-purple-400" />, (
          <div className="space-y-3">
            <div className={cn(
              'grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl',
              isDark ? 'bg-white/5' : 'bg-slate-50'
            )}>
              <div>
                <p className={cn('text-xs font-medium', isDark ? 'text-slate-400' : 'text-slate-500')}>Username</p>
                <p className={cn('text-sm font-mono font-medium mt-0.5', isDark ? 'text-white' : 'text-slate-900')}>admin</p>
              </div>
              <div>
                <p className={cn('text-xs font-medium', isDark ? 'text-slate-400' : 'text-slate-500')}>Password</p>
                <p className={cn('text-sm font-mono font-medium mt-0.5', isDark ? 'text-white' : 'text-slate-900')}>••••••</p>
              </div>
            </div>
            <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
              Kredensial default: username <code className="bg-black/10 px-1 rounded">admin</code> / password <code className="bg-black/10 px-1 rounded">558net</code>
            </p>
          </div>
        ))}

        {/* Tentang */}
        {section('Tentang Aplikasi', <Globe size={18} className="text-cyan-400" />, (
          <div className="space-y-2">
            {[
              ['Nama Sistem', '558NET Customer Management System'],
              ['Versi', '1.0.0'],
              ['Teknologi', 'React.js + Vite + Tailwind CSS'],
              ['Database', 'Google Spreadsheet'],
              ['API', 'Google Apps Script'],
              ['Deployment', 'Netlify Ready'],
            ].map(([label, value], i) => (
              <div key={i} className={cn(
                'flex justify-between py-2 border-b last:border-0',
                isDark ? 'border-white/5' : 'border-slate-100'
              )}>
                <span className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>{label}</span>
                <span className={cn('text-xs font-medium', isDark ? 'text-slate-200' : 'text-slate-800')}>{value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Layout>
  );
};
