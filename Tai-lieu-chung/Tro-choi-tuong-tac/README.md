# Trò Chơi Học Tập Khoa Học Tự Nhiên - AI Powered

## Giới thiệu

Hệ thống trò chơi học tập tương tác được xây dựng để hỗ trợ học sinh THCS học môn Khoa học Tự nhiên một cách hiệu quả và thú vị hơn. Ứng dụng tích hợp các tính năng AI để tạo nội dung học tập tự động, theo dõi tiến độ và cá nhân hóa trải nghiệm học tập.

## Tính năng chính

### 🤖 Tích hợp AI

1. **Tạo câu hỏi tự động**: Hệ thống AI tự động tạo câu hỏi trắc nghiệm dựa trên cơ sở kiến thức khoa học
2. **Đánh giá thông minh**: Sử dụng thuật toán so sánh văn bản để đánh giá câu trả lời tự luận
3. **Spaced Repetition**: Thuật toán lặp lại ngắt quãng giúp tối ưu hóa việc ghi nhớ
4. **Adaptive Learning**: Điều chỉnh độ khó dựa trên hiệu suất học tập
5. **Gợi ý học tập**: Phân tích điểm yếu và đề xuất chủ đề cần học

### 🎮 Các trò chơi tương tác

#### 1. Trắc nghiệm AI (Quiz Game)
- Câu hỏi được tạo tự động từ cơ sở kiến thức
- Phản hồi tức thì cho từng câu trả lời
- Thanh tiến độ và tính điểm realtime
- Phân loại theo độ khó và chủ đề

#### 2. Thẻ ghi nhớ (Flashcards)
- Học thuật ngữ khoa học qua hệ thống thẻ ghi nhớ
- Áp dụng Spaced Repetition Algorithm
- Đánh giá độ khó để tối ưu lịch ôn tập
- Theo dõi tiến độ cho từng thẻ

#### 3. Ghép đôi (Matching Game)
- Ghép khái niệm với định nghĩa
- Tính điểm theo độ chính xác và thời gian
- Giao diện trực quan, dễ sử dụng
- Phù hợp cho việc ôn tập nhanh

#### 4. Điền từ (Fill in the Blank)
- Hoàn thành câu với từ khoa học chính xác
- Hệ thống gợi ý thông minh
- Chấm điểm tự động với AI
- Hiển thị đáp án chi tiết

#### 5. Thí nghiệm ảo (Virtual Experiment)
- Mô phỏng các thí nghiệm khoa học
- An toàn và dễ tiếp cận
- Hướng dẫn từng bước cụ thể
- Hiển thị kết quả dự kiến

### 💾 Lưu trữ dữ liệu

#### Dữ liệu được lưu trữ:
- **Thông tin học sinh**: Tên, lớp, ngày tạo tài khoản
- **Thống kê**: Điểm cao nhất, số lần chơi, level, tổng điểm
- **Lịch sử game**: Chi tiết các lần chơi cho từng loại game
- **Tiến độ học tập**: Chủ đề đã hoàn thành, khái niệm đã nắm vững, điểm yếu
- **Tiến độ flashcard**: Lịch sử ôn tập, độ khó, lịch review tiếp theo
- **Thành tích**: Các mốc quan trọng đã đạt được

#### Tính năng lưu trữ:
- Tự động lưu vào localStorage (không cần server)
- Backup tự động hàng ngày
- Xuất dữ liệu dạng JSON
- Nhập dữ liệu từ file backup
- Xóa dữ liệu với xác nhận

### 🏆 Hệ thống thành tích

- **Lần đầu tiên** 🎮: Chơi game lần đầu
- **Người chơi kỳ cựu** 🏅: Chơi 10 lần
- **Bậc thầy** 🏆: Chơi 50 lần
- **Điểm tuyệt đối** ⭐: Đạt 100 điểm
- **Chuyên gia** 🎓: Đạt level 5

### 📊 Thống kê chi tiết

- Tổng quan hiệu suất học tập
- Thống kê theo từng loại game
- Lịch sử 10 lần chơi gần nhất
- Độ chính xác trung bình
- Tiến độ flashcard (tổng, đã thành thạo, cần ôn)
- Danh sách thành tích đã mở khóa

