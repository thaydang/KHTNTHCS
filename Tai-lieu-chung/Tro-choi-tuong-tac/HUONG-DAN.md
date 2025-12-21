# Hướng dẫn Sử dụng Trò Chơi Học Tập KHTN

## Cách mở ứng dụng

### Phương pháp 1: Mở trực tiếp từ trình duyệt
1. Mở thư mục `Tai-lieu-chung/Tro-choi-tuong-tac`
2. Double-click vào file `index.html`
3. Ứng dụng sẽ mở trong trình duyệt mặc định của bạn

### Phương pháp 2: Sử dụng web server (khuyến nghị)
```bash
# Từ thư mục Tro-choi-tuong-tac
python3 -m http.server 8080

# Hoặc với Python 2
python -m SimpleHTTPServer 8080

# Mở trình duyệt và truy cập
http://localhost:8080
```

### Phương pháp 3: Sử dụng VS Code Live Server
1. Cài đặt extension "Live Server" trong VS Code
2. Right-click vào file `index.html`
3. Chọn "Open with Live Server"

## Hướng dẫn chơi từng game

### 1. Trắc nghiệm AI 📝

**Cách chơi:**
1. Nhập tên và chọn lớp của bạn
2. Click vào card "Trắc nghiệm AI"
3. Đọc câu hỏi và chọn đáp án đúng
4. Hệ thống sẽ hiển thị đúng/sai ngay lập tức
5. Click "Câu tiếp theo" để tiếp tục

**Điểm số:**
- Mỗi câu trả lời đúng: +10 điểm
- Tổng điểm tối đa: 100 điểm (10 câu)

**Mẹo:**
- Đọc kỹ câu hỏi trước khi trả lời
- Các câu hỏi được tạo tự động từ AI
- Độ khó phụ thuộc vào lớp học bạn chọn

### 2. Thẻ ghi nhớ 🎴

**Cách chơi:**
1. Click vào thẻ để lật và xem định nghĩa
2. Sau khi xem, đánh giá độ khó:
   - 😓 Khó: Sẽ xem lại sau 1 ngày
   - 😐 Bình thường: Sẽ xem lại sau 3 ngày
   - 😊 Dễ: Sẽ xem lại sau 7 ngày

**Đặc điểm:**
- Áp dụng thuật toán Spaced Repetition
- Thẻ đã thành thạo sẽ không hiển thị lại
- Giúp ghi nhớ lâu dài hiệu quả

### 3. Ghép đôi 🎯

**Cách chơi:**
1. Click vào 2 thẻ để ghép
2. Nếu đúng, 2 thẻ sẽ chuyển sang màu xanh
3. Nếu sai, 2 thẻ sẽ chuyển sang màu đỏ tạm thời
4. Hoàn thành tất cả các cặp để kết thúc

**Điểm số:**
- Mỗi cặp đúng: +10 điểm
- Thưởng thêm điểm nếu hoàn thành nhanh

**Mẹo:**
- Ghi nhớ vị trí các thẻ
- Hoàn thành càng nhanh càng nhiều điểm

### 4. Điền từ ✏️

**Cách chơi:**
1. Đọc câu và điền vào chỗ trống
2. Nếu khó, click "💡 Gợi ý" để xem gợi ý
3. Sau khi điền hết, click "Kiểm tra đáp án"
4. Hệ thống sẽ chấm điểm tự động

**Điểm số:**
- Mỗi câu đúng: +20 điểm
- Câu gần đúng có thể được tính điểm

**Đặc điểm:**
- AI sử dụng thuật toán so sánh văn bản
- Chấp nhận câu trả lời gần đúng (≥80% khớp)

### 5. Thí nghiệm ảo 🔬

**Cách chơi:**
1. Đọc mô tả thí nghiệm
2. Xem danh sách dụng cụ cần thiết
3. Click "🔬 Tiến hành thí nghiệm"
4. Đọc các bước và kết quả

**Ứng dụng:**
- Mô phỏng thí nghiệm an toàn
- Hiểu rõ quy trình thí nghiệm
- Không cần dụng cụ thật

## Hệ thống cấp độ

### Cách tính level
- Level = (Tổng điểm ÷ 500) + 1
- Ví dụ: 1000 điểm = Level 3

