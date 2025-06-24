import { NavFooter } from '@/components/nav-footer';
import { NavData, NavLog, NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CircleUserRound, Folder, Home, LayoutGrid, MessageSquareWarning, MonitorCog, OctagonAlert, School, UsersRound } from 'lucide-react';
import AppLogo from './app-logo';

const getNavigasi = (role: string): NavItem[] => {
    const baseNavigasi = [
        {
            title: 'Home',
            href: '/',
            icon: Home,
        },
        {
            title: 'Dashboard',
            href: role === 'Admin' ? '/dashboard' : role === 'Guru BK' ? '/bkdashboard' : '/wkdashboard',
            icon: LayoutGrid,
        },
    ];

    return baseNavigasi;
};

const getMainData = (role: string): NavItem[] => {
    const allItems = [
        {
            title: 'User',
            href: '/users',
            icon: CircleUserRound,
            roles: ['Admin'],
        },
        {
            title: 'Siswa',
            href: '/siswa',
            icon: UsersRound,
            roles: ['Admin', 'Guru BK', 'Wali Kelas'],
        },
        {
            title: 'Kelas',
            href: '/kelas',
            icon: School,
            roles: ['Admin'],
        },
        {
            title: 'Peraturan',
            href: '/peraturan',
            icon: OctagonAlert,
            roles: ['Admin', 'Guru BK'],
        },
        {
            title: 'Pelanggaran',
            href: '/pelanggaran',
            icon: MessageSquareWarning,
            roles: ['Admin', 'Guru BK', 'Wali Kelas'],
        },
    ];

    return allItems.filter((item) => item.roles.includes(role));
};

const getLogItems = (role: string): NavItem[] => {
    if (role === 'Admin') {
        return [
            {
                title: 'Logs',
                href: '/system-logs',
                icon: MonitorCog,
            },
        ];
    }
    return [];
};

const getFooterItems = (role: string): NavItem[] => {
    const baseItems = [
        {
            title: 'Cetak Laporan',
            href: '/laporan',
            icon: Folder,
            roles: ['Admin', 'Guru BK'],
        },
    ];

    return baseItems.filter((item) => item.roles.includes(role));
};

export function AppSidebar() {
    const { auth } = usePage<{
        auth: {
            user: {
                id: number;
                name: string;
                email: string;
                role: string;
            } | null;
        };
    }>().props;

    const role = auth.user?.role || '';
    const navigasi = getNavigasi(role);
    const mainData = getMainData(role);
    const logItems = getLogItems(role);
    const footerItems = getFooterItems(role);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={
                                    role === 'Admin'
                                        ? '/dashboard'
                                        : role === 'Guru BK'
                                          ? '/bkdashboard'
                                          : role === 'Wali Kelas'
                                            ? '/wkdashboard'
                                            : '/'
                                }
                                prefetch
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navigasi} />
                <NavData items={mainData} />
                <NavLog items={logItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerItems} />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
