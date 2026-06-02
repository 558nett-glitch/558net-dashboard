/**
 * 558NET Customer Management System
 * Google Apps Script - Backend API
 * 
 * Deploy ini sebagai Web App dengan akses "Anyone"
 * 
 * Setup:
 * 1. Buka Google Spreadsheet Anda
 * 2. Extensions → Apps Script
 * 3. Paste kode ini
 * 4. Save dan Deploy sebagai Web App
 * 5. Copy URL dan paste di pengaturan aplikasi
 */

const SHEET_NAME = 'Pelanggan';
const HEADERS = [
  'ID Pelanggan', 'Nama Pelanggan', 'NIK', 'Alamat', 'Nomor WhatsApp',
  'Tanggal Registrasi', 'SN ONT', 'Paket Internet', 'Kecepatan',
  'Harga Bulanan', 'Status Pembayaran', 'Tanggal Jatuh Tempo',
  'Status Pelanggan', 'ODP', 'Router', 'IP Address', 'Catatan'
];

/**
 * Handle GET request - Ambil semua data pelanggan
 */
function doGet(e) {
  try {
    const action = e.parameter.action || 'GET';
    
    if (action === 'GET') {
      return getCustomers();
    }
    
    return createResponse({ status: 'error', message: 'Invalid action' });
  } catch (error) {
    return createResponse({ status: 'error', message: error.toString() });
  }
}

/**
 * Handle POST request - Tambah, Update, Delete pelanggan
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    
    switch (action) {
      case 'POST':
        return addCustomer(body.data);
      case 'PUT':
        return updateCustomer(body.id, body.data);
      case 'DELETE':
        return deleteCustomer(body.id);
      default:
        return createResponse({ status: 'error', message: 'Invalid action' });
    }
  } catch (error) {
    return createResponse({ status: 'error', message: error.toString() });
  }
}

/**
 * Ambil semua data pelanggan dari spreadsheet
 */
function getCustomers() {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  
  // Skip header row
  const rows = data.slice(1);
  
  return createResponse({
    status: 'success',
    data: rows,
    total: rows.length
  });
}

/**
 * Tambah pelanggan baru
 */
function addCustomer(rowData) {
  const sheet = getOrCreateSheet();
  sheet.appendRow(rowData);
  
  return createResponse({
    status: 'success',
    message: 'Pelanggan berhasil ditambahkan'
  });
}

/**
 * Update data pelanggan berdasarkan ID
 */
function updateCustomer(id, rowData) {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      const range = sheet.getRange(i + 1, 1, 1, rowData.length);
      range.setValues([rowData]);
      return createResponse({
        status: 'success',
        message: 'Data pelanggan berhasil diupdate'
      });
    }
  }
  
  return createResponse({
    status: 'error',
    message: `Pelanggan dengan ID ${id} tidak ditemukan`
  });
}

/**
 * Hapus pelanggan berdasarkan ID
 */
function deleteCustomer(id) {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return createResponse({
        status: 'success',
        message: 'Pelanggan berhasil dihapus'
      });
    }
  }
  
  return createResponse({
    status: 'error',
    message: `Pelanggan dengan ID ${id} tidak ditemukan`
  });
}

/**
 * Dapatkan atau buat sheet Pelanggan
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Tambah header
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    
    // Style header
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground('#2563EB');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    // Auto resize columns
    sheet.autoResizeColumns(1, HEADERS.length);
  }
  
  return sheet;
}

/**
 * Buat response JSON dengan CORS headers
 */
function createResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Setup initial data (opsional - untuk testing)
 */
function setupInitialData() {
  const sheet = getOrCreateSheet();
  
  // Data contoh
  const sampleData = [
    ['558NET-0001', 'Budi Santoso', '3271234567890001', 'Jl. Merdeka No. 1 RT 01/RW 01', '081234567890', '2025-01-01', 'HWTC12345678', 'Paket Premium', '30 Mbps', 200000, 'Lunas', '2025-02-01', 'Aktif', 'ODP-558-001', 'Huawei EG8145V5', '192.168.1.1', ''],
  ];
  
  sampleData.forEach(row => sheet.appendRow(row));
  
  Logger.log('Data awal berhasil ditambahkan');
}
