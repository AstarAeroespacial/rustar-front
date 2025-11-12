import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { Button } from './ui/Button';
import { useIsMobile } from '~/hooks/use-mobile';
import { useSidebar } from '~/contexts/SidebarContext';

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
    const isMobile = useIsMobile();
    const { isOpen, setIsOpen } = useSidebar();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showText, setShowText] = useState(true);

    // Initialize from localStorage only after mount to prevent hydration errors
    useEffect(() => {
        if (typeof window !== 'undefined' && !isMobile) {
            const saved = localStorage.getItem('sidebarCollapsed');
            const collapsed = saved === 'true';
            setIsCollapsed(collapsed);
            setShowText(!collapsed);
        }
    }, [isMobile]);

    // Close mobile menu when route changes
    useEffect(() => {
        if (isMobile) {
            setIsOpen(false);
        }
    }, [router.pathname, isMobile]);

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
            {/* Overlay for mobile */}
            {isOpen && isMobile && (
                <div
                    className='fixed inset-0 bg-black/60 z-40 md:hidden'
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:sticky top-0 left-0 h-screen
                    bg-[#141B23] border-r border-[#13181D]
                    transition-all duration-300 ease-in-out
                    ${
                        isMobile
                            ? 'z-50 w-64'
                            : `z-40 ${isCollapsed ? 'w-16' : 'w-48'}`
                    }
                    ${
                        isMobile
                            ? isOpen
                                ? 'translate-x-0'
                                : '-translate-x-full'
                            : 'translate-x-0'
                    }
                `}
            >
                {/* Header with title and collapse/close button */}
                <div className='flex items-center justify-between p-3 border-b border-[#13181D] h-16'>
                    {(isMobile || showText) && (
                        <h2 className='text-white font-semibold text-sm truncate'>
                            {title || 'Loading...'}
                        </h2>
                    )}
                    {isMobile ? (
                        <Button
                            onClick={() => setIsOpen(false)}
                            variant='ghost'
                            iconOnly
                            size='sm'
                            className='flex-shrink-0'
                            aria-label='Close menu'
                        >
                            <X className='w-4 h-4' />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleToggleCollapse}
                            variant='ghost'
                            iconOnly
                            size='sm'
                            className={`flex-shrink-0 ${
                                isCollapsed ? 'mx-auto' : ''
                            }`}
                            aria-label={
                                isCollapsed
                                    ? 'Expand sidebar'
                                    : 'Collapse sidebar'
                            }
                        >
                            {isCollapsed ? (
                                <PanelLeftOpen className='w-4 h-4' />
                            ) : (
                                <PanelLeftClose className='w-4 h-4' />
                            )}
                        </Button>
                    )}
                </div>

                <nav
                    className='flex flex-col gap-1 p-3 overflow-y-auto'
                    style={{ height: 'calc(100vh - 4rem)' }}
                >
                    {items.map((item) => {
                        const active = isActive(item.url);

                        return (
                            <Link
                                key={item.title}
                                href={item.url}
                                title={
                                    isCollapsed && !isMobile ? item.title : ''
                                }
                            >
                                <Button
                                    variant={active ? 'primary' : 'ghost'}
                                    size='md'
                                    fullWidth
                                    className={
                                        isCollapsed && !isMobile
                                            ? 'justify-center'
                                            : 'justify-start'
                                    }
                                    iconOnly={isCollapsed && !isMobile}
                                    iconLeft={
                                        !isCollapsed || isMobile
                                            ? item.icon
                                            : undefined
                                    }
                                >
                                    {isCollapsed && !isMobile ? (
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
        </>
    );
};

export default Sidebar;
