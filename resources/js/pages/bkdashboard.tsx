import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BarChart3, CheckCircle, Clock, Pause, TrendingUp, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'BK Dashboard',
        href: '/bkdashboard',
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

export default function BKDashboard() {
    const { total, selesai, diproses, ditunda, pelanggaranPerBulan } = usePage().props as unknown as DashboardProps;
    const [isVisible, setIsVisible] = useState(false);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        setIsVisible(true);
    }, []);

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
