'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Loader2, Trash2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MysticaAIPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/chat/oracle/history');
                setMessages(res.data);
            } catch (err) {
                console.error("Failed to fetch chat history:", err);
            }
        };
        fetchHistory();
    }, []);

    const handleNewChat = async () => {
        if (window.confirm('Bạn có chắc chắn muốn bắt đầu cuộc trò chuyện mới? Lịch sử sẽ bị xóa.')) {
            try {
                await api.delete('/chat/oracle/reset');
                setMessages([]);
            } catch (err) {
                console.error("Failed to reset chat:", err);
                alert("Không thể xóa lịch sử chat. Vui lòng thử lại.");
            }
        }
    };

    const handleSend = async (e?: any) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { senderType: 'user', content: input, createdAt: new Date() };
        setMessages(prev => [...prev, userMsg]);
        const sentInput = input;
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/chat/oracle', { content: sentInput });
            // res.data is expected to be [userMsg, aiMsg] or similar
            // To prevent duplication if backend returns the user message too:
            setMessages(prev => {
                const filtered = prev.filter(m => m !== userMsg);
                return [...filtered, ...res.data];
            });
        } catch (error: any) {
            console.error('Chat error:', error);
            // Show error message as AI response
            const errorMsg = {
                senderType: 'ai',
                content: '🔮 Xin lỗi, đã có lỗi xảy ra khi kết nối với MysticaAI. Vui lòng thử lại sau.\n\n⚠️ ' + (error.response?.data?.message || 'Lỗi kết nối server'),
                createdAt: new Date(),
                isError: true,
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-140px)] flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8 space-y-2"
            >
                <h1 className="text-4xl font-mystic font-bold text-gradient flex items-center justify-center gap-3">
                    <Sparkles className="h-8 w-8 text-mystic-gold animate-pulse" /> MysticaAI
                </h1>
                <p className="text-foreground/60 text-sm tracking-widest uppercase">Trí tuệ nhân tạo vạn năng</p>
            </motion.div>

            <Card className="flex-grow overflow-hidden flex flex-col p-0 border-mystic-gold/10 glass relative" glow>
                {/* Visual Flair */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mystic-gold/20 to-transparent z-30" />

                {/* Toolbar */}
                <div className="p-3 border-b border-mystic-gold/10 flex justify-end bg-white/5 backdrop-blur-md relative z-20">
                    <button
                        onClick={handleNewChat}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mystic text-mystic-gold hover:bg-mystic-gold/10 transition-colors border border-mystic-gold/20 shadow-inner"
                    >
                        <PlusCircle size={14} />
                        Cuộc trò chuyện mới
                    </button>
                </div>
                <div
                    ref={scrollRef}
                    className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-mystic-gold/20"
                >
                    {messages.length === 0 && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                            <div className="relative">
                                <Bot className="h-20 w-20 text-mystic-gold" />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute -inset-4 bg-mystic-gold/10 rounded-full blur-2xl -z-10"
                                />
                            </div>
                            <p className="font-mystic italic text-xl max-w-md">
                                "Chào bạn, tôi là MysticaAI. Hãy sẻ chia những trăn trở của bạn, tôi sẽ giúp bạn soi sáng con đường phía trước."
                            </p>
                        </div>
                    )}

                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={cn(
                                    "flex items-start max-w-[85%] gap-4",
                                    msg.senderType === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <div className={cn(
                                    "h-10 w-10 flex-shrink-0 rounded-full glass flex items-center justify-center border transition-transform hover:scale-110",
                                    msg.senderType === 'user'
                                        ? "bg-mystic-gold/20 border-mystic-gold/40 text-mystic-gold"
                                        : "bg-mystic-purple/20 border-mystic-gold/20 text-mystic-gold"
                                )}>
                                    {msg.senderType === 'user' ? <User size={20} /> : <Sparkles size={20} />}
                                </div>

                                <div className={cn(
                                    "p-4 rounded-2xl text-[15px] leading-relaxed relative group custom-glow",
                                    msg.senderType === 'user'
                                        ? "bg-mystic-gold/10 text-foreground border border-mystic-gold/20 rounded-tr-none"
                                        : "glass text-foreground/90 border border-mystic-gold/10 rounded-tl-none"
                                )}>
                                    {msg.content}
                                    <div className="absolute top-full mt-1 text-[10px] opacity-0 group-hover:opacity-40 transition-opacity">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3 text-mystic-gold"
                        >
                            <div className="flex gap-1">
                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="h-2 w-2 bg-mystic-gold rounded-full" />
                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="h-2 w-2 bg-mystic-gold rounded-full" />
                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="h-2 w-2 bg-mystic-gold rounded-full" />
                            </div>
                            <span className="text-xs font-medium italic">MysticaAI đang khai mở trí tuệ...</span>
                        </motion.div>
                    )}
                </div>

                <form onSubmit={handleSend} className="p-6 border-t border-mystic-gold/10 bg-white/5 backdrop-blur-xl relative z-20">
                    <div className="relative flex items-center gap-3">
                        <div className="flex-grow relative group">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Hãy đặt câu hỏi cho số mệnh của bạn..."
                                className="w-full bg-mystic-dark/50 border border-mystic-gold/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-mystic-gold/40 focus:ring-1 focus:ring-mystic-gold/20 transition-all placeholder:italic placeholder:opacity-40"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none group-focus-within:opacity-0 transition-opacity">
                                <Sparkles size={16} />
                            </div>
                        </div>
                        <Button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="h-14 px-6 rounded-2xl bg-gradient-to-br from-mystic-gold to-mystic-gold/80 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                        >
                            <Send size={20} className="text-mystic-dark" />
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

