import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
    children: React.ReactNode;
}

import { useState } from 'react';

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Tracking', href: '/', current: router.pathname === '/' },
        {
            name: 'Ground Stations',
            href: '/ground-stations',
            current: router.pathname === '/ground-stations',
        },
        {
            name: 'Monitoring',
            href: '/telemetry',
            current: router.pathname === '/telemetry',
        },
        {
            name: 'Commands',
            href: '/commands',
            current: router.pathname === '/commands',
        },
    ];

    return (
        <div className='min-h-screen bg-dark-900'>
            {/* Navigation */}
            <nav className='bg-dark-800 border-b border-dark-700'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <div className='flex h-16 items-center justify-between'>
                        <div className='flex items-center'>
                            <div className='flex-shrink-0'>
                                <div className='flex items-center'>
                                    <img
                                        src='/logo.jpg'
                                        alt='Logo'
                                        className='h-8 w-8 rounded-lg object-cover'
                                    />
                                    <span className='ml-2 text-white font-semibold text-lg'>
                                        Rustar
                                    </span>
                                </div>
                            </div>
                            <div className='hidden md:block'>
                                <div className='ml-10 flex items-baseline space-x-4'>
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`${
                                                item.current
                                                    ? 'bg-primary-600 text-white'
                                                    : 'text-dark-300 hover:bg-dark-700 hover:text-white'
                                            } rounded-md px-3 py-2 text-sm font-medium transition-colors`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='flex md:hidden'>
                            {/* Mobile menu button */}
                            <button
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                className='inline-flex items-center justify-center rounded-md p-2 text-dark-400 hover:text-white hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
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
                            </button>
                        </div>
                        <div className='hidden md:block'>
                            <div className='ml-4 flex items-center md:ml-6'>
                                <button className='rounded-full bg-dark-800 p-1 text-dark-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-dark-800'>
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
                                </button>
                                <div className='ml-3 text-sm text-dark-300'>
                                    <span>Admin User</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Mobile menu, show/hide based on menu state. */}
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
                                    className={`block ${
                                        item.current
                                            ? 'bg-primary-600 text-white'
                                            : 'text-dark-300 hover:bg-dark-700 hover:text-white'
                                    } rounded-md px-3 py-2 text-base font-medium transition-colors`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main content */}
            <main className='flex-1 px-2 sm:px-4 md:px-8'>{children}</main>
        </div>
    );
};

export default Layout;
