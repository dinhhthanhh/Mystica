'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, User, Clock, Search, Plus, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/posts').then(res => setPosts(res.data)).finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-mystic font-bold mb-2">Cộng Đồng Mystica</h1>
                    <p className="text-foreground/60">Gặp gỡ và chia sẻ kinh nghiệm tâm linh.</p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40 group-focus-within:text-mystic-gold transition-colors" />
                        <input
                            placeholder="Tìm kiếm bài viết..."
                            className="glass pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none border-mystic-gold/10 focus:border-mystic-gold/40 w-full md:w-64"
                        />
                    </div>
                    <Button className="rounded-full h-10 px-6">
                        <Plus className="h-4 w-4 mr-2" /> Đăng bài
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Posts List */}
                <div className="lg:col-span-3 space-y-6">
                    {loading ? (
                        <div className="animate-pulse space-y-6">
                            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white/5 rounded-2xl" />)}
                        </div>
                    ) : (
                        posts.map((post) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Link href={`/community/post/${post._id}`}>
                                    <Card className="hover:bg-mystic-purple/10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 rounded-full glass border border-mystic-gold/20 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-mystic-gold" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">{post.authorId?.name || 'Vô danh'}</p>
                                                    <div className="flex items-center text-[10px] text-foreground/40 space-x-2">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-1">
                                                {post.tags?.map((tag: string, i: number) => (
                                                    <span key={i} className="text-[10px] bg-mystic-gold/10 text-mystic-gold px-2 py-0.5 rounded border border-mystic-gold/10">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-mystic font-bold mb-3 group-hover:text-mystic-gold transition-colors">{post.title}</h3>
                                        <p className="text-sm text-foreground/60 line-clamp-3 mb-6">{post.content}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-mystic-gold/5">
                                            <div className="flex items-center space-x-6">
                                                <button className="flex items-center space-x-2 text-xs text-foreground/40 hover:text-mystic-gold transition-colors">
                                                    <ThumbsUp className="h-4 w-4" />
                                                    <span>{post.likesCount || 0}</span>
                                                </button>
                                                <button className="flex items-center space-x-2 text-xs text-foreground/40 hover:text-mystic-gold transition-colors">
                                                    <MessageSquare className="h-4 w-4" />
                                                    <span>{post.commentsCount || 0}</span>
                                                </button>
                                                <button className="flex items-center space-x-2 text-xs text-foreground/40 hover:text-mystic-gold transition-colors">
                                                    <Share2 className="h-4 w-4" />
                                                    <span>{post.sharesCount || 0}</span>
                                                </button>
                                            </div>
                                            <button className="p-2 text-foreground/40 hover:text-mystic-gold transition-colors">
                                                <Bookmark className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Sidebar */}
                <div className="hidden lg:block space-y-6">
                    <Card className="bg-mystic-purple/20">
                        <h4 className="font-mystic font-bold text-mystic-gold mb-4 uppercase tracking-widest text-xs">Chủ đề hot</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Tarot', 'TuVi2026', 'ThienCan', 'CungHoangDao', 'TâmLinh'].map(tag => (
                                <span key={tag} className="text-xs text-foreground/60 hover:text-mystic-gold cursor-pointer transition-colors">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h4 className="font-mystic font-bold text-mystic-gold mb-4 uppercase tracking-widest text-xs">Phù thủy kỳ cựu</h4>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-full glass border border-mystic-gold/10 flex items-center justify-center">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs text-foreground/60">Phù thủy bậc {i}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
