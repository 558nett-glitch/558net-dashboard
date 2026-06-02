export interface Customer {
  id: string;
  namaCustomer: string;
  nik: string;
  alamat: string;
  noWhatsapp: string;
  tanggalRegistrasi: string;
  snOnt: string;
  paketInternet: string;
  kecepatan: string;
  hargaBulanan: number;
  statusPembayaran: 'Lunas' | 'Belum Lunas' | 'Menunggak';
  tanggalJatuhTempo: string;
  statusPelanggan: 'Aktif' | 'Suspend' | 'Nonaktif';
  odp: string;
  router: string;
  ipAddress: string;
  catatan: string;
}

export interface Stats {
  totalPelanggan: number;
  pelangganAktif: number;
  pelangganSuspend: number;
  pelangganNonaktif: number;
  pelangganBaruBulanIni: number;
  tagihanBelumLunas: number;
  pendapatanBulanan: number;
  jumlahOntTerpasang: number;
}

export interface FilterOptions {
  search: string;
  statusPelanggan: string;
  statusPembayaran: string;
  paket: string;
  odp: string;
  tanggalDari: string;
  tanggalSampai: string;
}

export interface Settings {
  namaIsp: string;
  logoUrl: string;
  tema: 'dark' | 'light';
  googleSheetId: string;
  googleAppsScriptUrl: string;
}

export interface AuthUser {
  username: string;
  loginTime: string;
  rememberMe: boolean;
}
