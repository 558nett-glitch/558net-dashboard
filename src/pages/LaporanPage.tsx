import { Layout } from '../components/layout/Layout';
import { useCustomers } from '../context/CustomerContext';
import { formatCurrency, calculateStats, getGrowthData, getPaymentStatusData, getPackageData } from '../utils/stats';
import { GrowthChart, PaymentPieChart, PackageBarChart } from '../components/dashboard/Charts';
import { Button } from '../components/ui/Button';
import { exportToExcel, exportToCSV, exportToPDF, printData } from '../utils/exportData';
import { FileSpreadsheet, FileText, Printer, Download } from 'lucide-react';
import { cn } from '../utils/cn';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const LaporanPage = () => {
  const { customers } = useCustomers();
  const { isDark } = useTheme();
  const stats = calculateStats(customers);
  const growthData = getGrowthData(customers);
  const paymentData = getPaymentStatusData(customers);
  const packageData = getPackageData(customers);

  const summaryItems = [
    { label: 'Total Pelanggan', value: stats.totalPelanggan },
    { label: 'Pelanggan Aktif', value: stats.pelangganAktif },
    { label: 'Pelanggan Suspend', value: stats.pelangganSuspend },
    { label: 'Pelanggan Nonaktif', value: stats.pelangganNonaktif },
    { label: 'Pelanggan Baru Bulan Ini', value: stats.pelangganBaruBulanIni },
    { label: 'Tagihan Belum Lunas', value: stats.tagihanBelumLunas },
    { label: 'Pendapatan Bulanan', value: formatCurrency(stats.pendapatanBulanan) },
    { label: 'ONT Terpasang', value: stats.jumlahOntTerpasang },
  ];

  const exportActions = [
    { label: 'Export Excel', icon: <FileSpreadsheet size={16} />, action: () => exportToExcel(customers), color: 'text-green-400' },
    { label: 'Export CSV', icon: <FileText size={16} />, action: () => exportToCSV(customers), color: 'text-blue-400' },
    { label: 'Export PDF', icon: <Download size={16} />, action: () => exportToPDF(customers), color: 'text-red-400' },
    { label: 'Print Data', icon: <Printer size={16} />, action: () => printData(customers), color: 'text-purple-400' },
  ];

  return (
    <Layout title="Laporan" subtitle="Laporan komprehensif data pelanggan 558NET">
      {/* Header */}
      <div className={cn(
        'p-5 rounded-2xl border mb-6',
        isDark ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-white/10' : 'bg-blue-50 border-blue-200'
      )}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-slate-900')}>
              📊 Laporan Bulanan 558NET
            </h2>
            <p className={cn('text-sm mt-1', isDark ? 'text-slate-400' : 'text-slate-500')}>
              Periode: {format(new Date(), 'MMMM yyyy', { locale: id })}
            </p>
            <p className={cn('text-xs mt-0.5', isDark ? 'text-slate-500' : 'text-slate-400')}>
              Dibuat: {format(new Date(), 'dd MMMM yyyy, HH:mm', { locale: id })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {exportActions.map((action, i) => (
              <Button
                key={i}
                variant="secondary"
                icon={action.icon}
                onClick={action.action}
                size="sm"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className={cn(
        'p-5 rounded-2xl border mb-6',
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
      )}>
        <h3 className={cn('text-sm font-semibold mb-4', isDark ? 'text-white' : 'text-slate-900')}>
          📋 Ringkasan Statistik
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {summaryItems.map((item, i) => (
            <div key={i} className={cn(
              'p-3 rounded-xl text-center',
              isDark ? 'bg-white/5' : 'bg-slate-50'
            )}>
              <p className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                {item.value}
              </p>
              <p className={cn('text-xs mt-1', isDark ? 'text-slate-400' : 'text-slate-500')}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <GrowthChart data={growthData} />
        <PaymentPieChart data={paymentData} />
        <PackageBarChart data={packageData} />

        {/* ODP Distribution */}
        <div className={cn(
          'p-5 rounded-2xl border',
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
        )}>
          <h3 className={cn('text-sm font-semibold mb-4', isDark ? 'text-white' : 'text-slate-900')}>
            📡 Distribusi Per ODP
          </h3>
          <div className="space-y-2">
            {Object.entries(
              customers.reduce((acc, c) => {
                if (c.odp) acc[c.odp] = (acc[c.odp] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([odp, count], i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={cn('text-xs w-28 font-mono', isDark ? 'text-slate-400' : 'text-slate-500')}>
                    {odp}
                  </span>
                  <div className="flex-1 bg-slate-700/30 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${(count / Math.max(...Object.values(customers.reduce((acc, c) => { if (c.odp) acc[c.odp] = (acc[c.odp] || 0) + 1; return acc; }, {} as Record<string, number>)))) * 100}%` }}
                    />
                  </div>
                  <span className={cn('text-xs font-bold w-6 text-right', isDark ? 'text-slate-300' : 'text-slate-700')}>
                    {count}
                  </span>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className={cn(
        'p-5 rounded-2xl border',
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
      )}>
        <h3 className={cn('text-sm font-semibold mb-4', isDark ? 'text-white' : 'text-slate-900')}>
          💎 Pelanggan Premium (Harga Tertinggi)
        </h3>
        <div className="space-y-2">
          {[...customers]
            .sort((a, b) => b.hargaBulanan - a.hargaBulanan)
            .slice(0, 5)
            .map((c, i) => (
              <div key={c.id} className={cn(
                'flex items-center gap-3 p-3 rounded-xl',
                isDark ? 'bg-white/5' : 'bg-slate-50'
              )}>
                <span className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                  i === 0 ? 'bg-yellow-500 text-yellow-900' :
                  i === 1 ? 'bg-slate-400 text-slate-900' :
                  i === 2 ? 'bg-orange-600 text-orange-100' :
                  'bg-slate-700 text-slate-300'
                )}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium truncate', isDark ? 'text-white' : 'text-slate-900')}>
                    {c.namaCustomer}
                  </p>
                  <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
                    {c.paketInternet} · {c.kecepatan}
                  </p>
                </div>
                <span className="text-sm font-bold text-green-400">
                  {formatCurrency(c.hargaBulanan)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};
