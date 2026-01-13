# Mystica - API Documentation

## Base URL
Local Development: `http://localhost:3001/api`

## Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Đăng ký tài khoản |
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Đăng xuất |
| GET | `/auth/me` | Lấy thông tin user hiện tại |

## User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/profile` | Lấy hồ sơ chi tiết |
| PUT | `/users/profile` | Cập nhật hồ sơ |
| GET | `/users/astrology` | Lấy thông tin huyền học |
| GET | `/users/history` | Lấy lịch sử xem bói |

## Tarot
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tarot/decks` | Danh sách bộ bài |
| GET | `/tarot/decks/:slug` | Chi tiết bộ bài |
| POST | `/tarot/readings` | Tạo lượt xem bài mới |
| GET | `/tarot/readings` | Lịch sử xem bài |

## Astrology & Calendar
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/astrology/profile` | Lấy hồ sơ tử vi |
| POST | `/astrology/calculate` | Tính toán tử vi |
| GET | `/calendar/lunar` | Lịch âm |
| GET | `/calendar/day/:date` | Chi tiết ngày |

## AI Chat (Oracle)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat/oracle` | Gửi tin nhắn cho AI |
| GET | `/chat/oracle/history` | Lịch sử chat với AI |

## Community
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | Danh sách bài viết |
| POST | `/posts` | Tạo bài viết |
| POST | `/posts/:id/like` | Like bài viết |
| POST | `/posts/:id/comments` | Thêm bình luận |

## WebSocket Events
- `join_room`: Client → Server
- `leave_room`: Client → Server
- `send_message`: Client → Server
- `new_message`: Server → Client
