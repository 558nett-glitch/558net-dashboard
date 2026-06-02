import { useState, useMemo } from 'react';
import { Layout } from '../components/layout/Layout';
import { useCustomers } from '../context/CustomerContext';
import { Customer, FilterOptions } from '../types';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { CustomerForm } from '../components/customers/CustomerForm';
import { CustomerDetail } from '../components/customers/CustomerDetail';
import { formatCurrency } from '../utils/stats';
import {
  Plus, Search, Filter, Download, Trash2, Edit, Eye,
  ChevronLeft, ChevronRight, FileText, FileSpreadsheet, Printer
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useTheme } from '../context/ThemeContext';
import { exportToCSV, exportToExcel, exportToPDF, printData } from '../utils/exportData';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const CustomersPage = () => {
  const { customers, loading, deleteCustomer } = useCustomers();
  const { isDark } = useTheme();

  const [filters, setFilters] = useState<FilterOptions>({
    search: '', statusPelanggan: '', statusPembayaran: '',
    paket: '', odp: '', tanggalDari: '', tanggalSampai: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<keyof Customer>('tanggalRegistrasi');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const filteredCustomers = useMemo(() => {
    return customers
      .filter(c => {
        const q = filters.search.toLowerCase();
        const matchSearch = !q || [c.namaCustomer, c.id, c.noWhatsapp, c.alamat, c.snOnt, c.ipAddress]
          .some(v => v.toLowerCase().includes(q));
        const matchStatus = !filters.statusPelanggan || c.statusPelanggan === filters.statusPelanggan;
        const matchPembayaran = !filters.statusPembayaran || c.statusPembayaran === filters.statusPembayaran;
        const matchPaket = !filters.paket || c.paketInternet === filters.paket;
        const matchOdp = !filters.odp || c.odp === filters.odp;
        return matchSearch && matchStatus && matchPembayaran && matchPaket && matchOdp;
      })
      .sort((a, b) => {
        const aVal = String(a[sortKey] || '');
        const bVal = String(b[sortKey] || '');
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
  }, [customers, filters, sortKey, sortDir]);

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: keyof Customer) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    await deleteCustomer(deleteId);
    setDeleteLoading(false);
    setDeleteId(null);
  };

  const uniquePakets = [...new Set(customers.map(c => c.paketInternet).filter(Boolean))];
  const uniqueOdps = [...new Set(customers.map(c => c.odp).filter(Boolean))];

  const formatDate = (dateStr: string) => {
    try { return format(parseISO(dateStr), 'dd MMM yyyy', { locale: id }); }
    catch { return dateStr; }
  };

  const SortIcon = ({ col: colKey }: { col: keyof Customer }) => (
    <span className="ml-1 text-xs opacity-50">
      {sortKey === colKey ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  const thClass = (_col: keyof Customer) => cn(
    'px-3 py-3 text-left text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap select-none',
    isDark ? 'text-slate-400' : 'text-slate-500'
  );

  const tdClass = cn(
    'px-3 py-3 text-sm whitespace-nowrap',
    isDark ? 'text-slate-300' : 'text-slate-700'
  );

  return (
    <Layout title="Data Pelanggan" subtitle={`${filteredCustomers.length} dari ${customers.length} pelanggan`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, ID, WhatsApp, SN ONT..."
            value={filters.search}
            onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setCurrentPage(1); }}
            className={cn(
              'w-full pl-9 pr-4 py-2 rounded-xl text-sm border focus:outline-none transition-all',
              isDark
                ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500'
            )}
          />
        </div>

        <Button
          variant={showFilters ? 'primary' : 'secondary'}
          icon={<Filter size={16} />}
          onClick={() => setShowFilters(!showFilters)}
          size="md"
        >
          Filter
        </Button>

        {/* Export */}
        <div className="relative">
          <Button
            variant="secondary"
            icon={<Download size={16} />}
            onClick={() => setShowExport(!showExport)}
          >
            Export
          </Button>
          {showExport && (
            <div className={cn(
              'absolute right-0 top-full mt-1 w-44 rounded-xl border shadow-xl z-10 overflow-hidden',
              isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-200'
            )}>
              {[
                { label: 'Export Excel', icon: <FileSpreadsheet size={14} />, action: () => exportToExcel(filteredCustomers) },
                { label: 'Export CSV', icon: <FileText size={14} />, action: () => exportToCSV(filteredCustomers) },
                { label: 'Export PDF', icon: <FileText size={14} />, action: () => exportToPDF(filteredCustomers) },
                { label: 'Print', icon: <Printer size={14} />, action: () => printData(filteredCustomers) },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => { item.action(); setShowExport(false); }}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors text-left',
                    isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          icon={<Plus size={16} />}
          onClick={() => setShowAddModal(true)}
        >
          Tambah Pelanggan
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className={cn(
          'mb-4 p-4 rounded-2xl border grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 animate-slide-up',
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
        )}>
          {[
            {
              label: 'Status Pelanggan',
              field: 'statusPelanggan' as keyof FilterOptions,
              options: ['', 'Aktif', 'Suspend', 'Nonaktif'],
            },
            {
              label: 'Status Pembayaran',
              field: 'statusPembayaran' as keyof FilterOptions,
              options: ['', 'Lunas', 'Belum Lunas', 'Menunggak'],
            },
            {
              label: 'Paket Internet',
              field: 'paket' as keyof FilterOptions,
              options: ['', ...uniquePakets],
            },
            {
              label: 'ODP',
              field: 'odp' as keyof FilterOptions,
              options: ['', ...uniqueOdps],
            },
          ].map(({ label, field, options }) => (
            <div key={field}>
              <label className={cn('block text-xs font-medium mb-1', isDark ? 'text-slate-400' : 'text-slate-500')}>
                {label}
              </label>
              <select
                value={filters[field]}
                onChange={e => { setFilters(f => ({ ...f, [field]: e.target.value })); setCurrentPage(1); }}
                className={cn(
                  'w-full rounded-lg px-2 py-1.5 text-xs border focus:outline-none',
                  isDark ? 'bg-slate-800 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                )}
              >
                {options.map(o => <option key={o} value={o}>{o || 'Semua'}</option>)}
              </select>
            </div>
          ))}
          <div className="flex items-end">
            <button
              onClick={() => { setFilters({ search: '', statusPelanggan: '', statusPembayaran: '', paket: '', odp: '', tanggalDari: '', tanggalSampai: '' }); setCurrentPage(1); }}
              className={cn('text-xs underline', isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}
            >
              Reset Filter
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className={cn(
        'rounded-2xl border overflow-hidden',
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
      )}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('border-b', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                <th className={thClass('id')} onClick={() => handleSort('id')}>
                  ID Pelanggan <SortIcon col="id" />
                </th>
                <th className={thClass('namaCustomer')} onClick={() => handleSort('namaCustomer')}>
                  Nama <SortIcon col="namaCustomer" />
                </th>
                <th className={thClass('noWhatsapp')} onClick={() => handleSort('noWhatsapp')}>WhatsApp</th>
                <th className={thClass('paketInternet')} onClick={() => handleSort('paketInternet')}>
                  Paket <SortIcon col="paketInternet" />
                </th>
                <th className={thClass('hargaBulanan')} onClick={() => handleSort('hargaBulanan')}>
                  Harga <SortIcon col="hargaBulanan" />
                </th>
                <th className={thClass('statusPembayaran')} onClick={() => handleSort('statusPembayaran')}>
                  Pembayaran <SortIcon col="statusPembayaran" />
                </th>
                <th className={thClass('tanggalJatuhTempo')} onClick={() => handleSort('tanggalJatuhTempo')}>
                  Jatuh Tempo <SortIcon col="tanggalJatuhTempo" />
                </th>
                <th className={thClass('statusPelanggan')} onClick={() => handleSort('statusPelanggan')}>
                  Status <SortIcon col="statusPelanggan" />
                </th>
                <th className={cn('px-3 py-3 text-right text-xs font-semibold', isDark ? 'text-slate-400' : 'text-slate-500')}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className={cn('border-b', isDark ? 'border-white/5' : 'border-slate-100')}>
                    {Array(9).fill(0).map((_, j) => (
                      <td key={j} className="px-3 py-3">
                        <div className={cn('h-4 rounded w-full', isDark ? 'skeleton' : 'skeleton-light')} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="text-slate-400 opacity-50" />
                      <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
                        Tidak ada data ditemukan
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((c, i) => (
                  <tr
                    key={c.id}
                    className={cn(
                      'border-b table-row-hover cursor-pointer',
                      isDark
                        ? 'border-white/5 hover:bg-white/5'
                        : 'border-slate-100 hover:bg-slate-50',
                      i % 2 === 0 && !isDark && 'bg-slate-50/50'
                    )}
                    onClick={() => setDetailCustomer(c)}
                  >
                    <td className={tdClass}>
                      <span className="font-mono text-xs text-blue-400">{c.id}</span>
                    </td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.namaCustomer.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-xs">{c.namaCustomer}</p>
                          <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>{c.odp}</p>
                        </div>
                      </div>
                    </td>
                    <td className={tdClass}>{c.noWhatsapp}</td>
                    <td className={tdClass}>
                      <div>
                        <p className="text-xs font-medium">{c.paketInternet}</p>
                        <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>{c.kecepatan}</p>
                      </div>
                    </td>
                    <td className={tdClass}>
                      <span className="font-medium">{formatCurrency(c.hargaBulanan)}</span>
                    </td>
                    <td className={tdClass}>
                      <StatusBadge status={c.statusPembayaran} />
                    </td>
                    <td className={tdClass}>{formatDate(c.tanggalJatuhTempo)}</td>
                    <td className={tdClass}>
                      <StatusBadge status={c.statusPelanggan} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setDetailCustomer(c)}
                          className={cn(
                            'p-1.5 rounded-lg transition-colors',
                            isDark ? 'hover:bg-blue-500/20 text-slate-400 hover:text-blue-400' : 'hover:bg-blue-50 text-slate-400 hover:text-blue-600'
                          )}
                          title="Detail"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setEditCustomer(c)}
                          className={cn(
                            'p-1.5 rounded-lg transition-colors',
                            isDark ? 'hover:bg-yellow-500/20 text-slate-400 hover:text-yellow-400' : 'hover:bg-yellow-50 text-slate-400 hover:text-yellow-600'
                          )}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(c.id)}
                          className={cn(
                            'p-1.5 rounded-lg transition-colors',
                            isDark ? 'hover:bg-red-500/20 text-slate-400 hover:text-red-400' : 'hover:bg-red-50 text-slate-400 hover:text-red-600'
                          )}
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredCustomers.length > 0 && (
          <div className={cn(
            'flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t',
            isDark ? 'border-white/10' : 'border-slate-200'
          )}>
            <div className="flex items-center gap-2">
              <span className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
                Tampilkan
              </span>
              <select
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className={cn(
                  'text-xs border rounded-lg px-2 py-1 focus:outline-none',
                  isDark ? 'bg-slate-800 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                )}
              >
                {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
                dari {filteredCustomers.length} data
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cn(
                  'p-1.5 rounded-lg disabled:opacity-30 transition-colors',
                  isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                )}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1
                  : currentPage >= totalPages - 2 ? totalPages - 4 + i
                  : currentPage - 2 + i;
                if (page < 1 || page > totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      'w-8 h-8 text-xs rounded-lg font-medium transition-colors',
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                    )}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={cn(
                  'p-1.5 rounded-lg disabled:opacity-30 transition-colors',
                  isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                )}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Tambah Pelanggan Baru" size="xl">
        <CustomerForm onClose={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editCustomer} onClose={() => setEditCustomer(null)} title="Edit Data Pelanggan" size="xl">
        {editCustomer && (
          <CustomerForm
            customer={editCustomer}
            onClose={() => setEditCustomer(null)}
          />
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!detailCustomer} onClose={() => setDetailCustomer(null)} title="Detail Pelanggan" size="xl">
        {detailCustomer && (
          <CustomerDetail
            customer={detailCustomer}
            onEdit={() => { setEditCustomer(detailCustomer); setDetailCustomer(null); }}
            onDelete={() => { setDeleteId(detailCustomer.id); setDetailCustomer(null); }}
          />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Konfirmasi Hapus" size="sm">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
            <Trash2 size={28} className="text-red-400" />
          </div>
          <div>
            <p className={cn('text-sm font-medium', 'text-white')}>Yakin ingin menghapus pelanggan ini?</p>
            <p className="text-xs text-slate-400 mt-1">Data yang dihapus tidak dapat dikembalikan.</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="danger"
              loading={deleteLoading}
              onClick={handleDelete}
              className="flex-1"
            >
              Ya, Hapus
            </Button>
            <Button variant="secondary" onClick={() => setDeleteId(null)} className="flex-1">
              Batal
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};
