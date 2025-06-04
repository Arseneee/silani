import SearchFilterBar from '@/components/SearchFilterBar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import SiswaModal from './SiswaModal';

interface Siswa {
    [x: string]: any;
    hp_ortu: string;
    id: number;
    nisn: string;
    nama: string;
    kelas_id: number;
    nama_ortu: string;
    total_poin: number;
    status: 'Aktif' | 'SPO1' | 'SPO2' | 'SPO3' | 'Drop Out';
}

interface Kelas {
    id: number;
    nama: string;
}

interface PageProps {
    siswa: Siswa[];
    kelasOptions: Kelas[];
    [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Main Data', href: '/siswa' }];

export default function SiswaPage() {
    const { props } = usePage<PageProps>();
    const siswaFromServer = props.siswa || [];
    const kelasOptions = props.kelasOptions || [];

    const [siswaData, setSiswaData] = useState<Siswa[]>(siswaFromServer);
    const [filteredData, setFilteredData] = useState<Siswa[]>(siswaFromServer);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortField, setSortField] = useState<keyof Siswa | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        setSiswaData(siswaFromServer);
    }, [siswaFromServer]);

    useEffect(() => {
        let result = [...siswaData];
        if (searchTerm) {
            result = result.filter((item) => item.nama.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (statusFilter) {
            result = result.filter((item) => item.status === statusFilter);
        }
        if (sortField) {
            result.sort((a, b) => {
                const valueA = a[sortField];
                const valueB = b[sortField];
                return valueA < valueB ? (sortDirection === 'asc' ? -1 : 1) : valueA > valueB ? (sortDirection === 'asc' ? 1 : -1) : 0;
            });
        }
        setFilteredData(result);
    }, [searchTerm, statusFilter, sortField, sortDirection, siswaData]);

    const handleSort = (field: keyof Siswa) => {
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
        setSelectedSiswa(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: Siswa) => {
        setModalMode('edit');
        setSelectedSiswa(item);
        setIsModalOpen(true);
    };

    const confirmDelete = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!deleteId) return;

        router.delete(route('siswa.destroy', deleteId), {
            onSuccess: () => {
                toast.success('Data siswa berhasil dihapus');
                setIsDeleteModalOpen(false);
                setDeleteId(null);
                router.reload({ only: ['siswa'] });
            },
            onError: () => toast.error('Gagal menghapus siswa'),
        });
    };

    const handleSubmit = (data: Omit<Siswa, 'id' | 'total_poin'>) => {
        if (modalMode === 'create') {
            router.post(route('siswa.store'), data, {
                onSuccess: () => {
                    toast.success('Siswa berhasil ditambahkan');
                    setIsModalOpen(false);
                    router.reload({ only: ['siswa'] });
                },
                onError: () => toast.error('Gagal menambahkan siswa'),
            });
        } else if (modalMode === 'edit' && selectedSiswa) {
            router.put(route('siswa.update', selectedSiswa.id), data, {
                onSuccess: () => {
                    toast.success('Siswa berhasil diperbarui');
                    setIsModalOpen(false);
                    router.reload({ only: ['siswa'] });
                },
                onError: () => toast.error('Gagal memperbarui siswa'),
            });
        }
    };

    let n = 1;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Siswa" />
            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Daftar Siswa</h1>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                    >
                        <Plus size={16} /> Tambah Siswa
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
                    filterOptions={['Aktif', 'SPO1', 'SPO2', 'SPO3', 'Drop Out']}
                    filterLabel="Filter berdasarkan status:"
                />

                <div className="relative mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {['#', 'nisn', 'nama', 'kelas', 'orang tua', 'no hp', 'total poin', 'status', 'aksi'].map((key) => (
                                    <th
                                        key={key}
                                        className={`cursor-pointer px-6 py-3 ${key === 'aksi' ? 'cursor-default' : ''}`}
                                        onClick={() => key !== 'aksi' && handleSort(key as keyof Siswa)}
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
                                            <td className="px-6 py-4">{item.nisn}</td>
                                            <td className="px-6 py-4">{item.nama}</td>
                                            <td className="px-6 py-4">{item.kelas?.nama}</td>
                                            <td className="px-6 py-4">{item.nama_ortu}</td>
                                            <td className="px-6 py-4">{item.hp_ortu}</td>
                                            <td className="px-6 py-4 text-center">{item.total_poin}</td>
                                            <td className="px-6 py-4">{item.status}</td>
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
                                        <td colSpan={9} className="px-6 py-12 text-center">
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
                        Menampilkan {filteredData.length} dari {siswaData.length} data
                    </div>
                </div>

                <SiswaModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    initialData={selectedSiswa}
                    title={selectedSiswa ? 'Edit Siswa' : 'Tambah Siswa'}
                    kelasOptions={kelasOptions}
                />
                <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} />
            </div>
        </AppLayout>
    );
}
