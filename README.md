# 🌙 Mystica - Nền tảng Huyền học trực tuyến

Mystica là một nền tảng full-stack hiện đại dành cho việc khám phá thế giới huyền học, bao gồm Tarot, Tử vi, Lịch vạn niên và trí tuệ nhân tạo Oracle. Được thiết kế như một đồ án tốt nghiệp chuyên nghiệp, dự án tập trung vào trải nghiệm người dùng cao cấp và tính ứng dụng thực tế.

## 🚀 Tính năng chính

- **Tarot Module**: Rút bài với hiệu ứng 3D, hỗ trợ nhiều bộ bài và diễn giải chuyên sâu từ AI.
- **Astrology Profile**: Tự động tính toán cung hoàng đạo, ngũ hành, thiên can địa chi từ ngày sinh.
- **Lịch Vạn Niên**: Xem ngày tốt/xấu, giờ hoàng đạo và các lời khuyên phong thủy hàng ngày.
- **Mystica Oracle**: Trò chuyện trực tiếp với AI chuyên gia huyền học (Gemini Pro).
- **Cộng đồng**: Diễn đàn chia sẻ kiến thức, thảo luận và kết nối.
- **Hệ thống Quản trị**: Theo dõi số liệu và quản lý người dùng chuyên sâu.

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 15, Tailwind CSS 4, Framer Motion, Axios, Zustand.
- **Backend**: NestJS, Mongoose, WebSockets (Socket.IO), JWT Auth.
- **Database**: MongoDB.
- **AI**: Google Gemini Pro API.
- **DevOps**: Docker, Docker Compose.

## 📦 Hướng dẫn cài đặt

### 1. Chuẩn bị
- Đã cài đặt Docker và Docker Compose.
- Có API Key của Google Gemini.

### 2. Cấu hình
Tạo file `.env` tại thư mục `backend/` dựa trên `.env.example`.
- Thay `MONGODB_URI` bằng chuỗi kết nối Atlas của bạn.
- Thay `GEMINI_API_KEY` bằng key từ Google AI Studio.
- Đảm bảo thay `<db_password>` bằng mật khẩu đúng của database user.

### 3. Chạy ứng dụng
```bash
docker-compose up --build
```

Ứng dụng sẽ khả dụng tại:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001`
- **API Docs**: `http://localhost:3001/api/docs`

## ☁️ Cấu hình Cloud Database (MongoDB Atlas)
Để sử dụng database trên Cloud thay vì chạy local trong Docker:
1. Đăng ký tài khoản tại [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Tạo một Cluster miễn phí (gói M0).
3. Thiết lập **Database User** và **Network Access** (Allow Access from Anywhere hoặc IP cá nhân).
4. Lấy chuỗi kết nối và cập nhật vào `backend/.env`.

## 📂 Cấu trúc thư mục
- `backend/`: NestJS API và logic xử lý chính.
- `frontend/`: Giao diện người dùng Next.js.
- `docs/`: Tài liệu kiến trúc, database và API.

---
**Tác giả**: Nguyễn Đình Thành - 20225670 - HUST
