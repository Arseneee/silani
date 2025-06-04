import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface User {
    id: number;
    name: string;
}

interface Log {
    id: number;
    user?: User;
    activity: string;
    description: string;
    created_at: string;
}

interface Props {
    logs: {
        data: Log[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        activity?: string;
    };
}

const ActivityBadge = ({ activity }: { activity: string }) => {
    const getActivityStyle = (activity: string) => {
        switch (activity.toLowerCase()) {
            case 'login':
                return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 dark:from-emerald-900/50 dark:to-green-900/50 dark:text-emerald-200 ring-emerald-500/30 shadow-emerald-500/20';
            case 'fonnte':
                return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 dark:from-emerald-900/50 dark:to-green-900/50 dark:text-emerald-200 ring-emerald-500/30 shadow-emerald-500/20';
            case 'create':
                return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 dark:from-blue-900/50 dark:to-cyan-900/50 dark:text-blue-200 ring-blue-500/30 shadow-blue-500/20';
            case 'update':
                return 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/50 dark:to-orange-900/50 dark:text-amber-200 ring-amber-500/30 shadow-amber-500/20';
            case 'delete':
                return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 dark:from-red-900/50 dark:to-rose-900/50 dark:text-red-200 ring-red-500/30 shadow-red-500/20';
            default:
                return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 dark:from-gray-900/50 dark:to-slate-900/50 dark:text-gray-200 ring-gray-500/30 shadow-gray-500/20';
        }
    };

    const formatActivity = (activity: string) => {
        return activity.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <span
            className={`inline-flex transform items-center rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 transition-all duration-200 ring-inset hover:scale-105 ${getActivityStyle(activity)}`}
        >
            <div className="mr-1 h-1.5 w-1.5 animate-pulse rounded-full bg-current opacity-70"></div>
            {formatActivity(activity)}
        </span>
    );
};

const UserAvatar = ({ user }: { user?: User }) => {
    if (!user) {
        return (
            <div className="relative flex h-10 w-10 transform items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 shadow-lg ring-2 ring-purple-200 transition-all duration-300 hover:scale-110 dark:ring-purple-700">
                <span className="text-sm font-bold text-white">SYS</span>
                <div className="absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></div>
            </div>
        );
    }

    const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const colors = [
        'from-blue-500 via-cyan-500 to-teal-500',
        'from-emerald-500 via-green-500 to-lime-500',
        'from-purple-500 via-pink-500 to-rose-500',
        'from-orange-500 via-red-500 to-pink-500',
        'from-indigo-500 via-purple-500 to-blue-500',
        'from-yellow-500 via-orange-500 to-red-500',
    ];
    const colorIndex = user.id % colors.length;

    return (
        <div
            className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${colors[colorIndex]} transform shadow-lg ring-2 ring-white transition-all duration-300 hover:scale-110 hover:shadow-xl dark:ring-gray-700`}
        >
            <span className="text-sm font-bold text-white">{initials}</span>
        </div>
    );
};

const AnimatedCounter = ({ value }: { value: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 1000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{count.toLocaleString()}</span>;
};

const LoadingSpinner = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-600 [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-600 [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-600"></div>
    </div>
);

export default function SystemLogIndex() {
    const { logs, filters } = usePage().props as unknown as Props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [activityFilter, setActivityFilter] = useState(filters.activity || '');
    const [isLoading, setIsLoading] = useState(false);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    const handleFilterChange = () => {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (activityFilter) params.append('activity', activityFilter);

        setTimeout(() => {
            window.location.href = `/system-logs?${params.toString()}`;
        }, 500);
    };

    const handleClearFilters = () => {
        setIsLoading(true);
        setSearchTerm('');
        setActivityFilter('');
        setTimeout(() => {
            window.location.href = '/system-logs';
        }, 500);
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60) return 'Baru saja';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
        return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'System Log', href: '/system-logs' }]}>
            <Head title="System Log" />
            <div className="animate-fadeIn mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header with Gradient Background */}
                <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="animate-shimmer absolute inset-0 skew-x-12 transform bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

                    <div className="relative flex items-center justify-between">
                        <div className="animate-slideInLeft">
                            <h1 className="mb-2 text-4xl font-bold tracking-tight text-white">Log Aktivitas Sistem</h1>
                            <p className="text-lg text-indigo-100 opacity-90">Pantau semua aktivitas dan perubahan dalam sistem secara real-time</p>
                        </div>

                        <div className="animate-slideInRight flex items-center gap-4">
                            <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-6 py-4 shadow-lg backdrop-blur-sm">
                                <div className="relative">
                                    <div className="h-4 w-4 rounded-full bg-green-400 shadow-lg"></div>
                                    <div className="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-green-400 opacity-75"></div>
                                </div>
                                <div className="text-white">
                                    <div className="text-2xl font-bold">
                                        <AnimatedCounter value={logs.total} />
                                    </div>
                                    <div className="text-sm text-indigo-100 opacity-80">Total Log</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Filters with Glass Effect */}
                <div className="mb-8 transform transition-all duration-300 hover:scale-[1.01]">
                    <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl ring-1 ring-gray-200/50 backdrop-blur-xl dark:bg-gray-800/80 dark:ring-gray-700/50">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="min-w-80 flex-1">
                                <div className="group relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-indigo-600">
                                        <svg
                                            className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-indigo-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari aktivitas, user, atau deskripsi..."
                                        className="block w-full rounded-xl border-0 bg-white/70 py-4 pr-4 pl-12 text-gray-900 ring-1 ring-gray-300/50 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400 hover:bg-white/90 focus:bg-white focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700/70 dark:text-white dark:ring-gray-600/50 dark:focus:ring-indigo-400"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleFilterChange()}
                                    />
                                </div>
                            </div>

                            <select
                                className="cursor-pointer rounded-xl border-0 bg-white/70 py-4 pr-12 pl-4 text-gray-900 ring-1 ring-gray-300/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/90 focus:bg-white focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700/70 dark:text-white dark:ring-gray-600/50"
                                value={activityFilter}
                                onChange={(e) => setActivityFilter(e.target.value)}
                            >
                                <option value="">Semua Aktivitas</option>
                                <option value="login">Login</option>
                                <option value="fonnte">Fonnte</option>
                                <option value="create">Create Data</option>
                                <option value="update">Update Data</option>
                                <option value="delete">Delete Data</option>
                            </select>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleFilterChange}
                                    disabled={isLoading}
                                    className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <>
                                            <svg
                                                className="h-4 w-4 transition-transform group-hover:rotate-12"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                                />
                                            </svg>
                                            Cari
                                        </>
                                    )}
                                </button>

                                {(searchTerm || activityFilter) && (
                                    <button
                                        onClick={handleClearFilters}
                                        disabled={isLoading}
                                        className="inline-flex items-center gap-2 rounded-xl bg-gray-100/80 px-6 py-4 text-sm font-semibold text-gray-700 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700/80 dark:text-gray-200 dark:hover:bg-gray-600/80"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Table with Animations */}
                <div className="hover:shadow-3xl transform overflow-hidden rounded-2xl bg-white/90 shadow-2xl ring-1 ring-gray-200/50 backdrop-blur-xl transition-all duration-300 dark:bg-gray-800/90 dark:ring-gray-700/50">
                    {logs.data.length === 0 ? (
                        <div className="animate-fadeIn flex flex-col items-center justify-center py-20">
                            <div className="mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 p-6 shadow-lg dark:from-gray-700 dark:to-gray-600">
                                <svg
                                    className="h-12 w-12 animate-bounce text-gray-400 dark:text-gray-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h4.125M8.25 8.25V6.108"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Tidak ada data log</h3>
                            <p className="max-w-md text-center text-gray-500 dark:text-gray-300">
                                Belum ada aktivitas yang tercatat dalam sistem. Aktivitas akan muncul di sini secara otomatis.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-600/50">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                                    <tr>
                                        {['No', 'User', 'Aktivitas', 'Deskripsi', 'Waktu'].map((header, idx) => (
                                            <th
                                                key={header}
                                                className={`animate-slideInDown px-6 py-5 text-left text-xs font-bold tracking-wider text-gray-600 uppercase dark:text-gray-300`}
                                                style={{ animationDelay: `${idx * 100}ms` }}
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/30 bg-white/50 dark:divide-gray-700/30 dark:bg-gray-800/50">
                                    {logs.data.map((log, idx) => (
                                        <tr
                                            key={log.id}
                                            className={`group animate-slideInUp transform transition-all duration-300 hover:scale-[1.01] hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 hover:shadow-lg dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 ${
                                                hoveredRow === log.id
                                                    ? 'scale-[1.01] bg-gradient-to-r from-indigo-50/50 to-purple-50/50 shadow-lg dark:from-indigo-900/20 dark:to-purple-900/20'
                                                    : ''
                                            }`}
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                            onMouseEnter={() => setHoveredRow(log.id)}
                                            onMouseLeave={() => setHoveredRow(null)}
                                        >
                                            <td className="px-6 py-5 text-sm font-semibold whitespace-nowrap text-gray-900 dark:text-white">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-xs font-bold text-indigo-600 transition-transform group-hover:scale-110 dark:from-indigo-900/50 dark:to-purple-900/50 dark:text-indigo-300">
                                                    {(logs.current_page - 1) * logs.per_page + idx + 1}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <UserAvatar user={log.user} />
                                                    <div className="transition-transform group-hover:translate-x-1">
                                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {log.user?.name || 'System'}
                                                        </div>
                                                        {log.user && (
                                                            <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                                                                ID: {log.user.id}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <ActivityBadge activity={log.activity} />
                                            </td>
                                            <td className="max-w-xs px-6 py-5 text-sm text-gray-900 dark:text-white">
                                                <div
                                                    className="cursor-help truncate transition-all duration-200 group-hover:text-indigo-600 hover:text-clip hover:whitespace-normal dark:group-hover:text-indigo-300"
                                                    title={log.description}
                                                >
                                                    {log.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        className="h-4 w-4 text-gray-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        />
                                                    </svg>
                                                    {formatTimeAgo(log.created_at)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    @keyframes slideInLeft {
                        from { opacity: 0; transform: translateX(-50px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    
                    @keyframes slideInRight {
                        from { opacity: 0; transform: translateX(50px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    
                    @keyframes slideInUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    @keyframes slideInDown {
                        from { opacity: 0; transform: translateY(-20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    @keyframes shimmer {
                        0% { transform: translateX(-100%) skewX(12deg); }
                        100% { transform: translateX(200%) skewX(12deg); }
                    }
                    
                    .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
                    .animate-slideInLeft { animation: slideInLeft 0.8s ease-out; }
                    .animate-slideInRight { animation: slideInRight 0.8s ease-out; }
                    .animate-slideInUp { animation: slideInUp 0.6s ease-out; }
                    .animate-slideInDown { animation: slideInDown 0.4s ease-out; }
                    .animate-shimmer { animation: shimmer 3s infinite; }
                `,
                }}
            />
        </AppLayout>
    );
}