### Các cấp độ
- **Level 1**: Mới bắt đầu (0-499 điểm)
- **Level 2**: Học sinh tích cực (500-999 điểm)
- **Level 3**: Học sinh giỏi (1000-1499 điểm)
- **Level 4**: Học sinh xuất sắc (1500-1999 điểm)
- **Level 5+**: Chuyên gia (2000+ điểm)

## Thành tích

### Danh sách thành tích
1. **🎮 Lần đầu tiên**: Chơi game lần đầu
2. **🏅 Người chơi kỳ cựu**: Chơi 10 lần
3. **🏆 Bậc thầy**: Chơi 50 lần
4. **⭐ Điểm tuyệt đối**: Đạt 100 điểm (điểm tối đa)
5. **🎓 Chuyên gia**: Đạt Level 5

### Thông báo thành tích
- Thành tích mới sẽ hiển thị ở góc trên bên phải
- Thành tích được lưu vĩnh viễn
- Xem tất cả thành tích trong phần "Thống kê"

## Quản lý dữ liệu

### Xem thống kê
1. Click vào card "📊 Thống Kê"
2. Xem các thông tin:
   - Thông tin cá nhân
   - Điểm cao nhất, số lần chơi, level
   - Thống kê chi tiết từng game
   - Danh sách thành tích

### Xuất dữ liệu
1. Trong trang Thống kê
2. Click "📥 Xuất dữ liệu"
3. File JSON sẽ được tải về máy
4. Lưu file này để backup

### Nhập dữ liệu
*Tính năng đang phát triển*
- Sẽ cho phép khôi phục dữ liệu từ file backup

### Xóa dữ liệu
1. Click "🗑️ Xóa dữ liệu"
2. Xác nhận trong hộp thoại
3. Tất cả dữ liệu sẽ bị xóa (không thể hoàn tác!)

### Backup tự động
- Hệ thống tự động backup mỗi ngày
- Backup được giữ trong 7 ngày
- Lưu trong localStorage của trình duyệt

## Câu hỏi thường gặp

### Q: Dữ liệu có bị mất khi đóng trình duyệt?
**A:** Không, dữ liệu được lưu trong localStorage và sẽ được giữ lại kể cả khi đóng trình duyệt.

### Q: Tôi có thể chơi trên điện thoại không?
**A:** Có! Ứng dụng responsive và hoạt động tốt trên mọi thiết bị.

### Q: Cần kết nối internet không?
**A:** Chỉ cần internet lần đầu để tải Tailwind CSS. Sau đó có thể chơi offline.

### Q: Làm sao để thêm nội dung mới?
**A:** Chỉnh sửa file `ai-engine.js`, thêm vào phần `knowledgeBase`. Xem hướng dẫn chi tiết trong README.md.

### Q: Tại sao không thấy câu hỏi cho lớp của tôi?
**A:** Một số lớp có ít câu hỏi hơn. Chúng tôi đang cập nhật thêm nội dung.

### Q: Dữ liệu có an toàn không?
**A:** Có! Dữ liệu chỉ lưu trên máy bạn, không gửi đến server nào.

### Q: Có thể chơi nhiều tài khoản không?
**A:** Hiện tại mỗi trình duyệt chỉ lưu được 1 tài khoản. Để chơi nhiều tài khoản, xuất dữ liệu trước khi chuyển.

## Khắc phục sự cố

### Ứng dụng không tải
- Kiểm tra kết nối internet (lần đầu)
- Thử refresh trang (Ctrl+F5)
- Xóa cache trình duyệt
- Thử trình duyệt khác

### Dữ liệu bị mất
- Kiểm tra xem có file backup không
- Tránh xóa dữ liệu trình duyệt
- Thường xuyên xuất dữ liệu để backup

### Không thấy câu hỏi
- Kiểm tra đã chọn đúng lớp chưa
- Thử chuyển sang lớp khác
- Refresh lại trang

### Game không hoạt động
- Kiểm tra console log (F12)
- Đảm bảo JavaScript được bật
- Thử tắt ad blocker

## Liên hệ hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Mở Issue trên GitHub repository
2. Mô tả chi tiết vấn đề
3. Kèm theo screenshot nếu có
4. Ghi rõ trình duyệt và hệ điều hành đang dùng

---

**Chúc các em học tập vui vẻ và đạt kết quả cao! 🎓📚**
