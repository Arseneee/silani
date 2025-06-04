import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { AlertTriangle, Clock, FileText, Moon, Search, Shield, Sun, User } from 'lucide-react';
import { useEffect, useState } from 'react';

type PelanggaranType = {
    id: number;
    siswa: { nama: string; nisn: string };
    peraturan: { jenis: string; poin: string };
    status: string;
    keterangan: string;
    waktu_terjadi: string;
};

type PeraturanType = {
    id: number;
    jenis: string;
    poin: number;
    kategori: string;
    deskripsi: string;
};

export default function Welcome() {
    const { auth } = usePage().props as any;

    const [search, setSearch] = useState('');
    const [results, setResults] = useState<PelanggaranType[]>([]);
    const [peraturan, setPeraturan] = useState<PeraturanType[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingPeraturan, setLoadingPeraturan] = useState(true);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
        } else if (savedTheme === 'light') {
            setIsDark(false);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(prefersDark);
        }
    }, []);

    useEffect(() => {
        axios
            .get('/api/peraturan')
            .then((response) => {
                setPeraturan(response.data);
            })
            .catch((error) => {
                console.error('Error fetching peraturan:', error);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!search.trim()) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(() => {
            setLoading(true);
            axios
                .get(`/api/search?term=${search}`)
                .then((res) => {
                    setResults(res.data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

    const toggleTheme = () => {
        setIsDark((prev) => {
            const next = !prev;
            localStorage.setItem('theme', next ? 'dark' : 'light');
            return next;
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'selesai':
                return isDark ? 'text-green-400 bg-green-400/20' : 'text-green-600 bg-green-100';
            case 'proses':
                return isDark ? 'text-yellow-400 bg-yellow-400/20' : 'text-yellow-600 bg-yellow-100';
            case 'pending':
                return isDark ? 'text-red-400 bg-red-400/20' : 'text-red-600 bg-red-100';
            default:
                return isDark ? 'text-gray-400 bg-gray-400/20' : 'text-gray-600 bg-gray-100';
        }
    };

    const getPoinColor = (poin: number) => {
        if (poin >= 75) return 'text-red-500';
        if (poin >= 50) return 'text-orange-500';
        if (poin >= 25) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <>
            <Head title="Welcome" />
            <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} flex min-h-screen flex-col`}>
                {/* Navbar */}
                <nav
                    className={`absolute top-0 z-10 flex w-full items-center justify-between px-6 py-4 backdrop-blur-md ${
                        isDark ? 'text-white' : 'border-gray-200 text-white'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <img src="/img/tut_wuri.png" alt="Tutwuri" className="h-10" />
                        <img src="/img/pemprov.png" alt="Pemko" className="h-10" />
                        <span className="hidden text-lg font-semibold tracking-wide md:block">SMK Negeri 1 Percut Sei Tuan</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} className="rounded-full p-2 transition hover:bg-gray-300/30" title="Ganti Tema">
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <span className="text-xl font-bold tracking-wider">SILANI | </span>
                        <Link
                            href={auth.user ? route('dashboard') : route('login')}
                            className={`rounded border px-4 py-1.5 transition ${
                                isDark
                                    ? 'border-white text-white hover:bg-white hover:text-black'
                                    : 'border-white text-white hover:bg-white hover:text-black'
                            }`}
                        >
                            {auth.user ? 'Dashboard' : 'Login'}
                        </Link>
                    </div>
                </nav>

                {/* Hero */}
                <section className="relative flex h-[90vh] w-full flex-col items-center justify-center pt-24 text-center">
                    <div className="absolute inset-0 z-0 h-screen overflow-hidden">
                        <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                            <source src="/videos/partikel.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black/60"></div>
                    </div>

                    <h1 className="z-10 mb-4 text-4xl font-bold text-white lg:text-6xl">Selamat Datang di SILANI</h1>
                    <p className="z-10 mb-8 max-w-xl text-lg text-gray-200">
                        Sistem Informasi Layanan Siswa Digital. Cari informasi pelanggaran berdasarkan NISN atau nama siswa.
                    </p>

                    <div className="relative z-10 w-full max-w-md">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan NISN atau nama siswa..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && search.trim() && axios.get(`/api/search?term=${search}`)}
                                className={`w-full rounded-lg py-3 pr-4 pl-10 shadow-lg transition-all duration-300 focus:ring-2 focus:outline-none ${
                                    isDark
                                        ? 'border border-gray-700 bg-gray-800/90 text-white placeholder-gray-400 focus:ring-blue-400'
                                        : 'border border-gray-200 bg-white/95 text-black placeholder-gray-500 focus:ring-blue-500'
                                }`}
                            />
                        </div>
                        <p className="z-10 mt-3 block max-w-xl text-lg text-gray-300 md:hidden">SMK Negeri 1 Percut Sei Tuan</p>
                    </div>
                </section>

                {/* Search Results */}
                {search && (
                    <section
                        className={`relative z-10 mx-auto w-full max-w-6xl px-4 py-16 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm`}
                    >
                        <div className="mb-12 text-center">
                            <h2 className={`mb-4 text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Hasil Pencarian</h2>
                            <div className={`mx-auto h-1 w-24 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div
                                    className={`h-12 w-12 animate-spin rounded-full border-4 border-t-transparent ${
                                        isDark ? 'border-blue-400' : 'border-blue-600'
                                    }`}
                                ></div>
                                <p className={`mt-4 text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Mencari data...</p>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                {results.map((item, i) => (
                                    <div
                                        key={i}
                                        className={`group rounded-xl border p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                                            isDark
                                                ? 'border-gray-700/50 bg-gray-800/50 text-white hover:border-blue-500/50'
                                                : 'border-gray-200 bg-white/80 text-gray-900 shadow-sm hover:border-blue-300'
                                        }`}
                                    >
                                        <div className="mb-4 flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`rounded-lg p-2 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                                    <User className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold">{item.siswa.nama}</h3>
                                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>NISN: {item.siswa.nisn}</p>
                                                </div>
                                            </div>
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className={`mt-0.5 h-4 w-4 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                                                <div>
                                                    <p className="font-medium">{item.peraturan.jenis}</p>
                                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        Poin:{' '}
                                                        <span className={`font-semibold ${getPoinColor(parseInt(item.peraturan.poin))}`}>
                                                            +{item.peraturan.poin}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <FileText className={`mt-0.5 h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item.keterangan}</p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Clock className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {new Date(item.waktu_terjadi).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <div className={`mb-4 inline-block rounded-full p-4 ${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
                                    <Search className={`h-8 w-8 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                                </div>
                                <p className={`text-lg font-medium ${isDark ? 'text-red-300' : 'text-red-600'}`}>Tidak ada hasil untuk "{search}"</p>
                                <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Pastikan NISN atau nama siswa yang dicari sudah benar
                                </p>
                            </div>
                        )}
                    </section>
                )}  
            </div>
        </>
    );
}
