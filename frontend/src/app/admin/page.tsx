'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Users, FileText, Layout, Settings, ShieldAlert, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPage() {
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/admin/stats'),
            api.get('/admin/users')
        ]).then(([statsRes, usersRes]) => {
            setStats(statsRes.data);
            setUsers(usersRes.data);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-12 text-center text-mystic-gold">Đang truy cập hệ thống quản trị...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-mystic font-bold">Quản Trị Hệ Thống</h1>
                    <p className="text-foreground/50 text-sm">Tổng quan hoạt động và quản lý người dùng</p>
                </div>
                <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-full border border-red-400/20">
                    <ShieldAlert className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Admin Access</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                    { label: 'Người dùng', value: stats.users, icon: Users, color: 'text-blue-400' },
                    { label: 'Bài viết', value: stats.posts, icon: FileText, color: 'text-mystic-gold' },
                    { label: 'Bộ bài Tarot', value: stats.decks, icon: Layout, color: 'text-mystic-accent' },
                ].map((item, i) => (
                    <Card key={i} className="flex items-center space-x-6">
                        <div className={cn("p-4 rounded-2xl bg-white/5", item.color)}>
                            <item.icon className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-foreground/40 mb-1">{item.label}</p>
                            <p className="text-3xl font-mystic font-bold">{item.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Users Table */}
                <Card className="lg:col-span-2 overflow-hidden overflow-x-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-mystic font-bold">Người dùng mới</h3>
                        <Settings className="h-4 w-4 text-foreground/40 cursor-pointer hover:text-mystic-gold transition-colors" />
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-mystic-gold/10">
                                <th className="pb-4 font-medium text-foreground/40">Tên</th>
                                <th className="pb-4 font-medium text-foreground/40">Email</th>
                                <th className="pb-4 font-medium text-foreground/40">Vai trò</th>
                                <th className="pb-4 font-medium text-foreground/40 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-mystic-gold/5">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                    <td className="py-4 font-medium">{user.name}</td>
                                    <td className="py-4 text-foreground/60">{user.email}</td>
                                    <td className="py-4">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                            user.role === 'admin' ? "bg-red-400/10 text-red-400" : "bg-blue-400/10 text-blue-400"
                                        )}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button className="text-mystic-gold hover:underline text-xs">Chỉnh sửa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                {/* System Health */}
                <Card className="flex flex-col">
                    <h3 className="text-xl font-mystic font-bold mb-6">Hoạt động hệ thống</h3>
                    <div className="flex-grow space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-start space-x-3">
                                <div className="h-2 w-2 rounded-full bg-mystic-gold mt-1.5" />
                                <div>
                                    <p className="text-sm font-medium">Báo cáo Tarot mới</p>
                                    <p className="text-[10px] text-foreground/40">Vừa xong • Người dùng #{i * 123}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-mystic-gold/10">
                        <div className="flex items-center justify-between text-xs text-foreground/40 mb-2">
                            <span>CPU Usage</span>
                            <span>12%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-mystic-gold w-[12%]" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
