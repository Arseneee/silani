import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;
    const quotes = [
        { message: 'Pendidikan adalah senjata paling ampuh yang bisa kamu gunakan untuk mengubah dunia.', author: 'Nelson Mandela' },
        { message: 'Akar pendidikan itu pahit, tapi buahnya manis.', author: 'Aristoteles' },
        { message: 'Tujuan pendidikan adalah menggantikan pikiran yang kosong dengan pikiran yang terbuka.', author: 'Malcolm Forbes' },
        { message: 'Belajar tanpa berpikir itu tidaklah berguna, tapi berpikir tanpa belajar itu sangat berbahaya.', author: 'Confucius' },
        { message: 'Pendidikan bukan persiapan untuk hidup; pendidikan adalah hidup itu sendiri.', author: 'John Dewey' },
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col overflow-hidden p-10 text-white lg:flex">
                <video autoPlay loop muted playsInline className="absolute inset-0 z-0 h-full w-full object-cover">
                    <source src="/videos/backgroundsplit.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 z-10 bg-black/60" />
                <div className="relative z-20 flex h-full flex-col">
                    <Link href={route('home')} className="flex items-center text-lg font-medium text-white">
                        <AppLogoIcon className="mr-2 size-8 fill-current text-white" />
                        SMK Negeri 1 Percut Sei Tuan
                    </Link>
                    {quote && (
                        <div className="relative z-20 mt-auto">
                            <blockquote className="space-y-2">
                                <p className="text-lg">&ldquo;{randomQuote.message}&rdquo;</p>
                                <footer className="text-sm text-neutral-300">{randomQuote.author}</footer>
                            </blockquote>
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href={route('home')} className="relative z-20 flex items-center justify-center lg:hidden">
                        <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-muted-foreground text-sm text-balance">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
