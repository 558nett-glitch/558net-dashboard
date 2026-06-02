import { useMemo, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { formatCurrency } from '../utils/stats';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { AlertTriangle, Clock, CheckCircle, DollarSign, MessageCircle, Search } from 'lucide-react';
import { cn } from '../utils/cn';
import { useTheme } from '../context/ThemeContext';
import { format, parseISO, isBefore, addDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { useCustomers } from '../context/CustomerContext';

export const TagihanPage = () => {
  const { customers, loading, updateCustomer } = useCustomers();
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'semua' | 'menunggak' | 'jatuh_tempo' | 'lunas'>('semua');

  const now = new Date();
  const sevenDaysLater = addDays(now, 7);

  const tagihan = useMemo(() => {
    const menunggak = customers.filter(c => c.statusPembayaran === 'Menunggak');
    const jatuhTempo = customers.filter(c => {
      if (c.statusPembayaran === 'Lunas') return false;
      try {
        const jt = parseISO(c.tanggalJatuhTempo);
        return isBefore(jt, sevenDaysLater);
      } catch { return false; }
    });
    const lunas = customers.filter(c => c.statusPembayaran === 'Lunas');
    const belumLunas = customers.filter(c => c.statusPembayaran !== 'Lunas');
    const totalTagihan = belumLunas.reduce((sum, c) => sum + c.hargaBulanan, 0);
    const totalPendapatan = lunas.reduce((sum, c) => sum + c.hargaBulanan, 0);
    return { menunggak, jatuhTempo, lunas, belumLunas, totalTagihan, totalPendapatan };
  }, [customers, sevenDaysLater]);

  const displayCustomers = useMemo(() => {
    let list = customers;
    if (activeTab === 'menunggak') list = tagihan.menunggak;
    else if (activeTab === 'jatuh_tempo') list = tagihan.jatuhTempo;
    else if (activeTab === 'lunas') list = tagihan.lunas;
    const q = search.toLowerCase();
    return list.filter(c =>
      !q || c.namaCustomer.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.noWhatsapp.includes(q)
    );
  }, [customers, activeTab, tagihan, search]);

  const handleMarkLunas = async (customerId: string) => {
    await updateCustomer(customerId, { statusPembayaran: 'Lunas' });
  };

  const formatDate = (dateStr: string) => {
    try { return format(parseISO(dateStr), 'dd MMM yyyy', { locale: id }); }
    catch { return dateStr; }
  };

  const isOverdue = (dateStr: string) => {
    try { return isBefore(parseISO(dateStr), now); } catch { return false; }
  };

  const tabs = [
    { key: 'semua', label: 'Semua', count: customers.length },
    { key: 'menunggak', label: 'Menunggak', count: tagihan.menunggak.length },
    { key: 'jatuh_tempo', label: 'Jatuh Tempo', count: tagihan.jatuhTempo.length },
    { key: 'lunas', label: 'Lunas', count: tagihan.lunas.length },
  ];

  return (
    <Layout title="Manajemen Tagihan" subtitle="Pantau status pembayaran pelanggan">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Tagihan Bulan Ini', value: formatCurrency(tagihan.totalTagihan), icon: <DollarSign size={20} />, color: 'text-red-400', bg: isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200' },
          { label: 'Total Pendapatan Lunas', value: formatCurrency(tagihan.totalPendapatan), icon: <CheckCircle size={20} />, color: 'text-green-400', bg: isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200' },
          { label: 'Pelanggan Menunggak', value: tagihan.menunggak.length, icon: <AlertTriangle size={20} />, color: 'text-yellow-400', bg: isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200' },
          { label: 'Jatuh Tempo 7 Hari', value: tagihan.jatuhTempo.length, icon: <Clock size={20} />, color: 'text-orange-400', bg: isDark ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-200' },
        ].map((s, i) => (
          <div key={i} className={cn('p-4 rounded-2xl border', s.bg)}>
            <div className="flex items-center justify-between mb-2">
              <span className={s.color}>{s.icon}</span>
            </div>
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
          placeholder="Cari nama, ID, atau WhatsApp..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={cn(
            'w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none',
            isDark
              ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500'
              : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
          )}
        />
      </div>

      {/* Tabs */}
      <div className={cn(
        'flex gap-1 p-1 rounded-xl mb-4 overflow-x-auto',
        isDark ? 'bg-white/5' : 'bg-slate-100'
      )}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={cn(
              'flex-1 min-w-fit px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap',
              activeTab === tab.key
                ? 'bg-blue-500 text-white shadow'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            )}
          >
            {tab.label}
            <span className={cn(
              'px-1.5 py-0.5 rounded-full text-xs',
              activeTab === tab.key ? 'bg-white/20' : isDark ? 'bg-white/10' : 'bg-white'
            )}>
              {tab.count}
            </span>
          </button>
        ))}
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
                {['ID', 'Nama Pelanggan', 'Paket', 'Harga', 'Status', 'Jatuh Tempo', 'Aksi'].map(h => (
                  <th key={h} className={cn('px-4 py-3 text-left text-xs font-semibold', isDark ? 'text-slate-400' : 'text-slate-500')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(7).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className={cn('h-4 rounded', isDark ? 'skeleton' : 'skeleton-light')} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : displayCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <CheckCircle size={32} className="text-slate-400 opacity-50 mx-auto mb-2" />
                    <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>Tidak ada data tagihan</p>
                  </td>
                </tr>
              ) : (
                displayCustomers.map(c => (
                  <tr key={c.id} className={cn(
                    'border-b transition-colors',
                    isDark ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'
                  )}>
                    <td className="px-4 py-3">
                      <span className={cn('font-mono text-xs', isDark ? 'text-blue-400' : 'text-blue-600')}>{c.id}</span>
                    </td>
                    <td className={cn('px-4 py-3 text-sm font-medium', isDark ? 'text-slate-200' : 'text-slate-800')}>
                      <div>
                        <p>{c.namaCustomer}</p>
                        <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>{c.noWhatsapp}</p>
                      </div>
                    </td>
                    <td className={cn('px-4 py-3 text-sm', isDark ? 'text-slate-300' : 'text-slate-700')}>
                      {c.paketInternet}
                    </td>
                    <td className={cn('px-4 py-3 text-sm font-medium', isDark ? 'text-slate-300' : 'text-slate-700')}>
                      {formatCurrency(c.hargaBulanan)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.statusPembayaran} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'text-xs font-medium',
                        isOverdue(c.tanggalJatuhTempo) && c.statusPembayaran !== 'Lunas'
                          ? 'text-red-400'
                          : isDark ? 'text-slate-300' : 'text-slate-700'
                      )}>
                        {formatDate(c.tanggalJatuhTempo)}
                        {isOverdue(c.tanggalJatuhTempo) && c.statusPembayaran !== 'Lunas' && (
                          <span className="ml-1">⚠️</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {c.statusPembayaran !== 'Lunas' && (
                          <Button
                            size="sm"
                            variant="success"
                            icon={<CheckCircle size={12} />}
                            onClick={() => handleMarkLunas(c.id)}
                          >
                            Lunas
                          </Button>
                        )}
                        <a
                          href={`https://wa.me/${c.noWhatsapp.replace(/^0/, '62')}?text=${encodeURIComponent(`Halo ${c.namaCustomer},\n\nTagihan internet 558NET Anda akan segera jatuh tempo pada ${c.tanggalJatuhTempo}.\n\nMohon melakukan pembayaran tepat waktu.\n\nTerima kasih.\n558NET`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="secondary" icon={<MessageCircle size={12} />}>
                            WA
                          </Button>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};
