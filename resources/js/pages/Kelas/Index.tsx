import SearchFilterBar from '@/components/SearchFilterBar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import KelasModal from './KelasModal';

interface Kelas {
    id: number;
    nama: string;
    user_id: number;
    jumlah_siswa: number;
    waliKelas?: {
        name: string;
    } | null;
}

interface PageProps {
    kelas: Kelas[];
    waliKelasOptions: { id: number; name: string }[];
    [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Main Data', href: '/kelas' }];

export default function KelasPage() {
    const { props } = usePage<PageProps>();
    const kelasFromServer = props.kelas || [];
    const waliKelasOptions = props.waliKelasOptions || [];

    const [searchTerm, setSearchTerm] = useState('');
    const [kategoriFilter, setKategoriFilter] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Filter dan search
    const filteredData = kelasFromServer.filter((item) => {
        const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesKategori = kategoriFilter ? item.nama.startsWith(kategoriFilter) : true;
        return matchesSearch && matchesKategori;
    });

    const resetFilters = () => {
        setSearchTerm('');
        setKategoriFilter('');
    };

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedKelas(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: Kelas) => {
        setModalMode('edit');
        setSelectedKelas(item);
        setIsModalOpen(true);
    };

    const confirmDelete = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!deleteId) return;

        router.delete(route('kelas.destroy', deleteId), {
            onSuccess: () => {
                toast.success('Data kelas berhasil dihapus');
                setIsDeleteModalOpen(false);
                setDeleteId(null);
                router.reload({ only: ['kelas'] });
            },
            onError: () => toast.error('Gagal menghapus kelas'),
        });
    };

    const handleSubmit = (data: Omit<Kelas, 'id'>) => {
        if (modalMode === 'create') {
            router.post(route('kelas.store'), data, {
                onSuccess: () => {
                    toast.success('Kelas berhasil ditambahkan');
                    setIsModalOpen(false);
                    router.reload({ only: ['kelas'] });
                },
                onError: () => toast.error('Gagal menambahkan kelas'),
            });
        } else if (modalMode === 'edit' && selectedKelas) {
            router.put(route('kelas.update', selectedKelas.id), data, {
                onSuccess: () => {
                    toast.success('Kelas berhasil diperbarui');
                    setIsModalOpen(false);
                    router.reload({ only: ['kelas'] });
                },
                onError: () => toast.error('Gagal memperbarui kelas'),
            });
        }
    };

    const getWaliKelasName = (item: Kelas) => {
        if (item.waliKelas && item.waliKelas.name) {
            return item.waliKelas.name;
        }
        
        if (item.user_id) {
            const waliKelas = waliKelasOptions.find(user => user.id === item.user_id);
            return waliKelas ? waliKelas.name : '-';
        }
        
        return '-';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelas" />
            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Daftar Kelas</h1>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                    >
                        <Plus size={16} /> Tambah Kelas
                    </button>
                </div>

                <SearchFilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    kategoriFilter={kategoriFilter}
                    setKategoriFilter={setKategoriFilter}
                    onReset={resetFilters}
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    searchPlaceholder="Cari berdasarkan nama kelas..."
                    filterOptions={['X -', 'XI -', 'XII -']}
                    filterLabel="Filter berdasarkan tingkatan kelas:"
                />

                <div className="relative mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">NAMA</th>
                                <th className="px-6 py-3">WALI KELAS</th>
                                <th className="px-6 py-3">JUMLAH SISWA</th>
                                <th className="px-6 py-3">AKSI</th>
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
                                            <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">{index + 1}</td>
                                            <td className="px-6 py-4">{item.nama}</td>
                                            <td className="px-6 py-4">{getWaliKelasName(item)}</td>
                                            <td className="px-6 py-4">{item.jumlah_siswa}</td>
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

                    <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                        Menampilkan {filteredData.length} dari {kelasFromServer.length} data
                    </div>
                </div>

                <KelasModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    initialData={selectedKelas}
                    title={selectedKelas ? 'Edit Kelas' : 'Tambah Kelas'}
                    users={waliKelasOptions}
                />

                <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} />
            </div>
        </AppLayout>
    );
}