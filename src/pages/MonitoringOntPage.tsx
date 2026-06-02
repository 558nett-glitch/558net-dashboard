import { useState, useMemo } from 'react';
import { Layout } from '../components/layout/Layout';
import { useCustomers } from '../context/CustomerContext';
import { StatusBadge } from '../components/ui/Badge';
import { AlertTriangle, Wifi, Search, CheckCircle, Copy } from 'lucide-react';
import { cn } from '../utils/cn';
import { useTheme } from '../context/ThemeContext';

export const MonitoringOntPage = () => {
  const { customers, loading } = useCustomers();
  const { isDark } = useTheme();
  const [searchSn, setSearchSn] = useState('');

  const ontData = useMemo(() => {
    const withOnt = customers.filter(c => c.snOnt && c.snOnt.trim() !== '');

    // Detect duplicates
    const snCount: Record<string, number> = {};
    withOnt.forEach(c => { snCount[c.snOnt] = (snCount[c.snOnt] || 0) + 1; });
    const duplicates = Object.entries(snCount).filter(([, count]) => count > 1).map(([sn]) => sn);

    return { withOnt, duplicates };
  }, [customers]);

  const filtered = useMemo(() => {
    const q = searchSn.toLowerCase();
    return ontData.withOnt.filter(c =>
      !q || c.snOnt.toLowerCase().includes(q) || c.namaCustomer.toLowerCase().includes(q)
    );
  }, [ontData, searchSn]);

  const stats = [
    { label: 'Total ONT Terpasang', value: ontData.withOnt.length, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: '📡' },
    { label: 'ONT Pelanggan Aktif', value: ontData.withOnt.filter(c => c.statusPelanggan === 'Aktif').length, color: 'text-green-400', bg: 'bg-green-500/10', icon: '✅' },
    { label: 'Duplikat SN ONT', value: ontData.duplicates.length, color: 'text-red-400', bg: 'bg-red-500/10', icon: '⚠️' },
    { label: 'Pelanggan Tanpa ONT', value: customers.length - ontData.withOnt.length, color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: '❓' },
  ];

  return (
    <Layout title="Monitoring ONT" subtitle="Kelola dan pantau perangkat ONT pelanggan">
      {/* Warning duplicates */}
      {ontData.duplicates.length > 0 && (
        <div className={cn(
          'mb-4 p-4 rounded-2xl border flex items-start gap-3',
          isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
        )}>
          <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-400">⚠️ Terdeteksi SN ONT Duplikat!</p>
            <p className={cn('text-xs mt-1', isDark ? 'text-red-300' : 'text-red-600')}>
              SN ONT berikut digunakan lebih dari satu pelanggan:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {ontData.duplicates.map(sn => (
                <span key={sn} className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-lg font-mono">
                  {sn}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className={cn(
            'p-4 rounded-2xl border text-center',
            isDark ? `${s.bg} border-white/10` : 'bg-white border-slate-200'
          )}>
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
            <p className={cn('text-xs mt-1', isDark ? 'text-slate-400' : 'text-slate-500')}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari SN ONT atau nama pelanggan..."
          value={searchSn}
          onChange={e => setSearchSn(e.target.value)}
          className={cn(
            'w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all',
            isDark
              ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500'
              : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
          )}
        />
      </div>

      {/* Table */}
      <div className={cn(
        'rounded-2xl border overflow-hidden',
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
      )}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('border-b', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                {['SN ONT', 'Nama Pelanggan', 'ODP', 'Router', 'IP Address', 'Status', 'Duplikat'].map(h => (
                  <th key={h} className={cn('px-4 py-3 text-left text-xs font-semibold', isDark ? 'text-slate-400' : 'text-slate-500')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className={cn('border-b', isDark ? 'border-white/5' : 'border-slate-100')}>
                    {Array(7).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className={cn('h-4 rounded', isDark ? 'skeleton' : 'skeleton-light')} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Wifi size={32} className="text-slate-400 opacity-50 mx-auto mb-2" />
                    <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>Tidak ada data ONT</p>
                  </td>
                </tr>
              ) : (
                filtered.map(c => {
                  const isDuplicate = ontData.duplicates.includes(c.snOnt);
                  return (
                    <tr key={c.id} className={cn(
                      'border-b transition-colors',
                      isDark ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50',
                      isDuplicate && isDark ? 'bg-red-500/5' : isDuplicate ? 'bg-red-50'  : ''
                    )}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={cn('font-mono text-xs', isDark ? 'text-blue-400' : 'text-blue-600')}>
                            {c.snOnt}
                          </span>
                          <button
                            onClick={() => navigator.clipboard.writeText(c.snOnt)}
                            className="text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </td>
                      <td className={cn('px-4 py-3 text-sm', isDark ? 'text-slate-300' : 'text-slate-700')}>
                        <div>
                          <p className="font-medium">{c.namaCustomer}</p>
                          <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>{c.id}</p>
                        </div>
                      </td>
                      <td className={cn('px-4 py-3 text-sm', isDark ? 'text-slate-300' : 'text-slate-700')}>{c.odp || '-'}</td>
                      <td className={cn('px-4 py-3 text-sm', isDark ? 'text-slate-300' : 'text-slate-700')}>{c.router || '-'}</td>
                      <td className={cn('px-4 py-3 text-xs font-mono', isDark ? 'text-slate-300' : 'text-slate-700')}>{c.ipAddress || '-'}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={c.statusPelanggan} />
                      </td>
                      <td className="px-4 py-3">
                        {isDuplicate ? (
                          <span className="flex items-center gap-1 text-xs text-red-400">
                            <AlertTriangle size={12} /> Duplikat
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-green-400">
                            <CheckCircle size={12} /> Unik
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};
