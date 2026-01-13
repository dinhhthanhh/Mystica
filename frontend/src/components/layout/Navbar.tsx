'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, Sparkles, Moon, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';

const navItems = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Tarot', href: '/tarot' },
    { name: 'Tử vi', href: '/astrology' },
    { name: 'Lịch âm', href: '/calendar' },
    { name: 'Cộng đồng', href: '/community' },
    { name: 'MysticaAI', href: '/oracle' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, isAuthenticated } = useAuthStore();
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        setShowUserMenu(false);
    };

    return (
        <nav className={cn(
            'fixed top-0 w-full z-50 transition-all duration-500',
            scrolled ? 'glass py-2 border-b border-mystic-gold/10' : 'bg-transparent py-4'
        )}>
            {/* Background Glow */}
            {scrolled && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-mystic-gold/50 to-transparent shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-1 border border-mystic-gold/20 rounded-full border-dashed"
                            />
                            <Sparkles className="h-8 w-8 text-mystic-gold relative z-10 filter drop-shadow-[0_0_5px_rgba(212,175,55,0.5)] group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-2xl font-mystic font-bold text-gradient tracking-wider">Mystica</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'px-4 py-2 text-sm font-medium transition-all duration-300 relative group',
                                    pathname === item.href ? 'text-mystic-gold' : 'text-foreground/70 hover:text-white'
                                )}
                            >
                                {item.name}
                                {pathname === item.href && (
                                    <motion.div
                                        layoutId="nav-active"
                                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-mystic-gold rounded-full"
                                    />
                                )}
                                <div className="absolute inset-0 bg-mystic-gold/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
                            </Link>
                        ))}

                        <div className="ml-4 pl-4 border-l border-mystic-gold/10">
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center space-x-3 px-3 py-1.5 rounded-full glass border border-mystic-gold/20 hover:border-mystic-gold/50 transition-all cursor-pointer group"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-mystic-purple flex items-center justify-center border border-mystic-gold/30">
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                                            ) : (
                                                <User className="h-4 w-4 text-mystic-gold" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-foreground/90 group-hover:text-mystic-gold transition-colors">
                                            {user?.name || 'Vô danh'}
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {showUserMenu && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    className="absolute right-0 mt-3 w-48 glass border border-mystic-gold/20 rounded-2xl p-2 z-50 shadow-xl"
                                                >
                                                    <Link
                                                        href="/profile"
                                                        className="flex items-center space-x-2 p-3 rounded-xl hover:bg-white/5 transition-colors text-sm"
                                                    >
                                                        <User className="h-4 w-4 text-mystic-gold" />
                                                        <span>Trang cá nhân</span>
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center space-x-2 p-3 rounded-xl hover:bg-red-500/10 transition-colors text-sm text-red-400"
                                                    >
                                                        <X className="h-4 w-4" />
                                                        <span>Đăng xuất</span>
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="relative flex items-center space-x-2 px-6 py-2.5 rounded-full overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-mystic-gold/20 group-hover:bg-mystic-gold/30 transition-colors" />
                                    <div className="absolute inset-0 border border-mystic-gold/30 group-hover:border-mystic-gold/60 transition-colors rounded-full" />
                                    <User className="h-4 w-4 text-mystic-gold relative z-10" />
                                    <span className="text-sm font-bold tracking-wide text-foreground relative z-10">Đăng nhập</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-foreground p-2"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden glass"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        'block px-3 py-2 rounded-md text-base font-medium',
                                        pathname === item.href ? 'text-mystic-gold bg-mystic-purple' : 'text-foreground hover:bg-mystic-purple/50'
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
