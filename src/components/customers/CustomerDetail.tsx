import { Customer } from '../../types';
import { StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/stats';
import {
  User, MapPin, Calendar, Wifi, CreditCard,
  MessageCircle, Edit, Trash2, Copy, CheckCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState } from 'react';

interface CustomerDetailProps {
  customer: Customer;
  onEdit: () => void;
  onDelete: () => void;
}

const InfoRow = ({ label, value, isDark }: { label: string; value: string | number; isDark: boolean }) => (
  <div className={cn(
    'flex justify-between items-start py-2 border-b last:border-0',
    isDark ? 'border-white/5' : 'border-slate-100'
  )}>
    <span className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>{label}</span>
    <span className={cn('text-xs font-medium text-right max-w-[60%]', isDark ? 'text-slate-200' : 'text-slate-800')}>
      {value || '-'}
    </span>
  </div>
);

export const CustomerDetail = ({ customer, onEdit, onDelete }: CustomerDetailProps) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  const waMessage = encodeURIComponent(
    `Halo ${customer.namaCustomer},\n\nTagihan internet 558NET Anda akan segera jatuh tempo pada ${customer.tanggalJatuhTempo}.\n\nMohon melakukan pembayaran tepat waktu.\n\nTerima kasih.\n558NET`
  );
  const waUrl = `https://wa.me/${customer.noWhatsapp.replace(/^0/, '62')}?text=${waMessage}`;

  const copyId = () => {
    navigator.clipboard.writeText(customer.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'dd MMMM yyyy', { locale: id });
    } catch {
      return dateStr;
    }
  };

  const section = (title: string, icon: React.ReactNode, color: string) => (
    <div className="flex items-center gap-2 mb-3">
      <div className={cn('p-1.5 rounded-lg', color)}>
        {icon}
      </div>
      <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900')}>{title}</h3>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={cn(
        'flex items-center gap-4 p-4 rounded-xl',
        isDark ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10' : 'bg-blue-50 border border-blue-100'
      )}>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {customer.namaCustomer.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className={cn('text-base font-bold', isDark ? 'text-white' : 'text-slate-900')}>
            {customer.namaCustomer}
          </h2>
          <button onClick={copyId} className="flex items-center gap-1 mt-0.5">
            <span className={cn('text-xs font-mono', isDark ? 'text-slate-400' : 'text-slate-500')}>
              {customer.id}
            </span>
            {copied ? <CheckCircle size={12} className="text-green-400" /> : <Copy size={12} className="text-slate-500" />}
          </button>
          <div className="flex gap-2 mt-2">
            <StatusBadge status={customer.statusPelanggan} />
            <StatusBadge status={customer.statusPembayaran} />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Identitas */}
        <div className={cn('p-4 rounded-xl', isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200')}>
          {section('Identitas', <User size={14} className="text-blue-400" />, 'bg-blue-500/20')}
          <InfoRow label="NIK" value={customer.nik} isDark={isDark} />
          <InfoRow label="Alamat" value={customer.alamat} isDark={isDark} />
          <InfoRow label="WhatsApp" value={customer.noWhatsapp} isDark={isDark} />
          <InfoRow label="Tanggal Registrasi" value={formatDate(customer.tanggalRegistrasi)} isDark={isDark} />
        </div>

        {/* Internet */}
        <div className={cn('p-4 rounded-xl', isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200')}>
          {section('Informasi Internet', <Wifi size={14} className="text-purple-400" />, 'bg-purple-500/20')}
          <InfoRow label="Paket" value={customer.paketInternet} isDark={isDark} />
          <InfoRow label="Kecepatan" value={customer.kecepatan} isDark={isDark} />
          <InfoRow label="Harga Bulanan" value={formatCurrency(customer.hargaBulanan)} isDark={isDark} />
          <InfoRow label="Status Pelanggan" value={customer.statusPelanggan} isDark={isDark} />
        </div>

        {/* ONT */}
        <div className={cn('p-4 rounded-xl', isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200')}>
          {section('Informasi ONT', <MapPin size={14} className="text-cyan-400" />, 'bg-cyan-500/20')}
          <InfoRow label="SN ONT" value={customer.snOnt} isDark={isDark} />
          <InfoRow label="ODP" value={customer.odp} isDark={isDark} />
          <InfoRow label="Router" value={customer.router} isDark={isDark} />
          <InfoRow label="IP Address" value={customer.ipAddress} isDark={isDark} />
        </div>

        {/* Pembayaran */}
        <div className={cn('p-4 rounded-xl', isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200')}>
          {section('Pembayaran', <CreditCard size={14} className="text-green-400" />, 'bg-green-500/20')}
          <InfoRow label="Status Pembayaran" value={customer.statusPembayaran} isDark={isDark} />
          <InfoRow label="Jatuh Tempo" value={formatDate(customer.tanggalJatuhTempo)} isDark={isDark} />
          {customer.catatan && (
            <div className="mt-3">
              {section('Catatan Admin', <Calendar size={14} className="text-yellow-400" />, 'bg-yellow-500/20')}
              <p className={cn('text-xs', isDark ? 'text-slate-300' : 'text-slate-600')}>{customer.catatan}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2">
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="success" icon={<MessageCircle size={16} />} className="w-full">
            Chat WhatsApp
          </Button>
        </a>
        <Button variant="secondary" icon={<Edit size={16} />} onClick={onEdit}>
          Edit
        </Button>
        <Button variant="danger" icon={<Trash2 size={16} />} onClick={onDelete}>
          Hapus
        </Button>
      </div>
    </div>
  );
};
