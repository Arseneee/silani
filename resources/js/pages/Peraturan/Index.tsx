import SearchFilterBar from '@/components/SearchFilterBar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import PeraturanModal from './PeraturanModal';

interface Peraturan {
    id: number;
    jenis: string;
    kategori: 'Ringan' | 'Sedang' | 'Berat';
    poin: number;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Main Data', href: '/peraturan' }];

const KategoriBadge = ({ kategori }: { kategori: string }) => {
    const colorMap = {
        Ringan: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        Sedang: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        Berat: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[kategori as keyof typeof colorMap]}`}>
            {kategori}
        </span>
    );
};

export default function PeraturanPage() {
    const page = usePage();
    const peraturanFromServer = (page.props.peraturan || []) as Peraturan[];

    const { auth } = usePage().props as any;
    const isGuruBK = auth.user?.role === 'Guru BK';

    const [peraturanData, setPeraturanData] = useState<Peraturan[]>(peraturanFromServer);
    const [filteredData, setFilteredData] = useState<Peraturan[]>(peraturanFromServer);
    const [searchTerm, setSearchTerm] = useState('');
    const [kategoriFilter, setKategoriFilter] = useState('');
    const [sortField, setSortField] = useState<keyof Peraturan | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedPeraturan, setSelectedPeraturan] = useState<Peraturan | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        setPeraturanData(peraturanFromServer);
    }, [peraturanFromServer]);

    useEffect(() => {
        let result = [...peraturanData];

        if (searchTerm) {
            result = result.filter((item) => item.jenis.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (kategoriFilter) {
            result = result.filter((item) => item.kategori === kategoriFilter);
        }

        if (sortField) {
            result.sort((a, b) => {
                const valueA = a[sortField];
                const valueB = b[sortField];
                return valueA < valueB ? (sortDirection === 'asc' ? -1 : 1) : valueA > valueB ? (sortDirection === 'asc' ? 1 : -1) : 0;
            });
        }

        setFilteredData(result);
    }, [searchTerm, kategoriFilter, sortField, sortDirection, peraturanData]);

    const handleSort = (field: keyof Peraturan) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setKategoriFilter('');
    };

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedPeraturan(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: Peraturan) => {
        setModalMode('edit');
        setSelectedPeraturan(item);
        setIsModalOpen(true);
    };

    const confirmDelete = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!deleteId) return;

        router.delete(route('peraturan.destroy', deleteId), {
            onSuccess: () => {
                toast.success('Peraturan berhasil dihapus');
                setIsDeleteModalOpen(false);
                setDeleteId(null);
                router.reload({ only: ['peraturan'] });
            },
            onError: () => {
                toast.error('Gagal menghapus peraturan');
            },
        });
    };

    const handleSubmit = (data: Omit<Peraturan, 'id'>) => {
        if (modalMode === 'create') {
            router.post(route('peraturan.store'), data, {
                onSuccess: () => {
                    toast.success('Peraturan berhasil ditambahkan');
                    setIsModalOpen(false);
                    router.reload({ only: ['peraturan'] });
                },
                onError: (errors) => {
                    toast.error('Gagal menambahkan peraturan');
                    console.error(errors);
                },
            });
        } else if (modalMode === 'edit' && selectedPeraturan) {
            router.put(route('peraturan.update', selectedPeraturan.id), data, {
                onSuccess: () => {
                    toast.success('Peraturan berhasil diperbarui');
                    setIsModalOpen(false);
                    router.reload({ only: ['peraturan'] });
                },
                onError: (errors) => {
                    toast.error('Gagal memperbarui peraturan');
                    console.error(errors);
                },
            });
        }
    };

    let n = 1;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Peraturan" />
            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Daftar Peraturan</h1>
                    {!isGuruBK && (
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                        >
                            <Plus size={16} /> Tambah Siswa
                        </button>
                    )}
                </div>

                <SearchFilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    kategoriFilter={kategoriFilter}
                    setKategoriFilter={setKategoriFilter}
                    onReset={resetFilters}
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    searchPlaceholder="Cari berdasarkan jenis peraturan..."
                    filterOptions={['Ringan', 'Sedang', 'Berat']}
                    filterLabel="Filter berdasarkan kategori:"
                />

                {/* Tabel */}
                <div className="relative overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {['no', 'jenis', 'kategori', 'poin', ...(!isGuruBK ? ['aksi'] : [])].map((key) => (
                                    <th
                                        key={key}
                                        className={`cursor-pointer px-6 py-3 ${key === 'aksi' ? 'cursor-default' : ''}`}
                                        onClick={() => key !== 'aksi' && handleSort(key as keyof Peraturan)}
                                    >
                                        <div className="flex items-center">
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                            {sortField === key && <ArrowUpDown className="ml-1 h-3.5 w-3.5" />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                            className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                                        >
                                            <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">{n++}</td>
                                            <td className="px-6 py-4">{item.jenis}</td>
                                            <td className="px-6 py-4">
                                                <KategoriBadge kategori={item.kategori} />
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                <span
                                                    className={
                                                        item.poin >= 75
                                                            ? 'text-red-600 dark:text-red-400'
                                                            : item.poin >= 25
                                                              ? 'text-yellow-600 dark:text-yellow-400'
                                                              : 'text-green-600 dark:text-green-400'
                                                    }
                                                >
                                                    {item.poin}
                                                </span>
                                            </td>
                                            {!isGuruBK && (
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => openEditModal(item)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => confirmDelete(item.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr className="bg-white dark:bg-gray-800">
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <svg
                                                    className="mb-3 h-12 w-12 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <p className="text-gray-500 dark:text-gray-400">Tidak ada data yang ditemukan</p>
                                                <button
                                                    onClick={resetFilters}
                                                    className="mt-3 text-sm text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    Reset pencarian
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {/* Footer */}
                    <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                        Menampilkan {filteredData.length} dari {peraturanData.length} data
                    </div>
                </div>

                {/* Modal */}
                <PeraturanModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    initialData={modalMode === 'edit' && selectedPeraturan ? selectedPeraturan : undefined}
                    title={modalMode === 'create' ? 'Tambah Peraturan' : 'Edit Peraturan'}
                />
                <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} />
            </div>
        </AppLayout>
    );
}
