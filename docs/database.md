# Mystica - Database Schema

## Collections Overview

| Collection | Description |
|------------|-------------|
| `users` | Thông tin người dùng, hồ sơ huyền học |
| `tarot_decks` | Các bộ bài Tarot |
| `tarot_cards` | 78 lá bài mỗi bộ |
| `tarot_readings` | Lịch sử xem bài |
| `astrology_profiles` | Hồ sơ tử vi chi tiết |
| `fortune_histories` | Lịch sử xem bói tổng hợp |
| `posts` | Bài viết cộng đồng |
| `comments` | Bình luận |
| `chat_rooms` | Phòng chat |
| `messages` | Tin nhắn realtime |

## Detailed Schemas

### User Schema
- `email`: string (unique, indexed)
- `password`: string (hashed)
- `name`: string
- `avatar`: string
- `birthDate`: Date
- `birthTime`: string (HH:mm)
- `birthPlace`: string
- `gender`: enum (male, female, other)
- `calculatedFields`: (zodiac, chineseZodiac, element, destiny, heavenlyStem, earthlyBranch)
- `role`: enum (user, admin)
- `refreshToken`: string

### TarotDeck Schema
- `name`: string
- `slug`: string (unique)
- `description`: string
- `style`: string
- `imagePrefix`: string
- `isActive`: boolean
- `isPremium`: boolean

### TarotCard Schema
- `deckId`: ObjectId (ref: TarotDeck)
- `name`: string
- `nameVi`: string
- `number`: number
- `arcana`: enum (major, minor)
- `suit`: string | null
- `imageUrl`: string
- `keywords`: string[]
- `meaningUpright`: string
- `meaningReversed`: string
- `description`: string
- `advice`: string

### TarotReading Schema
- `userId`: ObjectId (ref: User)
- `deckId`: ObjectId (ref: TarotDeck)
- `spreadType`: enum (1-card, 3-card, celtic-cross)
- `question`: string
- `cards`: array of { cardId, position, isReversed, positionMeaning }
- `aiInterpretation`: string

### AstrologyProfile Schema
- `userId`: ObjectId (ref: User)
- `birthChart`: object (planets, signs)
- `numerology`: object
- `chineseAstrology`: object
- `aiAnalysis`: string

### Community (Posts & Comments)
- `posts`: authorId, title, content, tags, likes, counts
- `comments`: postId, authorId, content, parentId

### Real-time Chat
- `chat_rooms`: type (oracle, community), participants, lastMessage
- `messages`: roomId, senderId, senderType (user, ai), content, metadata
