import Hero from '@/components/shared/Hero';
import Card from '@/components/ui/Card';
import { BookOpen, Calendar, MessageSquare, Star } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'Tarot Trực Tuyến',
    description: 'Rút bài và nhận diễn giải từ AI Oracle dựa trên các bộ bài nổi tiếng.',
    icon: BookOpen,
    href: '/tarot',
  },
  {
    title: 'Tử Vi & Cung Mệnh',
    description: 'Khám phá bản đồ sao, thiên can địa chi và lời khuyên theo bản mệnh.',
    icon: Star,
    href: '/astrology',
  },
  {
    title: 'Lịch Vạn Niên',
    description: 'Xem ngày tốt xấu, giờ hoàng đạo và các công việc nên làm.',
    icon: Calendar,
    href: '/calendar',
  },
  {
    title: 'Cộng Đồng Mystica',
    description: 'Chia sẻ kiến thức, trải nghiệm và kết nối với những tâm hồn đồng điệu.',
    icon: MessageSquare,
    href: '/community',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      <Hero />

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-mystic font-bold mb-4">Dịch Vụ Của Chúng Tôi</h2>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Mang đến sự kết hợp hoàn hảo giữa tâm linh học cổ điển và công nghệ hiện đại.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href}>
              <Card className="h-full flex flex-col items-center text-center hover:bg-mystic-purple/20">
                <div className="p-4 rounded-2xl bg-mystic-gold/10 mb-6">
                  <feature.icon className="h-8 w-8 text-mystic-gold" />
                </div>
                <h3 className="text-xl font-mystic font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative py-32 bg-mystic-purple/30 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {/* Add some mystical background patterns here */}
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <span className="text-mystic-gold text-5xl font-mystic">"</span>
          <p className="text-2xl md:text-3xl font-mystic italic text-foreground/90 mb-6">
            Vũ trụ không ở bên ngoài bạn. Hãy nhìn vào bên trong chính mình; mọi thứ bạn muốn, bạn đều đã là nó rồi.
          </p>
          <p className="text-mystic-gold font-medium">— Rumi</p>
        </div>
      </section>
    </div>
  );
}
