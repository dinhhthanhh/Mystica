export default function Footer() {
    return (
        <footer className="glass border-t border-mystic-gold/10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-xl font-mystic font-bold text-gradient mb-4">Mystica</h3>
                        <p className="text-sm text-foreground/60 leading-relaxed">
                            Khám phá sức mạnh tiềm ẩn và ánh sáng tâm linh qua Tarot, Tử vi và trí tuệ nhân tạo Oracle.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-mystic-gold font-semibold mb-4">Liên kết</h4>
                        <ul className="space-y-2 text-sm text-foreground/60">
                            <li><a href="/about" className="hover:text-mystic-gold transition-colors">Về chúng tôi</a></li>
                            <li><a href="/terms" className="hover:text-mystic-gold transition-colors">Điều khoản dịch vụ</a></li>
                            <li><a href="/privacy" className="hover:text-mystic-gold transition-colors">Chính sách bảo mật</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-mystic-gold font-semibold mb-4">Kết nối</h4>
                        <p className="text-sm text-foreground/60">
                            Nguyễn Đình Thành - 20225670<br />
                            Đồ án tốt nghiệp - HUST
                        </p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-mystic-gold/5 text-center text-xs text-foreground/40">
                    © {new Date().getFullYear()} Mystica. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
