import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { CalendarIcon, FilterIcon, PrinterIcon, FileTextIcon, UsersIcon, ClockIcon } from 'lucide-react';
import { useState } from 'react';

interface Pelanggaran {
    id: number;
    siswa?: { nama: string; kelas?: { nama: string } };
    peraturan?: { jenis: string };
    user?: { name: string };
    status: string;
    waktu_terjadi: string;
    keterangan: string;
}

interface PageProps {
    pelanggaran: Pelanggaran[];
    filters: {
        tahun?: string;
        bulan?: string;
        status?: string;
    };
}

const StatusBadge = ({ status }: { status: string }) => {
    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'diproses':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
            case 'selesai':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'ditunda':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize transition-all duration-200 ${getStatusStyles(status)}`}>
            {status}
        </span>
    );
};

export default function LaporanPelanggaran({ pelanggaran: initialPelanggaran, filters }: PageProps) {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [filteredPelanggaran, setFilteredPelanggaran] = useState<Pelanggaran[]>([]);
    const [errors, setErrors] = useState<{ tahun?: string }>({});
    
    const { data, setData, get, processing } = useForm({
        tahun: filters.tahun || '',
        bulan: filters.bulan || '',
        status: filters.status || '',
    });

    const validateForm = () => {
        const newErrors: { tahun?: string } = {};
        
        if (!data.tahun.trim()) {
            newErrors.tahun = 'Tahun wajib diisi';
        } else if (isNaN(Number(data.tahun))) {
            newErrors.tahun = 'Tahun harus berupa angka';
        } else if (Number(data.tahun) < 2000 || Number(data.tahun) > new Date().getFullYear() + 1) {
            newErrors.tahun = `Tahun harus antara 2000-${new Date().getFullYear() + 1}`;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        get(route('laporan.pelanggaran'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setDataLoaded(true);
                setFilteredPelanggaran(initialPelanggaran);
                setErrors({});
            },
            onError: (err) => {
                console.error('Error fetching data:', err);
            }
        });
    };

    const handlePrint = () => {
        if (!data.tahun) {
            setErrors({ tahun: 'Tahun wajib diisi untuk mencetak' });
            return;
        }
        
        if (isNaN(Number(data.tahun))) {
            setErrors({ tahun: 'Tahun harus berupa angka' });
            return;
        }
        
        window.open(route('laporan.pelanggaran.cetak', data), '_blank');
    };

    const bulanOptions = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return (
        <AppLayout>
            <head>
                <title>Cetak Laporan Pelanggaran</title>
                <link rel="icon" href="img/logo.png" />
            </head>
            
            <div className="min-h-screen transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section */}
                    <div className="mb-8 animate-fade-in">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <FileTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Laporan Pelanggaran
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Cetak laporan pelanggaran siswa berdasarkan periode dan status
                        </p>
                    </div>

                    {/* Filter Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FilterIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Laporan</h2>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Tahun *
                                    </label>
                                    <input
                                        type="number"
                                        className={`w-full px-4 py-2.5 rounded-lg border ${
                                            errors.tahun 
                                                ? 'border-red-500 focus:ring-red-500' 
                                                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-all duration-200`}
                                        placeholder="Wajib diisi"
                                        value={data.tahun}
                                        onChange={(e) => {
                                            setData('tahun', e.target.value);
                                            if (errors.tahun) {
                                                setErrors({ ...errors, tahun: undefined });
                                            }
                                        }}
                                        min="2000"
                                        max={new Date().getFullYear() + 1}
                                    />
                                    {errors.tahun && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.tahun}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Bulan (Opsional)
                                    </label>
                                    <select 
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        value={data.bulan} 
                                        onChange={(e) => setData('bulan', e.target.value)}
                                    >
                                        <option value="">Semua Bulan</option>
                                        {bulanOptions.map((bulan, index) => (
                                            <option key={index} value={index + 1}>
                                                {bulan}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Status (Opsional)
                                    </label>
                                    <select 
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        value={data.status} 
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="diproses">Diproses</option>
                                        <option value="selesai">Selesai</option>
                                        <option value="ditunda">Ditunda</option>
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                    >
                                        {processing ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Loading...
                                            </div>
                                        ) : (
                                            'Tampilkan'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 animate-slide-up" style={{animationDelay: '0.5s'}}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Data Pelanggaran</h2>
                                <button
                                    type="button"
                                    disabled={!data.tahun || processing || !dataLoaded}
                                    onClick={handlePrint}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                                        data.tahun && !processing && dataLoaded
                                            ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500' 
                                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <PrinterIcon className="h-4 w-4" />
                                    Cetak PDF
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            {['No', 'Nama Siswa', 'Kelas', 'Peraturan', 'Petugas', 'Status', 'Waktu', 'Keterangan'].map((header, index) => (
                                                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {dataLoaded ? (
                                            filteredPelanggaran.length > 0 ? (
                                                filteredPelanggaran.map((item, index) => (
                                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 animate-fade-in-up" style={{animationDelay: `${0.1 * index}s`}}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                            {item.siswa?.nama || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                            {item.siswa?.kelas?.nama || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                            <span className=" text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                                                                {item.peraturan?.jenis || '-'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                            {item.user?.name || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <StatusBadge status={item.status} />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                            {new Date(item.waktu_terjadi).toLocaleString('id-ID', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs">
                                                            <div className="truncate" title={item.keterangan}>
                                                                {item.keterangan || '-'}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="px-6 py-12 text-center">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                                                                <FileTextIcon className="h-8 w-8 text-gray-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500 dark:text-gray-400 font-medium">Tidak ada data pelanggaran</p>
                                                                <p className="text-gray-400 dark:text-gray-500 text-sm">Silakan ubah kriteria filter untuk menampilkan data</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                                                            <FilterIcon className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500 dark:text-gray-400 font-medium">Silakan atur filter dan klik "Tampilkan"</p>
                                                            <p className="text-gray-400 dark:text-gray-500 text-sm">Data pelanggaran akan muncul setelah Anda menerapkan filter</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }

                .animate-slide-up {
                    animation: slide-up 0.6s ease-out;
                    animation-fill-mode: both;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.4s ease-out;
                    animation-fill-mode: both;
                }
            `}</style>
        </AppLayout>
    );
}