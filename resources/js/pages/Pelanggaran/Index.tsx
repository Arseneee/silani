import SearchFilterBar from '@/components/SearchFilterBar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import PelanggaranModal from './PelanggaranModal';

interface Pelanggaran {
    id: number;
    siswa_id: number;
    user_id: number;
    peraturan_id: number;
    status: 'diproses' | 'selesai' | 'ditunda';
    keterangan: string;
    waktu_terjadi: string;
    siswa?: { nama: string; kelas?: { user_id: number } };
    user?: { id: number; name: string };
    peraturan?: { jenis: string };
}

interface PageProps {
    pelanggaran: Pelanggaran[];
    siswaOptions: { id: number; nama: string; nisn: string }[];
    userOptions: { id: number; name: string }[];
    peraturanOptions: { id: number; jenis: string }[];
    auth: { user: { id: number; role: string } };
    [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Main Data', href: '/pelanggaran' }];

export default function PelanggaranPage() {
    const { props } = usePage<PageProps>();
    const pelanggaranFromServer = props.pelanggaran || [];
    const currentUser = props.auth.user;

    const [data, setData] = useState<Pelanggaran[]>(pelanggaranFromServer);
    const [filteredData, setFilteredData] = useState<Pelanggaran[]>(pelanggaranFromServer);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortField, setSortField] = useState<keyof Pelanggaran | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedItem, setSelectedItem] = useState<Pelanggaran | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        setData(pelanggaranFromServer);
    }, [pelanggaranFromServer]);

    useEffect(() => {
        let result = [...data];
        if (searchTerm) {
            result = result.filter((item) => item.siswa?.nama.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (statusFilter) {
            result = result.filter((item) => item.status === statusFilter);
        }

        if (currentUser.role === 'Guru BK') {
            result = result.filter((item) => item.user_id === currentUser.id);
        } else if (currentUser.role === 'Wali Kelas') {
            result = result.filter((item) => item.user_id === currentUser.id);
        }

        setFilteredData(result);
    }, [searchTerm, statusFilter, sortField, sortDirection, data, currentUser]);

    const handleSort = (field: keyof Pelanggaran) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
    };

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: Pelanggaran) => {
        setModalMode('edit');
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const confirmDelete = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(route('pelanggaran.destroy', deleteId), {
            onSuccess: () => {
                toast.success('Data pelanggaran berhasil dihapus');
                setIsDeleteModalOpen(false);
                setDeleteId(null);
                router.reload({ only: ['pelanggaran'] });
            },
            onError: () => toast.error('Gagal menghapus pelanggaran'),
        });
    };

    const handleSubmit = (data: Omit<Pelanggaran, 'id'>) => {
        if (modalMode === 'create') {
            router.post(route('pelanggaran.store'), data, {
                onSuccess: () => {
                    toast.success('Pelanggaran berhasil ditambahkan');
                    setIsModalOpen(false);
                    router.reload({ only: ['pelanggaran'] });
                },
                onError: () => toast.error('Gagal menambahkan pelanggaran'),
            });
        } else if (modalMode === 'edit' && selectedItem) {
            router.put(route('pelanggaran.update', selectedItem.id), data, {
                onSuccess: () => {
                    toast.success('Pelanggaran berhasil diperbarui');
                    setIsModalOpen(false);
                    router.reload({ only: ['pelanggaran'] });
                },
                onError: () => toast.error('Gagal memperbarui pelanggaran'),
            });
        }
    };

    const getStatusBadgeClass = (status: Pelanggaran['status']) => {
        switch (status) {
            case 'diproses':
                return 'bg-yellow-100 text-yellow-800';
            case 'selesai':
                return 'bg-green-100 text-green-800';
            case 'ditunda':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    let n = 1;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pelanggaran" />
            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Daftar Pelanggaran</h1>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                    >
                        <Plus size={16} /> Tambah Pelanggaran
                    </button>
                </div>

                <SearchFilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    kategoriFilter={statusFilter}
                    setKategoriFilter={setStatusFilter}
                    onReset={resetFilters}
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    searchPlaceholder="Cari berdasarkan nama siswa..."
                    filterOptions={['diproses', 'selesai', 'ditunda']}
                    filterLabel="Filter berdasarkan status:"
                />

                <div className="relative mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {['#', 'siswa', 'petugas', 'peraturan', 'keterangan', 'status', 'waktu', 'aksi'].map((key) => (
                                    <th
                                        key={key}
                                        className={`cursor-pointer px-6 py-3 ${key === 'aksi' ? 'cursor-default' : ''}`}
                                        onClick={() => key !== 'aksi' && handleSort(key as keyof Pelanggaran)}
                                    >
                                        <div className="flex items-center">
                                            {key.toUpperCase()}
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
                                            <td className="px-6 py-4">{item.siswa?.nama}</td>
                                            <td className="px-6 py-4">{item.user?.name}</td>
                                            <td className="px-6 py-4">{item.peraturan?.jenis}</td>
                                            <td className="px-6 py-4">{item.keterangan}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(item.status)}`}>
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{new Date(item.waktu_terjadi).toLocaleString()}</td>
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
                                        <td colSpan={8} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
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
                        Menampilkan {filteredData.length} dari {data.length} data
                    </div>
                </div>

                <PelanggaranModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    initialData={selectedItem}
                    title={selectedItem ? 'Edit Pelanggaran' : 'Tambah Pelanggaran'}
                    siswaOptions={props.siswaOptions}
                    userOptions={props.userOptions}
                    peraturanOptions={props.peraturanOptions}
                />

                <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} />
            </div>
        </AppLayout>
    );
}