## Cơ sở kiến thức

### Lớp 6
- **Sinh học**: Tế bào, Sinh sản
- **Vật lý**: Chuyển động, Ánh sáng

### Lớp 7
- **Sinh học**: Quang hợp

### Lớp 8
- **Vật lý**: Áp suất
- **Hóa học**: Nguyên tử phân tử, Phản ứng hóa học

### Lớp 9
- **Hóa học**: Kim loại, Dãy hoạt động hóa học

*Lưu ý: Cơ sở kiến thức có thể mở rộng bằng cách chỉnh sửa file `ai-engine.js`*

## Cách sử dụng

### 1. Mở ứng dụng
Mở file `index.html` trong trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari)

### 2. Nhập thông tin
- Nhập tên học sinh
- Chọn lớp đang học (6-9)

### 3. Chọn trò chơi
Click vào một trong các trò chơi để bắt đầu

### 4. Theo dõi tiến độ
- Xem thống kê trong trang chủ
- Click "Thống kê" để xem chi tiết
- Xuất dữ liệu để sao lưu

## Cấu trúc file

```
Tro-choi-tuong-tac/
├── index.html          # Giao diện chính
├── game-engine.js      # Logic điều khiển game
├── ai-engine.js        # Module AI và tạo nội dung
├── data-storage.js     # Module quản lý dữ liệu
└── README.md          # Tài liệu hướng dẫn
```

## Công nghệ sử dụng

- **HTML5**: Cấu trúc trang web
- **CSS3/Tailwind CSS**: Giao diện đẹp và responsive
- **JavaScript (ES6+)**: Logic xử lý
- **localStorage API**: Lưu trữ dữ liệu local
- **AI Algorithms**: 
  - Spaced Repetition Algorithm
  - Levenshtein Distance (so sánh văn bản)
  - Adaptive Learning Algorithm

## Ưu điểm

✅ Không cần kết nối internet sau khi tải trang
✅ Không cần server hoặc database
✅ Dữ liệu được lưu trữ an toàn trên máy người dùng
✅ Giao diện thân thiện, dễ sử dụng
✅ Tương thích với mọi thiết bị (desktop, tablet, mobile)
✅ Hoàn toàn miễn phí và mã nguồn mở

## Hướng dẫn mở rộng

### Thêm câu hỏi mới

Chỉnh sửa file `ai-engine.js`, thêm vào `knowledgeBase`:

```javascript
{
    topic: 'Tên chủ đề',
    concepts: [
        { 
            term: 'Thuật ngữ', 
            definition: 'Định nghĩa', 
            difficulty: 'easy|medium|hard' 
        }
    ],
    questions: [
        {
            question: 'Câu hỏi?',
            options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
            correct: 0, // Index của đáp án đúng
            difficulty: 'easy'
        }
    ]
}
```

### Thêm thành tích mới

Chỉnh sửa hàm `checkAchievements()` trong `data-storage.js`

### Tùy chỉnh giao diện

Chỉnh sửa các class Tailwind CSS trong `index.html`

## Yêu cầu hệ thống

- Trình duyệt web hiện đại (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript enabled
- localStorage enabled (thường bật mặc định)
- Không yêu cầu kết nối internet (sau khi tải)

## Bảo mật và riêng tư

- Tất cả dữ liệu được lưu trữ local trên máy người dùng
- Không có kết nối đến server bên ngoài
- Không thu thập thông tin cá nhân
- Người dùng có toàn quyền kiểm soát dữ liệu của mình

## Hỗ trợ và đóng góp

Nếu bạn muốn đóng góp hoặc báo lỗi, vui lòng:
1. Mở Issue trên GitHub repository
2. Tạo Pull Request với các cải tiến
3. Chia sẻ ý tưởng mới trong Discussions

## Giấy phép

Mã nguồn này được chia sẻ cho mục đích giáo dục. Vui lòng tôn trọng bản quyền khi sử dụng.

## Tác giả

Phát triển cho dự án KHTN-THCS
Năm 2025

---

**Chúc các em học tập vui vẻ và hiệu quả! 🎓📚**
