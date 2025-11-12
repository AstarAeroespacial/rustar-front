import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from './ui/Button';
import { PanelLeft } from 'lucide-react';
import { useSidebar } from '~/contexts/SidebarContext';

const NavBar: React.FC = () => {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Try to get sidebar context, but don't fail if it doesn't exist
    let sidebarContext;
    try {
        sidebarContext = useSidebar();
    } catch {
        sidebarContext = null;
    }

    // Check if we're on a page that has a sidebar (satellites or ground stations detail pages)
    const hasSidebar =
        router.pathname.startsWith('/satellites/') ||
        router.pathname.startsWith('/ground-stations/');
    const showSidebarToggle = hasSidebar && sidebarContext;

    const navigation = [
        {
            name: 'Satellites',
            href: '/',
            current:
                router.pathname === '/' ||
                router.pathname.startsWith('/satellites'),
        },
        {
            name: 'Ground Stations',
            href: '/ground-stations',
            current: router.pathname.startsWith('/ground-stations'),
        },
    ];

    return (
        <nav className='bg-[#141B23] border-b-2 border-[#0B0D10]'>
            <div className='flex h-16 items-center justify-between px-4'>
                <div className='flex items-center w-full gap-2'>
                    {/* Sidebar toggle button for mobile - only show on pages with sidebar */}
                    {showSidebarToggle && (
                        <button
                            onClick={() => sidebarContext?.toggleSidebar()}
                            className='md:hidden p-2 rounded-lg text-white hover:bg-[#1a2632] transition-colors flex-shrink-0'
                            aria-label='Toggle sidebar'
                        >
                            <PanelLeft className='w-5 h-5' />
                        </button>
                    )}

                    <div className='flex-shrink-0'>
                        <Link
                            href='/'
                            className='flex items-center'
                        >
                            <img
                                src='/logo.png'
                                alt='Logo'
                                className='h-16 w-16 object-contain'
                            />
                            <span className='ml-2 sm:ml-4 text-white font-semibold text-base sm:text-lg'>
                                RUSTAR
                            </span>
                        </Link>
                    </div>
                    <div className='hidden md:block flex-1'>
                        <div className='ml-10 flex items-baseline space-x-4'>
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                >
                                    <Button
                                        variant={
                                            item.current ? 'primary' : 'ghost'
                                        }
                                        size='sm'
                                    >
                                        {item.name}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='flex items-center'>
                    <div className='flex md:hidden'>
                        {/* Mobile menu button */}
                        <Button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            variant='ghost'
                            iconOnly
                            size='md'
                            aria-controls='mobile-menu'
                            aria-expanded={mobileMenuOpen}
                        >
                            <span className='sr-only'>Open main menu</span>
                            {mobileMenuOpen ? (
                                <svg
                                    className='block h-6 w-6'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                    aria-hidden='true'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M6 18L18 6M6 6l12 12'
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className='block h-6 w-6'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                    aria-hidden='true'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M4 6h16M4 12h16M4 18h16'
                                    />
                                </svg>
                            )}
                        </Button>
                    </div>
                    <div className='hidden md:block'>
                        <div className='ml-4 flex items-center md:ml-6 gap-3'>
                            <Button
                                variant='ghost'
                                iconOnly
                                size='md'
                                className='rounded-full'
                            >
                                <span className='sr-only'>
                                    View notifications
                                </span>
                                <svg
                                    className='h-6 w-6'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth='1.5'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0'
                                    />
                                </svg>
                            </Button>
                            <Button
                                variant='ghost'
                                iconOnly
                                size='md'
                                className='rounded-full'
                            >
                                <span className='sr-only'>User menu</span>
                                <svg
                                    className='h-6 w-6'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth='1.5'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
                                    />
                                </svg>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div
                    className='md:hidden'
                    id='mobile-menu'
                >
                    <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Button
                                    variant={item.current ? 'primary' : 'ghost'}
                                    size='md'
                                    fullWidth
                                >
                                    {item.name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
