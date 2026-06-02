import { Customer, Stats } from '../types';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export const calculateStats = (customers: Customer[]): Stats => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const pelangganAktif = customers.filter(c => c.statusPelanggan === 'Aktif').length;
  const pelangganSuspend = customers.filter(c => c.statusPelanggan === 'Suspend').length;
  const pelangganNonaktif = customers.filter(c => c.statusPelanggan === 'Nonaktif').length;

  const pelangganBaruBulanIni = customers.filter(c => {
    try {
      const regDate = parseISO(c.tanggalRegistrasi);
      return isWithinInterval(regDate, { start: monthStart, end: monthEnd });
    } catch {
      return false;
    }
  }).length;

  const tagihanBelumLunas = customers.filter(c =>
    c.statusPembayaran === 'Belum Lunas' || c.statusPembayaran === 'Menunggak'
  ).length;

  const pendapatanBulanan = customers
    .filter(c => c.statusPembayaran === 'Lunas' && c.statusPelanggan === 'Aktif')
    .reduce((sum, c) => sum + c.hargaBulanan, 0);

  const jumlahOntTerpasang = customers.filter(c => c.snOnt && c.snOnt.trim() !== '').length;

  return {
    totalPelanggan: customers.length,
    pelangganAktif,
    pelangganSuspend,
    pelangganNonaktif,
    pelangganBaruBulanIni,
    tagihanBelumLunas,
    pendapatanBulanan,
    jumlahOntTerpasang,
  };
};

export const getGrowthData = (customers: Customer[]) => {
  const monthlyData: Record<string, number> = {};
  
  customers.forEach(c => {
    try {
      const date = parseISO(c.tanggalRegistrasi);
      const key = format(date, 'MMM yyyy');
      monthlyData[key] = (monthlyData[key] || 0) + 1;
    } catch {
      // skip invalid dates
    }
  });

  return Object.entries(monthlyData)
    .slice(-6)
    .map(([month, count]) => ({ month, count }));
};

export const getPaymentStatusData = (customers: Customer[]) => {
  const lunas = customers.filter(c => c.statusPembayaran === 'Lunas').length;
  const belumLunas = customers.filter(c => c.statusPembayaran === 'Belum Lunas').length;
  const menunggak = customers.filter(c => c.statusPembayaran === 'Menunggak').length;

  return [
    { name: 'Lunas', value: lunas, color: '#22c55e' },
    { name: 'Belum Lunas', value: belumLunas, color: '#f59e0b' },
    { name: 'Menunggak', value: menunggak, color: '#ef4444' },
  ];
};

export const getPackageData = (customers: Customer[]) => {
  const paketCount: Record<string, number> = {};
  customers.forEach(c => {
    if (c.paketInternet) {
      paketCount[c.paketInternet] = (paketCount[c.paketInternet] || 0) + 1;
    }
  });

  return Object.entries(paketCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));
};

export const getStatusData = (customers: Customer[]) => {
  return [
    { name: 'Aktif', value: customers.filter(c => c.statusPelanggan === 'Aktif').length, color: '#22c55e' },
    { name: 'Suspend', value: customers.filter(c => c.statusPelanggan === 'Suspend').length, color: '#f59e0b' },
    { name: 'Nonaktif', value: customers.filter(c => c.statusPelanggan === 'Nonaktif').length, color: '#ef4444' },
  ];
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};
