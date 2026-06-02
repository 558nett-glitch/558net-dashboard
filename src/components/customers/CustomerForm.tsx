import { useState } from 'react';
import { Customer } from '../../types';
import { Input, Select, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { Save, X } from 'lucide-react';
import { useCustomers } from '../../context/CustomerContext';
import { format } from 'date-fns';

interface CustomerFormProps {
  customer?: Customer;
  onClose: () => void;
  onSuccess?: () => void;
}

const paketOptions = [
  { value: '', label: '-- Pilih Paket --' },
  { value: 'Paket Turbo', label: 'Paket Turbo - 25 Mbps' },
  { value: 'Paket Kilat', label: 'Paket Kilat - 40 Mbps' },
  { value: 'Paket Gold', label: 'Paket Gold - 58 Mbps' },
];

const kecepatanMap: Record<string, string> = {
  'Paket Turbo': '25 Mbps',
  'Paket Kilat': '40 Mbps',
  'Paket Gold': '58 Mbps',
};

const hargaMap: Record<string, number> = {
  'Paket Turbo': 250000,
  'Paket Kilat': 400000,
  'Paket Gold': 580000,
};

const emptyForm: Omit<Customer, 'id'> = {
  namaCustomer: '',
  nik: '',
  alamat: '',
  noWhatsapp: '',
  tanggalRegistrasi: format(new Date(), 'yyyy-MM-dd'),
  snOnt: '',
  paketInternet: '',
  kecepatan: '',
  hargaBulanan: 0,
  statusPembayaran: 'Belum Lunas',
  tanggalJatuhTempo: format(new Date(), 'yyyy-MM-dd'),
  statusPelanggan: 'Aktif',
  odp: '',
  router: '',
  ipAddress: '',
  catatan: '',
};

export const CustomerForm = ({ customer, onClose, onSuccess }: CustomerFormProps) => {
  const { addCustomer, updateCustomer, customers } = useCustomers();
  const [form, setForm] = useState<Omit<Customer, 'id'>>(
    customer ? { ...customer } : { ...emptyForm }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Customer, string>> = {};

    if (!form.namaCustomer.trim()) newErrors.namaCustomer = 'Nama pelanggan wajib diisi';
    if (!form.nik.trim()) newErrors.nik = 'NIK wajib diisi';
    else if (!/^\d{16}$/.test(form.nik)) newErrors.nik = 'NIK harus 16 digit angka';
    if (!form.alamat.trim()) newErrors.alamat = 'Alamat wajib diisi';
    if (!form.noWhatsapp.trim()) newErrors.noWhatsapp = 'Nomor WhatsApp wajib diisi';
    else if (!/^08\d{8,12}$/.test(form.noWhatsapp)) newErrors.noWhatsapp = 'Format: 08XXXXXXXXXX';
    if (!form.paketInternet) newErrors.paketInternet = 'Paket internet wajib dipilih';
    if (!form.tanggalRegistrasi) newErrors.tanggalRegistrasi = 'Tanggal registrasi wajib diisi';
    if (!form.tanggalJatuhTempo) newErrors.tanggalJatuhTempo = 'Tanggal jatuh tempo wajib diisi';

    // Check SN ONT uniqueness
    if (form.snOnt) {
      const duplicate = customers.find(c =>
        c.snOnt === form.snOnt && c.id !== customer?.id
      );
      if (duplicate) newErrors.snOnt = `SN ONT sudah digunakan oleh ${duplicate.namaCustomer}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };

      if (field === 'paketInternet' && typeof value === 'string') {
        updated.kecepatan = kecepatanMap[value] || '';
        updated.hargaBulanan = hargaMap[value] || 0;
      }

      return updated;
    });
    if (errors[field as keyof Customer]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (customer) {
        await updateCustomer(customer.id, form);
      } else {
        await addCustomer(form);
      }
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Identitas */}
      <div>
        <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">1</span>
          Data Identitas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Nama Pelanggan *"
            value={form.namaCustomer}
            onChange={e => handleChange('namaCustomer', e.target.value)}
            error={errors.namaCustomer}
            placeholder="Masukkan nama lengkap"
          />
          <Input
            label="NIK (16 Digit) *"
            value={form.nik}
            onChange={e => handleChange('nik', e.target.value)}
            error={errors.nik}
            placeholder="3271XXXXXXXXXXXX"
            maxLength={16}
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Alamat *"
              value={form.alamat}
              onChange={e => handleChange('alamat', e.target.value)}
              error={errors.alamat}
              placeholder="Alamat lengkap"
            />
          </div>
          <Input
            label="No. WhatsApp *"
            value={form.noWhatsapp}
            onChange={e => handleChange('noWhatsapp', e.target.value)}
            error={errors.noWhatsapp}
            placeholder="08XXXXXXXXXX"
          />
          <Input
            label="Tanggal Registrasi *"
            type="date"
            value={form.tanggalRegistrasi}
            onChange={e => handleChange('tanggalRegistrasi', e.target.value)}
            error={errors.tanggalRegistrasi}
          />
        </div>
      </div>

      {/* Internet */}
      <div>
        <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">2</span>
          Informasi Internet
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Paket Internet *"
            value={form.paketInternet}
            onChange={e => handleChange('paketInternet', e.target.value)}
            error={errors.paketInternet}
            options={paketOptions}
          />
          <Input
            label="Kecepatan"
            value={form.kecepatan}
            onChange={e => handleChange('kecepatan', e.target.value)}
            placeholder="Auto dari paket"
          />
          <Input
            label="Harga Bulanan (Rp)"
            type="number"
            value={form.hargaBulanan || ''}
            onChange={e => handleChange('hargaBulanan', parseFloat(e.target.value) || 0)}
            placeholder="Auto dari paket"
          />
          <Select
            label="Status Pelanggan *"
            value={form.statusPelanggan}
            onChange={e => handleChange('statusPelanggan', e.target.value)}
            options={[
              { value: 'Aktif', label: 'Aktif' },
              { value: 'Suspend', label: 'Suspend' },
              { value: 'Nonaktif', label: 'Nonaktif' },
            ]}
          />
        </div>
      </div>

      {/* ONT */}
      <div>
        <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">3</span>
          Data ONT & Jaringan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="SN ONT"
            value={form.snOnt}
            onChange={e => handleChange('snOnt', e.target.value.toUpperCase())}
            error={errors.snOnt}
            placeholder="Cth: HWTC12345678"
          />
          <Input
            label="ODP"
            value={form.odp}
            onChange={e => handleChange('odp', e.target.value)}
            placeholder="Cth: ODP-558-001"
          />
          <Input
            label="Router/ONT Model"
            value={form.router}
            onChange={e => handleChange('router', e.target.value)}
            placeholder="Cth: Huawei EG8145V5"
          />
          <Input
            label="IP Address"
            value={form.ipAddress}
            onChange={e => handleChange('ipAddress', e.target.value)}
            placeholder="192.168.1.X"
          />
        </div>
      </div>

      {/* Pembayaran */}
      <div>
        <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-xs">4</span>
          Pembayaran
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Status Pembayaran"
            value={form.statusPembayaran}
            onChange={e => handleChange('statusPembayaran', e.target.value)}
            options={[
              { value: 'Lunas', label: 'Lunas' },
              { value: 'Belum Lunas', label: 'Belum Lunas' },
              { value: 'Menunggak', label: 'Menunggak' },
            ]}
          />
          <Input
            label="Tanggal Jatuh Tempo *"
            type="date"
            value={form.tanggalJatuhTempo}
            onChange={e => handleChange('tanggalJatuhTempo', e.target.value)}
            error={errors.tanggalJatuhTempo}
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Catatan Admin"
              value={form.catatan}
              onChange={e => handleChange('catatan', e.target.value)}
              placeholder="Catatan tambahan..."
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          loading={loading}
          icon={<Save size={16} />}
          className="flex-1"
        >
          {customer ? 'Simpan Perubahan' : 'Tambah Pelanggan'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          icon={<X size={16} />}
          onClick={onClose}
        >
          Batal
        </Button>
      </div>
    </form>
  );
};
