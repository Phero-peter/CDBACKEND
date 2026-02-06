# Hướng dẫn Deploy lại trên Vercel

## Bước 1: Kiểm tra code đã sửa lỗi

Đảm bảo bạn đã commit tất cả các thay đổi:
- ✅ Đã sửa lỗi TypeScript trong `AdminCarsList.tsx`
- ✅ Đã sửa lỗi TypeScript trong `app/admin/page.tsx`
- ✅ Đã tối ưu hóa các API routes

## Bước 2: Commit và Push code lên GitHub

### 2.1. Kiểm tra trạng thái Git
```bash
git status
```

### 2.2. Thêm tất cả các file đã thay đổi
```bash
git add .
```

### 2.3. Commit với message mô tả
```bash
git commit -m "Fix TypeScript errors: Convert ObjectId to string for comparisons"
```

### 2.4. Push lên GitHub
```bash
git push origin main
```

**Lưu ý:** Nếu bạn đang ở branch khác (không phải `main`), thay `main` bằng tên branch của bạn.

## Bước 3: Deploy trên Vercel

### Cách 1: Tự động deploy (Nếu đã kết nối GitHub)

1. **Vercel tự động deploy:**
   - Vào [vercel.com](https://vercel.com)
   - Đăng nhập vào tài khoản của bạn
   - Vercel sẽ tự động phát hiện push mới và bắt đầu build
   - Chờ build hoàn tất (thường 2-5 phút)

2. **Kiểm tra build logs:**
   - Click vào project của bạn trên Vercel dashboard
   - Click vào tab "Deployments"
   - Click vào deployment mới nhất
   - Xem logs để đảm bảo build thành công

### Cách 2: Deploy thủ công qua Vercel CLI

1. **Cài đặt Vercel CLI (nếu chưa có):**
```bash
npm install -g vercel
```

2. **Đăng nhập Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel --prod
```

## Bước 4: Kiểm tra Environment Variables

Đảm bảo các biến môi trường đã được cấu hình trên Vercel:

1. Vào Vercel Dashboard → Project → Settings → Environment Variables
2. Kiểm tra các biến sau đã được thêm:
   - `MONGODB_URI` - Connection string MongoDB
   - `NEXTAUTH_URL` - URL của website (ví dụ: https://your-domain.vercel.app)
   - `NEXTAUTH_SECRET` - Secret key cho NextAuth
   - `GOOGLE_CLIENT_ID` - (nếu dùng Google OAuth)
   - `GOOGLE_CLIENT_SECRET` - (nếu dùng Google OAuth)
   - `EMAIL_SERVER_HOST` - (nếu dùng email)
   - `EMAIL_SERVER_PORT` - (nếu dùng email)
   - `EMAIL_SERVER_USER` - (nếu dùng email)
   - `EMAIL_SERVER_PASSWORD` - (nếu dùng email)

3. Nếu thiếu biến nào, thêm vào và **redeploy** lại.

## Bước 5: Kiểm tra Build thành công

Sau khi deploy xong:

1. **Kiểm tra build logs:**
   - Nếu thấy "✓ Compiled successfully" → Build thành công ✅
   - Nếu có lỗi → Xem chi tiết và sửa

2. **Kiểm tra website:**
   - Truy cập URL được cung cấp bởi Vercel
   - Test các chức năng chính:
     - Đăng nhập/Đăng ký
     - Xem danh sách xe
     - Admin dashboard
     - CRUD operations

## Troubleshooting

### Lỗi Build thất bại:

1. **Lỗi TypeScript:**
   - Chạy `npm run build` local để kiểm tra trước
   - Sửa tất cả lỗi TypeScript trước khi push

2. **Lỗi Environment Variables:**
   - Kiểm tra tất cả biến môi trường đã được thêm trên Vercel
   - Đảm bảo không có typo trong tên biến

3. **Lỗi MongoDB Connection (TopologyDescription type: 'Unknown', localhost:27017):**
   - **Nguyên nhân:** Ứng dụng không kết nối được tới MongoDB.
   - **Chạy local:** Nếu dùng `mongodb://localhost:27017/...`:
     - Cài và **khởi động MongoDB** trên máy (ví dụ: chạy `mongod` hoặc start service MongoDB).
     - Hoặc chuyển sang **MongoDB Atlas** (miễn phí): tạo cluster → lấy connection string → gán vào `MONGODB_URI` trong `.env.local`.
   - **Chạy trên Vercel:** Không dùng `localhost`. Bắt buộc dùng **MongoDB Atlas** (hoặc MongoDB host có thể truy cập từ internet), thêm `MONGODB_URI` vào Vercel → Settings → Environment Variables, và trên Atlas mở Network Access → Add IP Address → Allow access from anywhere (0.0.0.0/0).
   - Kiểm tra `MONGODB_URI` đúng format (ví dụ: `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority`).
   - Đảm bảo MongoDB Atlas cho phép kết nối từ mọi IP (0.0.0.0/0) nếu deploy Vercel.

4. **Lỗi NextAuth:**
   - Kiểm tra `NEXTAUTH_URL` đúng với domain Vercel
   - Kiểm tra `NEXTAUTH_SECRET` đã được set

### Lệnh hữu ích:

```bash
# Build local để test trước
npm run build

# Kiểm tra lỗi TypeScript
npx tsc --noEmit

# Kiểm tra lỗi ESLint
npm run lint

# Xem logs Vercel
vercel logs
```

## Checklist trước khi Deploy:

- [ ] Đã sửa tất cả lỗi TypeScript
- [ ] Đã test build local thành công (`npm run build`)
- [ ] Đã commit và push code lên GitHub
- [ ] Đã kiểm tra Environment Variables trên Vercel
- [ ] Đã kiểm tra MongoDB connection string
- [ ] Đã kiểm tra NextAuth configuration

## Sau khi Deploy:

- [ ] Kiểm tra website hoạt động bình thường
- [ ] Test đăng nhập/đăng ký
- [ ] Test admin dashboard
- [ ] Test CRUD operations
- [ ] Kiểm tra console không có lỗi

---

**Chúc bạn deploy thành công! 🚀**
