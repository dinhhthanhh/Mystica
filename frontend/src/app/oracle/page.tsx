'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OraclePage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom on new messages
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        // Load history
        api.get('/chat/oracle/history').then(res => setMessages(res.data));
    }, []);

    const handleSend = async (e?: any) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { senderType: 'user', content: input, createdAt: new Date() };
        setMessages([...messages, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/chat/oracle', { content: input });
            // The backend returns [userMsg, aiMsg]
            setMessages([...messages, ...res.data]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-140px)] flex flex-col">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-mystic font-bold text-gradient flex items-center justify-center">
                    <Sparkles className="mr-2 h-6 w-6" /> Mystica Oracle
                </h1>
                <p className="text-foreground/50 text-sm">Trò chuyện với trí tuệ nhân tạo vạn năng</p>
            </div>

            <Card className="flex-grow overflow-hidden flex flex-col p-0 border-mystic-gold/10">
                {/* Chat area */}
                <div
                    ref={scrollRef}
                    className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth"
                >
                    {messages.length === 0 && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                            <Bot className="h-16 w-16" />
                            <p className="font-mystic italic">"Chào bạn, tôi là Oracle. Bạn muốn khám phá điều gì về vận mệnh hôm nay?"</p>
                        </div>
                    )}

                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={cn(
                                    "flex items-start max-w-[85%] space-x-3",
                                    msg.senderType === 'user' ? "ml-auto flex-row-reverse space-x-reverse" : "mr-auto"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-full glass",
                                    msg.senderType === 'user' ? "bg-mystic-gold text-mystic-dark" : "bg-mystic-purple text-mystic-gold"
                                )}>
                                    {msg.senderType === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                </div>

                                <div className={cn(
                                    "p-4 rounded-2xl text-sm leading-relaxed",
                                    msg.senderType === 'user'
                                        ? "bg-mystic-gold/10 text-foreground border border-mystic-gold/20 rounded-tr-none"
                                        : "glass text-foreground/90 border-mystic-gold/10 rounded-tl-none"
                                )}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <div className="flex items-center space-x-2 text-mystic-gold animate-pulse">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-xs font-medium">Oracle đang suy ngẫm...</span>
                        </div>
                    )}
                </div>

                {/* Input area */}
                <form onSubmit={handleSend} className="p-4 border-t border-mystic-gold/10 flex items-center space-x-4">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Đặt câu hỏi cho Oracle..."
                        className="flex-grow bg-white/5 border border-mystic-gold/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mystic-gold/40 transition-all"
                    />
                    <Button onClick={handleSend} disabled={loading || !input.trim()} className="h-11 w-11 p-0 rounded-xl">
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </Card>
        </div>
    );
}
