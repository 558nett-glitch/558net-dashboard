import { Layout } from '../components/layout/Layout';
import { StatCard, SkeletonStatCard } from '../components/dashboard/StatCard';
import { GrowthChart, PaymentPieChart, PackageBarChart, StatusBarChart } from '../components/dashboard/Charts';
import { useCustomers } from '../context/CustomerContext';
import { calculateStats, getGrowthData, getPaymentStatusData, getPackageData, getStatusData, formatCurrency } from '../utils/stats';
import {
  Users, UserCheck, UserX, Pause, UserPlus,
  CreditCard, DollarSign, Wifi, AlertTriangle
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useTheme } from '../context/ThemeContext';

export const DashboardPage = () => {
  const { customers, loading, isUsingDemo } = useCustomers();
  const { isDark } = useTheme();
  const stats = calculateStats(customers);
  const growthData = getGrowthData(customers);
  const paymentData = getPaymentStatusData(customers);
  const packageData = getPackageData(customers);
  const statusData = getStatusData(customers);

  const statCards = [
    {
      title: 'Total Pelanggan',
      value: stats.totalPelanggan,
      icon: <Users size={22} />,
      color: 'blue' as const,
      subtitle: 'Semua pelanggan terdaftar',
    },
    {
      title: 'Pelanggan Aktif',
      value: stats.pelangganAktif,
      icon: <UserCheck size={22} />,
      color: 'green' as const,
      subtitle: `${stats.totalPelanggan ? Math.round(stats.pelangganAktif / stats.totalPelanggan * 100) : 0}% dari total`,
    },
    {
      title: 'Pelanggan Suspend',
      value: stats.pelangganSuspend,
      icon: <Pause size={22} />,
      color: 'yellow' as const,
    },
    {
      title: 'Pelanggan Nonaktif',
      value: stats.pelangganNonaktif,
      icon: <UserX size={22} />,
      color: 'red' as const,
    },
    {
      title: 'Pelanggan Baru Bulan Ini',
      value: stats.pelangganBaruBulanIni,
      icon: <UserPlus size={22} />,
      color: 'cyan' as const,
    },
    {
      title: 'Tagihan Belum Lunas',
      value: stats.tagihanBelumLunas,
      icon: <CreditCard size={22} />,
      color: 'red' as const,
      subtitle: 'Perlu perhatian',
    },
    {
      title: 'Pendapatan Bulanan',
      value: formatCurrency(stats.pendapatanBulanan),
      icon: <DollarSign size={22} />,
      color: 'green' as const,
      subtitle: 'Dari pelanggan lunas aktif',
    },
    {
      title: 'ONT Terpasang',
      value: stats.jumlahOntTerpasang,
      icon: <Wifi size={22} />,
      color: 'purple' as const,
    },
  ];

  return (
    <Layout title="Dashboard" subtitle="Ringkasan data pelanggan 558NET">
      {/* Demo Mode Warning */}
      {isUsingDemo && (
        <div className={cn(
          'mb-4 p-3 rounded-xl flex items-center gap-3 text-sm border',
          isDark
            ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
            : 'bg-yellow-50 border-yellow-200 text-yellow-700'
        )}>
          <AlertTriangle size={16} />
          <span>
            <strong>Mode Demo:</strong> Menggunakan data contoh. Konfigurasi Google Apps Script URL di halaman Pengaturan untuk sinkronisasi data nyata.
          </span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading
          ? Array(8).fill(0).map((_, i) => <SkeletonStatCard key={i} />)
          : statCards.map((card, i) => (
            <StatCard key={i} {...card} />
          ))
        }
      </div>

      {/* Charts */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GrowthChart data={growthData} />
          <PaymentPieChart data={paymentData} />
          <PackageBarChart data={packageData} />
          <StatusBarChart data={statusData} />
        </div>
      )}

      {/* Recent Customers */}
      {!loading && customers.length > 0 && (
        <div className={cn(
          'mt-4 rounded-2xl border p-5',
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
        )}>
          <h3 className={cn('text-sm font-semibold mb-4', isDark ? 'text-white' : 'text-slate-900')}>
            🆕 Pelanggan Terbaru
          </h3>
          <div className="space-y-2">
            {customers.slice(0, 5).map(c => (
              <div key={c.id} className={cn(
                'flex items-center justify-between p-3 rounded-xl',
                isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100',
                'transition-colors'
              )}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {c.namaCustomer.charAt(0)}
                  </div>
                  <div>
                    <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-slate-900')}>
                      {c.namaCustomer}
                    </p>
                    <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
                      {c.paketInternet} · {c.kecepatan}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn('text-xs font-medium', isDark ? 'text-slate-300' : 'text-slate-700')}>
                    {c.id}
                  </p>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    c.statusPelanggan === 'Aktif'
                      ? 'bg-green-500/20 text-green-400'
                      : c.statusPelanggan === 'Suspend'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  )}>
                    {c.statusPelanggan}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};
