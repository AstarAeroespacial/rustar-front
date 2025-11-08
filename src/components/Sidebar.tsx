import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from './ui/Button';

interface SidebarItem {
    title: string;
    url: string;
    icon: React.ReactNode;
}

interface SidebarProps {
    items: SidebarItem[];
    title?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ items, title }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showText, setShowText] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    // Initialize from localStorage only after mount to prevent hydration errors
    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarCollapsed');
            const collapsed = saved === 'true';
            setIsCollapsed(collapsed);
            setShowText(!collapsed);
        }
    }, []);

    // Save collapsed state to localStorage whenever it changes
    const handleToggleCollapse = () => {
        const newState = !isCollapsed;

        if (newState) {
            // Collapsing: hide text immediately
            setShowText(false);
            setIsCollapsed(true);
        } else {
            // Expanding: show sidebar first, then text after delay
            setIsCollapsed(false);
            setTimeout(() => setShowText(true), 150);
        }

        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebarCollapsed', String(newState));
        }
    };

    const isActive = (url: string) => {
        const pathname = router.pathname;
        if (!pathname) return false;

        // Exact match for base routes
        if (url === pathname) return true;

        // Check if the current path matches the URL pattern
        return router.asPath === url;
    };

    return (
        <>
            {/* Mobile menu button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                variant='ghost'
                iconOnly
                size='md'
                className='md:hidden fixed top-20 left-4 z-50'
                aria-label='Toggle menu'
            >
                <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 6h16M4 12h16M4 18h16'
                    />
                </svg>
            </Button>

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:sticky top-0 left-0 h-screen
                    bg-[#141B23] border-r border-[#13181D]
                    transition-all duration-300 ease-in-out z-40
                    ${isCollapsed ? 'w-16' : 'w-48'}
                    ${isOpen
                        ? 'translate-x-0'
                        : '-translate-x-full md:translate-x-0'
                    }
                `}
            >
                {/* Header with title and collapse button */}
                <div className='flex items-center justify-between p-3 border-b border-[#13181D]'>
                    {showText && (
                        <h2 className='text-white font-semibold text-sm truncate'>
                            {title || 'Loading...'}
                        </h2>
                    )}
                    <Button
                        onClick={handleToggleCollapse}
                        variant='ghost'
                        iconOnly
                        size='sm'
                        className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''
                            }`}
                        aria-label={
                            isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                        }
                    >
                        {isCollapsed ? (
                            <PanelLeftOpen className='w-4 h-4' />
                        ) : (
                            <PanelLeftClose className='w-4 h-4' />
                        )}
                    </Button>
                </div>

                <nav className='flex flex-col gap-1 p-3'>
                    {items.map((item) => {
                        const active = isActive(item.url);

                        return (
                            <Link
                                key={item.title}
                                href={item.url}
                                title={isCollapsed ? item.title : ''}
                            >
                                <Button
                                    variant={active ? 'primary' : 'ghost'}
                                    size='md'
                                    fullWidth
                                    className={
                                        isCollapsed
                                            ? 'justify-center'
                                            : 'justify-start'
                                    }
                                    iconOnly={isCollapsed}
                                    iconLeft={
                                        !isCollapsed ? item.icon : undefined
                                    }
                                >
                                    {isCollapsed ? (
                                        <span className='w-5 h-5 flex-shrink-0'>
                                            {item.icon}
                                        </span>
                                    ) : (
                                        <span className='text-sm whitespace-nowrap'>
                                            {item.title}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className='md:hidden fixed inset-0 bg-black/50 z-30'
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
