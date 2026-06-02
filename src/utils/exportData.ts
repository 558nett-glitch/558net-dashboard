import { Customer } from '../types';
import { formatCurrency } from './stats';
import * as XLSX from 'xlsx';

export const exportToCSV = (customers: Customer[], filename = '558NET_Pelanggan') => {
  const headers = [
    'ID Pelanggan', 'Nama Pelanggan', 'NIK', 'Alamat', 'No WhatsApp',
    'Tanggal Registrasi', 'SN ONT', 'Paket Internet', 'Kecepatan',
    'Harga Bulanan', 'Status Pembayaran', 'Tanggal Jatuh Tempo',
    'Status Pelanggan', 'ODP', 'Router', 'IP Address', 'Catatan'
  ];

  const rows = customers.map(c => [
    c.id, c.namaCustomer, c.nik, c.alamat, c.noWhatsapp,
    c.tanggalRegistrasi, c.snOnt, c.paketInternet, c.kecepatan,
    c.hargaBulanan.toString(), c.statusPembayaran, c.tanggalJatuhTempo,
    c.statusPelanggan, c.odp, c.router, c.ipAddress, c.catatan
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToExcel = (customers: Customer[], filename = '558NET_Pelanggan') => {
  const data = customers.map(c => ({
    'ID Pelanggan': c.id,
    'Nama Pelanggan': c.namaCustomer,
    'NIK': c.nik,
    'Alamat': c.alamat,
    'No WhatsApp': c.noWhatsapp,
    'Tanggal Registrasi': c.tanggalRegistrasi,
    'SN ONT': c.snOnt,
    'Paket Internet': c.paketInternet,
    'Kecepatan': c.kecepatan,
    'Harga Bulanan': c.hargaBulanan,
    'Status Pembayaran': c.statusPembayaran,
    'Tanggal Jatuh Tempo': c.tanggalJatuhTempo,
    'Status Pelanggan': c.statusPelanggan,
    'ODP': c.odp,
    'Router': c.router,
    'IP Address': c.ipAddress,
    'Catatan': c.catatan,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Pelanggan');

  // Style header
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let C = range.s.c; C <= range.e.c; C++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!ws[addr]) continue;
    ws[addr].s = { font: { bold: true } };
  }

  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportToPDF = async (customers: Customer[], filename = '558NET_Pelanggan') => {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  doc.setFontSize(16);
  doc.text('558NET Customer Management System', 14, 15);
  doc.setFontSize(10);
  doc.text(`Data Pelanggan - ${new Date().toLocaleDateString('id-ID')}`, 14, 22);

  autoTable(doc, {
    startY: 28,
    head: [[
      'ID', 'Nama', 'WhatsApp', 'Paket', 'Kecepatan',
      'Harga', 'Status Bayar', 'Jatuh Tempo', 'Status'
    ]],
    body: customers.map(c => [
      c.id,
      c.namaCustomer,
      c.noWhatsapp,
      c.paketInternet,
      c.kecepatan,
      formatCurrency(c.hargaBulanan),
      c.statusPembayaran,
      c.tanggalJatuhTempo,
      c.statusPelanggan,
    ]),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(`${filename}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const printData = (customers: Customer[]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>558NET - Data Pelanggan</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        h1 { color: #2563eb; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #2563eb; color: white; padding: 6px; text-align: left; }
        td { padding: 5px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background: #f5f5f5; }
        .badge { padding: 2px 6px; border-radius: 4px; font-size: 10px; }
        .aktif { background: #dcfce7; color: #166534; }
        .lunas { background: #dcfce7; color: #166534; }
        .belum { background: #fef9c3; color: #854d0e; }
        .menunggak { background: #fee2e2; color: #991b1b; }
      </style>
    </head>
    <body>
      <h1>558NET Customer Management System</h1>
      <p>Data Pelanggan - ${new Date().toLocaleDateString('id-ID')}</p>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Nama</th><th>WhatsApp</th><th>Paket</th>
            <th>Harga</th><th>Status Bayar</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${customers.map(c => `
            <tr>
              <td>${c.id}</td>
              <td>${c.namaCustomer}</td>
              <td>${c.noWhatsapp}</td>
              <td>${c.paketInternet}</td>
              <td>${formatCurrency(c.hargaBulanan)}</td>
              <td>${c.statusPembayaran}</td>
              <td>${c.statusPelanggan}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};
