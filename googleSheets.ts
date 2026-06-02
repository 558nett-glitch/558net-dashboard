import { Customer } from '../types';

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';
console.log(import.meta.env);
console.log("SCRIPT_URL =", SCRIPT_URL);

const mapRowToCustomer = (row: string[]): Customer => ({
  id: row[0] || '',
  namaCustomer: row[1] || '',
  nik: row[2] || '',
  alamat: row[3] || '',
  noWhatsapp: row[4] || '',
  tanggalRegistrasi: row[5] || '',
  snOnt: row[6] || '',
  paketInternet: row[7] || '',
  kecepatan: row[8] || '',
  hargaBulanan: parseFloat(row[9]) || 0,
  statusPembayaran: (row[10] as Customer['statusPembayaran']) || 'Belum Lunas',
  tanggalJatuhTempo: row[11] || '',
  statusPelanggan: (row[12] as Customer['statusPelanggan']) || 'Aktif',
  odp: row[13] || '',
  router: row[14] || '',
  ipAddress: row[15] || '',
  catatan: row[16] || '',
});

const mapCustomerToRow = (c: Customer): string[] => [
  c.id,
  c.namaCustomer,
  c.nik,
  c.alamat,
  c.noWhatsapp,
  c.tanggalRegistrasi,
  c.snOnt,
  c.paketInternet,
  c.kecepatan,
  c.hargaBulanan.toString(),
  c.statusPembayaran,
  c.tanggalJatuhTempo,
  c.statusPelanggan,
  c.odp,
  c.router,
  c.ipAddress,
  c.catatan,
];

class GoogleSheetsService {
  private async request(params: Record<string, string>) {
    if (!SCRIPT_URL) throw new Error('Google Apps Script URL not configured');
    
    const url = new URL(SCRIPT_URL);
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow',
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  private async postRequest(body: Record<string, unknown>) {
    if (!SCRIPT_URL) throw new Error('Google Apps Script URL not configured');
    
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: 'follow',
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  async getCustomers(): Promise<Customer[]> {
    const result = await this.request({ action: 'GET' });
    if (result.status !== 'success') throw new Error(result.message);
    return (result.data || []).map(mapRowToCustomer);
  }

 /* async addCustomer(customer: Customer): Promise<void> {
    const result = await this.postRequest({
      action: 'POST',
      data: mapCustomerToRow(customer),
    });
    if (result.status !== 'success') throw new Error(result.message);
  }
*/
async addCustomer(customer: Customer): Promise<void> {
  const params = new URLSearchParams({
    action: 'ADD',
    data: JSON.stringify(mapCustomerToRow(customer))
  });

  const response = await fetch(
    `${SCRIPT_URL}?${params}`
  );

  const result = await response.json();

  if (result.status !== 'success') {
    throw new Error(result.message);
  }
}
  async updateCustomer(id: string, customer: Customer): Promise<void> {
    const result = await this.postRequest({
      action: 'PUT',
      id,
      data: mapCustomerToRow(customer),
    });
    if (result.status !== 'success') throw new Error(result.message);
  }

  async deleteCustomer(id: string): Promise<void> {
    const result = await this.postRequest({
      action: 'DELETE',
      id,
    });
    if (result.status !== 'success') throw new Error(result.message);
  }
}

export const googleSheetsService = new GoogleSheetsService();
