/**
 * Seed script for Tarot cards data
 * Run with: npx ts-node scripts/seed-tarot.ts
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Rider-Waite-Smith Tarot deck images from Wikipedia (Public Domain)
const RWS_BASE_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb';

const MAJOR_ARCANA = [
    { number: 0, name: 'The Fool', nameVi: 'Kẻ Khờ', image: '/6/60/RWS_Tarot_00_Fool.jpg/150px-RWS_Tarot_00_Fool.jpg', keywords: ['khởi đầu mới', 'ngây thơ', 'mạo hiểm'], meaningUpright: 'Khởi đầu mới, sự ngây thơ, tinh thần tự do', meaningReversed: 'Bất cẩn, liều lĩnh, thiếu kinh nghiệm' },
    { number: 1, name: 'The Magician', nameVi: 'Nhà Ảo Thuật', image: '/d/de/RWS_Tarot_01_Magician.jpg/150px-RWS_Tarot_01_Magician.jpg', keywords: ['sáng tạo', 'ý chí', 'kỹ năng'], meaningUpright: 'Ý chí mạnh mẽ, sáng tạo, khả năng biến ước mơ thành hiện thực', meaningReversed: 'Thao túng, lừa dối, thiếu tập trung' },
    { number: 2, name: 'The High Priestess', nameVi: 'Nữ Tế Sư', image: '/8/88/RWS_Tarot_02_High_Priestess.jpg/150px-RWS_Tarot_02_High_Priestess.jpg', keywords: ['trực giác', 'bí ẩn', 'tiềm thức'], meaningUpright: 'Trực giác, bí ẩn, sự thông thái tiềm ẩn', meaningReversed: 'Bí mật bị tiết lộ, mất kết nối nội tâm' },
    { number: 3, name: 'The Empress', nameVi: 'Hoàng Hậu', image: '/d/d2/RWS_Tarot_03_Empress.jpg/150px-RWS_Tarot_03_Empress.jpg', keywords: ['sinh sản', 'nuôi dưỡng', 'thiên nhiên'], meaningUpright: 'Sinh sản, phong phú, nuôi dưỡng', meaningReversed: 'Phụ thuộc, trống rỗng sáng tạo' },
    { number: 4, name: 'The Emperor', nameVi: 'Hoàng Đế', image: '/c/c3/RWS_Tarot_04_Emperor.jpg/150px-RWS_Tarot_04_Emperor.jpg', keywords: ['quyền lực', 'ổn định', 'lãnh đạo'], meaningUpright: 'Quyền lực, cấu trúc, lãnh đạo', meaningReversed: 'Độc tài, cứng nhắc, mất kiểm soát' },
    { number: 5, name: 'The Hierophant', nameVi: 'Giáo Hoàng', image: '/8/8d/RWS_Tarot_05_Hierophant.jpg/150px-RWS_Tarot_05_Hierophant.jpg', keywords: ['truyền thống', 'tâm linh', 'giáo dục'], meaningUpright: 'Truyền thống, sự hướng dẫn tâm linh', meaningReversed: 'Nổi loạn, bất đồng với truyền thống' },
    { number: 6, name: 'The Lovers', nameVi: 'Đôi Tình Nhân', image: '/3/3a/RWS_Tarot_06_Lovers.jpg/150px-RWS_Tarot_06_Lovers.jpg', keywords: ['tình yêu', 'lựa chọn', 'hòa hợp'], meaningUpright: 'Tình yêu, sự hòa hợp, lựa chọn quan trọng', meaningReversed: 'Mất cân bằng, lựa chọn sai lầm' },
    { number: 7, name: 'The Chariot', nameVi: 'Cỗ Xe', image: '/9/9b/RWS_Tarot_07_Chariot.jpg/150px-RWS_Tarot_07_Chariot.jpg', keywords: ['chiến thắng', 'quyết tâm', 'ý chí'], meaningUpright: 'Chiến thắng, quyết tâm, kiểm soát', meaningReversed: 'Mất phương hướng, hung hăng' },
    { number: 8, name: 'Strength', nameVi: 'Sức Mạnh', image: '/f/f5/RWS_Tarot_08_Strength.jpg/150px-RWS_Tarot_08_Strength.jpg', keywords: ['dũng cảm', 'kiên nhẫn', 'sức mạnh nội tâm'], meaningUpright: 'Sức mạnh, lòng dũng cảm, kiên nhẫn', meaningReversed: 'Tự nghi ngờ, yếu đuối' },
    { number: 9, name: 'The Hermit', nameVi: 'Ẩn Sĩ', image: '/4/4d/RWS_Tarot_09_Hermit.jpg/150px-RWS_Tarot_09_Hermit.jpg', keywords: ['cô độc', 'suy ngẫm', 'tìm kiếm'], meaningUpright: 'Nội tâm hóa, tìm kiếm sự thật', meaningReversed: 'Cô lập, cô đơn' },
    { number: 10, name: 'Wheel of Fortune', nameVi: 'Bánh Xe Vận Mệnh', image: '/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg/150px-RWS_Tarot_10_Wheel_of_Fortune.jpg', keywords: ['vận may', 'chu kỳ', 'số mệnh'], meaningUpright: 'May mắn, vận mệnh đang chuyển', meaningReversed: 'Xui xẻo, kháng cự thay đổi' },
    { number: 11, name: 'Justice', nameVi: 'Công Lý', image: '/e/e0/RWS_Tarot_11_Justice.jpg/150px-RWS_Tarot_11_Justice.jpg', keywords: ['công bằng', 'sự thật', 'luật pháp'], meaningUpright: 'Công lý, sự thật, cân bằng', meaningReversed: 'Bất công, thiếu trách nhiệm' },
    { number: 12, name: 'The Hanged Man', nameVi: 'Người Bị Treo', image: '/2/2b/RWS_Tarot_12_Hanged_Man.jpg/150px-RWS_Tarot_12_Hanged_Man.jpg', keywords: ['hy sinh', 'buông bỏ', 'góc nhìn mới'], meaningUpright: 'Hy sinh, buông bỏ, góc nhìn mới', meaningReversed: 'Trì hoãn, kháng cự' },
    { number: 13, name: 'Death', nameVi: 'Cái Chết', image: '/d/d7/RWS_Tarot_13_Death.jpg/150px-RWS_Tarot_13_Death.jpg', keywords: ['kết thúc', 'chuyển đổi', 'tái sinh'], meaningUpright: 'Kết thúc, chuyển đổi, tái sinh', meaningReversed: 'Kháng cự thay đổi, bám víu' },
    { number: 14, name: 'Temperance', nameVi: 'Tiết Chế', image: '/f/f8/RWS_Tarot_14_Temperance.jpg/150px-RWS_Tarot_14_Temperance.jpg', keywords: ['cân bằng', 'điều độ', 'kiên nhẫn'], meaningUpright: 'Cân bằng, điều độ, kiên nhẫn', meaningReversed: 'Mất cân bằng, thái quá' },
    { number: 15, name: 'The Devil', nameVi: 'Ác Quỷ', image: '/5/55/RWS_Tarot_15_Devil.jpg/150px-RWS_Tarot_15_Devil.jpg', keywords: ['cám dỗ', 'ràng buộc', 'nghiện ngập'], meaningUpright: 'Ràng buộc, nghiện ngập, chủ nghĩa vật chất', meaningReversed: 'Giải phóng, đột phá' },
    { number: 16, name: 'The Tower', nameVi: 'Tháp', image: '/5/53/RWS_Tarot_16_Tower.jpg/150px-RWS_Tarot_16_Tower.jpg', keywords: ['sụp đổ', 'thay đổi đột ngột', 'giải phóng'], meaningUpright: 'Thay đổi đột ngột, sụp đổ, khải ngộ', meaningReversed: 'Trì hoãn thảm họa, sợ thay đổi' },
    { number: 17, name: 'The Star', nameVi: 'Ngôi Sao', image: '/d/db/RWS_Tarot_17_Star.jpg/150px-RWS_Tarot_17_Star.jpg', keywords: ['hy vọng', 'cảm hứng', 'bình yên'], meaningUpright: 'Hy vọng, cảm hứng, bình yên', meaningReversed: 'Thất vọng, mất niềm tin' },
    { number: 18, name: 'The Moon', nameVi: 'Mặt Trăng', image: '/7/7f/RWS_Tarot_18_Moon.jpg/150px-RWS_Tarot_18_Moon.jpg', keywords: ['ảo giác', 'sợ hãi', 'tiềm thức'], meaningUpright: 'Ảo giác, lo sợ, tiềm thức', meaningReversed: 'Giải thoát khỏi sợ hãi, rõ ràng' },
    { number: 19, name: 'The Sun', nameVi: 'Mặt Trời', image: '/1/17/RWS_Tarot_19_Sun.jpg/150px-RWS_Tarot_19_Sun.jpg', keywords: ['niềm vui', 'thành công', 'sức sống'], meaningUpright: 'Hạnh phúc, thành công, sức sống', meaningReversed: 'Tạm thời u ám' },
    { number: 20, name: 'Judgement', nameVi: 'Phán Xét', image: '/d/dd/RWS_Tarot_20_Judgement.jpg/150px-RWS_Tarot_20_Judgement.jpg', keywords: ['phán xét', 'tái sinh', 'giác ngộ'], meaningUpright: 'Phán xét, tái sinh, giác ngộ', meaningReversed: 'Tự phê phán, nghi ngờ' },
    { number: 21, name: 'The World', nameVi: 'Thế Giới', image: '/f/ff/RWS_Tarot_21_World.jpg/150px-RWS_Tarot_21_World.jpg', keywords: ['hoàn thành', 'tích hợp', 'thành tựu'], meaningUpright: 'Hoàn thành, tích hợp, thành tựu', meaningReversed: 'Chưa hoàn thành, trì hoãn' },
];

const MINOR_ARCANA_SUITS = [
    { suit: 'Wands', suitVi: 'Gậy', path: 'Wands' },
    { suit: 'Cups', suitVi: 'Ly', path: 'Cups' },
    { suit: 'Swords', suitVi: 'Kiếm', path: 'Swords' },
    { suit: 'Pentacles', suitVi: 'Tiền', path: 'Pentacles' },
];

const MINOR_CARDS = [
    { num: 1, name: 'Ace', nameVi: 'Ách' },
    { num: 2, name: 'Two', nameVi: 'Hai' },
    { num: 3, name: 'Three', nameVi: 'Ba' },
    { num: 4, name: 'Four', nameVi: 'Bốn' },
    { num: 5, name: 'Five', nameVi: 'Năm' },
    { num: 6, name: 'Six', nameVi: 'Sáu' },
    { num: 7, name: 'Seven', nameVi: 'Bảy' },
    { num: 8, name: 'Eight', nameVi: 'Tám' },
    { num: 9, name: 'Nine', nameVi: 'Chín' },
    { num: 10, name: 'Ten', nameVi: 'Mười' },
    { num: 11, name: 'Page', nameVi: 'Hiệp Sĩ Trẻ' },
    { num: 12, name: 'Knight', nameVi: 'Kỵ Sĩ' },
    { num: 13, name: 'Queen', nameVi: 'Hoàng Hậu' },
    { num: 14, name: 'King', nameVi: 'Nhà Vua' },
];

// Image URL patterns for minor arcana
function getMinorArcanaImageUrl(suit: string, cardName: string): string {
    const suitLower = suit.toLowerCase();
    const cardNameFormatted = cardName.replace(' ', '_');
    // These are approximate paths - the actual Wikipedia paths vary slightly
    return `${RWS_BASE_URL}/${suitLower.charAt(0)}/${suitLower.charAt(0)}${cardNameFormatted.charAt(0)}/RWS_Tarot_${cardNameFormatted.replace('_', '%20')}of${suit}.jpg/150px-RWS_Tarot_${cardNameFormatted.replace('_', '%20')}of${suit}.jpg`;
}

async function seedTarot() {
    console.log('🔮 Starting Tarot seed...');

    const app = await NestFactory.createApplicationContext(AppModule);

    const DeckModel = app.get(getModelToken('TarotDeck'));
    const CardModel = app.get(getModelToken('TarotCard'));

    // Clear existing data
    await DeckModel.deleteMany({});
    await CardModel.deleteMany({});
    console.log('🗑️ Cleared existing Tarot data');

    // Create Rider-Waite-Smith deck
    const deck = await DeckModel.create({
        name: 'Rider-Waite-Smith Tarot',
        slug: 'rider-waite-smith',
        description: 'Bộ bài Tarot cổ điển được thiết kế bởi Pamela Colman Smith theo hướng dẫn của Arthur Edward Waite. Đây là bộ bài Tarot phổ biến nhất trên thế giới.',
        style: 'Classical',
        isActive: true,
        isPremium: false,
        thumbnailUrl: `${RWS_BASE_URL}/6/60/RWS_Tarot_00_Fool.jpg/300px-RWS_Tarot_00_Fool.jpg`,
    });
    console.log('📦 Created Rider-Waite-Smith deck');

    // Create Major Arcana cards
    for (const card of MAJOR_ARCANA) {
        await CardModel.create({
            deckId: deck._id,
            name: card.name,
            nameVi: card.nameVi,
            number: card.number,
            arcana: 'major',
            suit: null,
            imageUrl: `${RWS_BASE_URL}${card.image}`,
            keywords: card.keywords,
            meaningUpright: card.meaningUpright,
            meaningReversed: card.meaningReversed,
            description: `Lá bài số ${card.number} trong bộ Ẩn Chính (Major Arcana)`,
        });
    }
    console.log('✨ Created 22 Major Arcana cards');

    // Create Minor Arcana cards
    let minorCount = 0;
    for (const suit of MINOR_ARCANA_SUITS) {
        for (const card of MINOR_CARDS) {
            const cardNumber = 22 + (MINOR_ARCANA_SUITS.indexOf(suit) * 14) + card.num;
            await CardModel.create({
                deckId: deck._id,
                name: `${card.name} of ${suit.suit}`,
                nameVi: `${card.nameVi} ${suit.suitVi}`,
                number: cardNumber,
                arcana: 'minor',
                suit: suit.suit,
                imageUrl: `${RWS_BASE_URL}/a/a${card.num}/RWS_Tarot_${suit.path}${String(card.num).padStart(2, '0')}.jpg/150px-RWS_Tarot_${suit.path}${String(card.num).padStart(2, '0')}.jpg`,
                keywords: [],
                meaningUpright: `Ý nghĩa xuôi của ${card.nameVi} ${suit.suitVi}`,
                meaningReversed: `Ý nghĩa ngược của ${card.nameVi} ${suit.suitVi}`,
                description: `Lá bài ${card.nameVi} trong bộ ${suit.suitVi}`,
            });
            minorCount++;
        }
    }
    console.log(`📜 Created ${minorCount} Minor Arcana cards`);

    console.log('✅ Tarot seed completed! Total: 1 deck, 78 cards');

    await app.close();
    process.exit(0);
}

seedTarot().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
