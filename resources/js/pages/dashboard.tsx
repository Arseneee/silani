import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BarChart3, CheckCircle, Clock, Pause, TrendingUp, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type DashboardProps = {
    total: number;
    selesai: number;
    diproses: number;
    ditunda: number;
    pelanggaranPerBulan: {
        bulan: string;
        jumlah: number;
    }[];
};

type Device = {
    id: number;
    name: string;
    phone: string;
    status: string;
    token: string;
    quota?: number;
};

export default function Dashboard() {
    const { total, selesai, diproses, ditunda, pelanggaranPerBulan } = usePage().props as unknown as DashboardProps;
    const [isVisible, setIsVisible] = useState(false);
    const [devices, setDevices] = useState<Device[]>([]);
    const [loadingDevices, setLoadingDevices] = useState(false);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        setIsVisible(true);
        loadDevices();
    }, []);

    async function loadDevices() {
        setLoadingDevices(true);
        try {
            const res = await fetch('/devices', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });

            console.log('Response status:', res.status);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            console.log('Received data:', data);

            if (Array.isArray(data)) {
                setDevices(data);
            } else if (data.devices && Array.isArray(data.devices)) {
                setDevices(data.devices);
            } else if (data.data && Array.isArray(data.data)) {
                setDevices(data.data);
            } else {
                console.warn('Unexpected data structure:', data);
                setDevices([]);
            }
        } catch (error) {
            console.error('Error loading devices:', error);
            setDevices([
                {
                    id: 1,
                    name: 'Device 1',
                    phone: '+6281234567890',
                    status: 'connect',
                    token: 'token123',
                    quota: 100,
                },
                {
                    id: 2,
                    name: 'Device 2',
                    phone: '+6281234567891',
                    status: 'disconnect',
                    token: 'token456',
                    quota: 50,
                },
            ]);
        } finally {
            setLoadingDevices(false);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            fetchDeviceStatus();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    async function fetchDeviceStatus() {
        try {
            const res = await fetch('/devices/status');
            if (!res.ok) throw new Error('Failed to fetch device status');
            const data = await res.json();
            setDevices(data.devices);
        } catch (error) {
            console.error('Error fetching device status:', error);
        }
    }

    function connectDevice(device: Device) {
        window.open('https://md.fonnte.com/new/device.php', '_blank');
    }

    function disconnectDevice(device: Device) {
        window.open('https://md.fonnte.com/new/device.php', '_blank');
    }

    const statCards = [
        {
            title: 'Total Pelanggaran',
            value: total,
            icon: TrendingUp,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
            textColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Selesai',
            value: selesai,
            icon: CheckCircle,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50 dark:bg-green-950/30',
            textColor: 'text-green-600 dark:text-green-400',
        },
        {
            title: 'Diproses',
            value: diproses,
            icon: Clock,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-950/30',
            textColor: 'text-orange-600 dark:text-orange-400',
        },
        {
            title: 'Ditunda',
            value: ditunda,
            icon: Pause,
            color: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50 dark:bg-red-950/30',
            textColor: 'text-red-600 dark:text-red-400',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Welcome Section */}
                <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <div className="mb-8">
                        <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:to-gray-300">
                            Dashboard Overview
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Monitor dan kelola pelanggaran dengan mudah</p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((card, index) => (
                        <StatCard key={card.title} {...card} index={index} isVisible={isVisible} />
                    ))}
                </div>

                {/* Devices Section */}
                <div
                    className={`transform transition-all delay-300 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                >
                    <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-gray-700/50 dark:bg-gray-900/80">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 p-2">
                                    <Wifi className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Device Management</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Kelola perangkat Fonnte</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                #
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Quota
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                        {loadingDevices ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                                                        <p className="text-gray-500 dark:text-gray-400">Loading devices...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : devices.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <WifiOff className="mb-4 h-12 w-12 text-gray-400" />
                                                        <p className="font-medium text-gray-500 dark:text-gray-400">No devices found</p>
                                                        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                                                            Add your first device to get started
                                                        </p>
                                                        <button
                                                            onClick={loadDevices}
                                                            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-150 hover:bg-blue-700"
                                                        >
                                                            Refresh
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            devices.map((device, index) => (
                                                <tr
                                                    key={device.id}
                                                    className="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                >
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                        {device.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                        {device.quota || 0}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                                device.status === 'connect'
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                            }`}
                                                        >
                                                            {device.status === 'connect' ? (
                                                                <>
                                                                    <Wifi className="mr-1 h-3 w-3" />
                                                                    Connected
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <WifiOff className="mr-1 h-3 w-3" />
                                                                    Disconnected
                                                                </>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                        {device.status === 'connect' ? (
                                                            <>
                                                                <button
                                                                    className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                                    onClick={() => disconnectDevice(device)}
                                                                    disabled={processingId === device.id}
                                                                >
                                                                    {processingId === device.id ? (
                                                                        <>
                                                                            <div className="mr-1 h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></div>
                                                                            Processing...
                                                                        </>
                                                                    ) : (
                                                                        'Disconnect'
                                                                    )}
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                                onClick={() => connectDevice(device)}
                                                                disabled={processingId === device.id}
                                                            >
                                                                {processingId === device.id ? (
                                                                    <>
                                                                        <div className="mr-1 h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></div>
                                                                        Connecting...
                                                                    </>
                                                                ) : (
                                                                    'Connect'
                                                                )}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div    
                    className={`transform transition-all delay-500 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                >
                    <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-gray-700/50 dark:bg-gray-900/80">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-2">
                                <BarChart3 className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tren Pelanggaran</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Data pelanggaran per bulan</p>
                            </div>
                        </div>

                        <div className="relative">
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={pelanggaranPerBulan} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.6} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                                    <XAxis dataKey="bulan" tick={{ fontSize: 12 }} stroke="#6b7280" />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                            backdropFilter: 'blur(10px)',
                                        }}
                                        cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                                    />
                                    <Bar
                                        dataKey="jumlah"
                                        fill="url(#colorGradient)"
                                        radius={[8, 8, 0, 0]}
                                        className="transition-opacity duration-200 hover:opacity-80"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({
    title,
    value,
    icon: Icon,
    color,
    bgColor,
    textColor,
    index,
    isVisible,
}: {
    title: string;
    value: number;
    icon: any;
    color: string;
    bgColor: string;
    textColor: string;
    index: number;
    isVisible: boolean;
}) {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                const duration = 1500;
                const startTime = Date.now();
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    setAnimatedValue(Math.floor(value * easeOutQuart));

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
                animate();
            }, index * 200);

            return () => clearTimeout(timer);
        }
    }, [isVisible, value, index]);

    return (
        <div
            className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-6 scale-95 opacity-0'}`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            <div
                className={`group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-900/80`}
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}></div>

                <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${bgColor} mb-4 transition-transform duration-300 group-hover:scale-110`}
                >
                    <Icon className={`h-6 w-6 ${textColor}`} />
                </div>

                <div className="relative">
                    <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className={`text-3xl font-bold ${textColor} tracking-tight`}>{animatedValue.toLocaleString()}</p>
                </div>

                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"></div>
            </div>
        </div>
    );
}
