221216_TranTanPhat - Hệ thống quản lý món ăn

Thông tin sinh viên
- MSSV: 221216
- Họ tên: Trần Tấn Phát

Đề tài
Xây dựng và triển khai hệ thống quản lý món ăn trên nền tảng đám mây.

Công nghệ sử dụng
- Frontend: React
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Quản lý mã nguồn: Git, GitHub
- Container: Docker, Docker Hub
- Triển khai: Render

Cấu trúc dự án
- `frontend/`: mã nguồn giao diện React
- `backend/`: mã nguồn Backend Node.js/Express
- `README.md`: tài liệu hướng dẫn dự án
- `.gitignore`: cấu hình các file không đưa lên GitHub

Hướng dẫn cài đặt

Backend
```bash
cd backend
npm install
```

 Frontend
```bash
cd frontend
npm install
```

Hướng dẫn chạy chương trình
Hướng dẫn chạy chi tiết sẽ được cập nhật sau khi hoàn thành Backend và Frontend.

Lưu ý bảo mật
Không đưa file `.env`, mật khẩu, access token hoặc chuỗi kết nối MongoDB có thông tin xác thực lên GitHub.

MongoDB Atlas
- Database: `221216_TranTanPhat`
- Collection: `foods`
- Dữ liệu mẫu: 3 món ăn
- Backend sử dụng biến môi trường `MONGODB_URI` để kết nối MongoDB Atlas.
- File `.env` chứa thông tin kết nối thật và không được đưa lên GitHub.