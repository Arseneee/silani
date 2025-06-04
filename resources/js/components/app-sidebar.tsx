import { NavFooter } from '@/components/nav-footer';
import { NavData, NavMain, NavLog } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { CircleUserRound, Folder, Home, LayoutGrid, MessageSquareShare, MessageSquareWarning, MonitorCog, OctagonAlert, School, UsersRound } from 'lucide-react';
import AppLogo from './app-logo';

const Navigasi: NavItem[] = [
    {
        title: 'Home',
        href: '/',
        icon: Home,
    },
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const MainData: NavItem[] = [
    {
        title: 'User',
        href: '/users',
        icon: CircleUserRound,
    },
    {
        title: 'Siswa',
        href: '/siswa',
        icon: UsersRound,
    },
    {
        title: 'Kelas',
        href: '/kelas',
        icon: School,
    },
    {
        title: 'Peraturan',
        href: '/peraturan',
        icon: OctagonAlert,
    },
    {
        title: 'Pelanggaran',
        href: '/pelanggaran',
        icon: MessageSquareWarning,
    },
];

const Log: NavItem[] = [
    {
        title: 'logs',
        href: '/system-logs',
        icon: MonitorCog,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Cetak Laporan',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={Navigasi} />
                <NavData items={MainData} />
                <NavLog items={Log} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
