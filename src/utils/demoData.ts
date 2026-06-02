import { Customer } from '../types';
import { format, subDays, addDays } from 'date-fns';

export const generateDemoData = (): Customer[] => {
  const today = new Date();
  const pakets = ['Paket Hemat', 'Paket Standar', 'Paket Premium', 'Paket Bisnis', 'Paket Unlimited'];
  const kecepatan = ['10 Mbps', '20 Mbps', '30 Mbps', '50 Mbps', '100 Mbps'];
  const harga = [100000, 150000, 200000, 300000, 500000];
  const odps = ['ODP-558-001', 'ODP-558-002', 'ODP-558-003', 'ODP-558-004', 'ODP-558-005'];
  const routers = ['Huawei EG8145V5', 'ZTE F670L', 'Nokia G-240W-F', 'Fiberhome AN5506-04', 'Huawei HG8245Q2'];
  const statusPelanggan: Customer['statusPelanggan'][] = ['Aktif', 'Aktif', 'Aktif', 'Suspend', 'Nonaktif'];
  const statusPembayaran: Customer['statusPembayaran'][] = ['Lunas', 'Lunas', 'Belum Lunas', 'Menunggak'];

  const names = [
    'Budi Santoso', 'Siti Rahayu', 'Ahmad Fauzi', 'Dewi Lestari', 'Eko Prasetyo',
    'Fitri Handayani', 'Gunawan Wijaya', 'Hendra Kusuma', 'Indah Permata', 'Joko Widodo',
    'Kartini Wahyuni', 'Luki Hermawan', 'Maya Sari', 'Nurul Hidayah', 'Oki Setiawan',
    'Putri Anggraeni', 'Rudi Hartono', 'Sari Dewi', 'Teguh Santoso', 'Umi Kulsum',
    'Vino Bastian', 'Wahyu Prakoso', 'Xena Puspita', 'Yudi Prasetya', 'Zara Amelia',
    'Anton Susanto', 'Bagas Wicaksono', 'Citra Melati', 'Dani Firmansyah', 'Erna Sulistyowati',
  ];

  return names.map((name, i) => {
    const paketIdx = i % pakets.length;
    const statusIdx = i % statusPelanggan.length;
    const pembayaranIdx = i % statusPembayaran.length;
    const regDate = subDays(today, Math.floor(Math.random() * 365));
    const jatuhTempo = addDays(today, Math.floor(Math.random() * 30) - 10);

    return {
      id: `558NET-${String(i + 1).padStart(4, '0')}`,
      namaCustomer: name,
      nik: `3271${String(Math.floor(Math.random() * 10000000000000)).padStart(12, '0')}`.substring(0, 16),
      alamat: `Jl. ${['Merdeka', 'Pahlawan', 'Sudirman', 'Gatot Subroto', 'Ahmad Yani', 'Diponegoro'][i % 6]} No. ${i + 1}, RT ${String(Math.floor(Math.random() * 10) + 1).padStart(2, '0')}/RW ${String(Math.floor(Math.random() * 10) + 1).padStart(2, '0')}`,
      noWhatsapp: `08${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
      tanggalRegistrasi: format(regDate, 'yyyy-MM-dd'),
      snOnt: `HWTC${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      paketInternet: pakets[paketIdx],
      kecepatan: kecepatan[paketIdx],
      hargaBulanan: harga[paketIdx],
      statusPembayaran: statusPembayaran[pembayaranIdx],
      tanggalJatuhTempo: format(jatuhTempo, 'yyyy-MM-dd'),
      statusPelanggan: statusPelanggan[statusIdx],
      odp: odps[i % odps.length],
      router: routers[i % routers.length],
      ipAddress: `192.168.${Math.floor(i / 254) + 1}.${(i % 254) + 1}`,
      catatan: i % 3 === 0 ? 'Pelanggan VIP, prioritas penanganan' : i % 5 === 0 ? 'Perlu pengecekan kabel' : '',
    };
  });
};
