import SearchFilterBar from '@/components/SearchFilterBar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import UserModal from './UserModal';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    no_hp: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Main Data', href: '/users' }];

export default function UserPage() {
    const page = usePage();
    const usersFromServer = page.props.users as User[];

    const [userData, setUserData] = useState<User[]>(usersFromServer);
    const [filteredData, setFilteredData] = useState<User[]>(usersFromServer);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [sortField, setSortField] = useState<keyof User | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        setUserData(usersFromServer);
    }, [usersFromServer]);

    useEffect(() => {
        let result = [...userData];

        if (searchTerm) {
            result = result.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (roleFilter) {
            result = result.filter((user) => user.role === roleFilter);
        }

        if (sortField) {
            result.sort((a, b) => {
                const aVal = a[sortField];
                const bVal = b[sortField];
                return aVal < bVal ? (sortDirection === 'asc' ? -1 : 1) : aVal > bVal ? (sortDirection === 'asc' ? 1 : -1) : 0;
            });
        }

        setFilteredData(result);
    }, [searchTerm, roleFilter, sortField, sortDirection, userData]);

    const handleSort = (field: keyof User) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setRoleFilter('');
    };

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setModalMode('edit');
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const confirmDelete = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!deleteId) return;

        router.delete(route('users.destroy', deleteId), {
            onSuccess: () => {
                toast.success('User berhasil dihapus');
                setIsDeleteModalOpen(false);
                router.reload({ only: ['users'] });
            },
            onError: () => toast.error('Gagal menghapus user'),
        });
    };

    const handleSubmit = (data: Omit<User, 'id'>) => {
        if (modalMode === 'create') {
            router.post(route('users.store'), data, {
                onSuccess: () => {
                    toast.success('User berhasil ditambahkan');
                    setIsModalOpen(false);
                    router.reload({ only: ['users'] });
                },
                onError: () => toast.error('Gagal menambahkan user'),
            });
        } else if (modalMode === 'edit' && selectedUser) {
            router.put(route('users.update', selectedUser.id), data, {
                onSuccess: () => {
                    toast.success('User berhasil diperbarui');
                    setIsModalOpen(false);
                    router.reload({ only: ['users'] });
                },
                onError: () => toast.error('Gagal memperbarui user'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data User" />
            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Daftar User</h1>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        <Plus size={16} /> Tambah User
                    </button>
                </div>

                <SearchFilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    kategoriFilter={roleFilter}
                    setKategoriFilter={setRoleFilter}
                    onReset={resetFilters}
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    searchPlaceholder="Cari berdasarkan nama user..."
                    filterOptions={['Admin', 'Wali Kelas', 'Guru BK']}
                    filterLabel="Filter berdasarkan role:"
                />

                <div className="relative overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {['No', 'Nama', 'Email', 'Role', 'No HP', 'Aksi'].map((key, idx) => (
                                    <th
                                        key={idx}
                                        className={`px-6 py-3 ${key === 'Aksi' ? '' : 'cursor-pointer'}`}
                                        onClick={() => key !== 'Aksi' && handleSort(key.toLowerCase() as keyof User)}
                                    >
                                        <div className="flex items-center">
                                            {key}
                                            {sortField === key.toLowerCase() && <ArrowUpDown className="ml-1 h-3.5 w-3.5" />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredData.length > 0 ? (
                                    filteredData.map((user, i) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2, delay: i * 0.05 }}
                                            className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{i + 1}</td>
                                            <td className="px-6 py-4">{user.name}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">{user.role}</td>
                                            <td className="px-6 py-4">{user.no_hp}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(user.id)}
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
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            Tidak ada data yang ditemukan.
                                            <br />
                                            <button onClick={resetFilters} className="mt-3 text-sm text-blue-600 hover:underline dark:text-blue-400">
                                                Reset pencarian
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        Menampilkan {filteredData.length} dari {userData.length} data
                    </div>
                </div>

                <UserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    initialData={modalMode === 'edit' ? selectedUser! : undefined}
                    title={modalMode === 'create' ? 'Tambah User' : 'Edit User'}
                />
                <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} userName={''} />
            </div>
        </AppLayout>
    );
}
