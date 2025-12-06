import os
import requests
import google.generativeai as genai
import markdown
import pypandoc
from xhtml2pdf import pisa

# --- 1. CẤU HÌNH & TẢI FONT TIẾNG VIỆT ---
def download_font():
    # Tải font Roboto Slab hỗ trợ tiếng Việt
    font_url = "https://github.com/google/fonts/raw/main/apache/robotoslab/RobotoSlab-Regular.ttf"
    font_path = "VietnameseFont.ttf"
    if not os.path.exists(font_path):
        print("Đang tải font tiếng Việt...")
        r = requests.get(font_url)
        with open(font_path, 'wb') as f:
            f.write(r.content)
    return font_path

# --- 2. HÀM XUẤT PDF ĐẸP ---
def convert_to_pdf(markdown_text, output_filename):
    font_path = download_font()
    html_content = markdown.markdown(markdown_text)
    
    # CSS căn chỉnh trang in
    css_style = f"""
    <style>
        @font-face {{ font-family: 'VietnameseFont'; src: url('{font_path}'); }}
        body {{ font-family: 'VietnameseFont', sans-serif; font-size: 12pt; line-height: 1.6; margin: 30px; }}
        h1 {{ text-align: center; color: #2c3e50; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px; font-size: 16pt; }}
        h2 {{ color: #e67e22; margin-top: 20px; text-transform: uppercase; font-size: 13pt; border-bottom: 1px dashed #ccc; }}
        strong {{ color: #2980b9; }}
        p {{ margin-bottom: 10px; text-align: justify; }}
        ul, ol {{ margin-bottom: 10px; }}
        .header {{ text-align: center; font-weight: bold; margin-bottom: 20px; font-size: 14pt; }}
        .footer {{ position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10pt; color: #777; }}
    </style>
    """
    
    full_html = f"""
    <html>
    <head>{css_style}</head>
    <body>
        <div class="header">TRƯỜNG THCS ........................<br>TỔ KHOA HỌC TỰ NHIÊN</div>
        {html_content}
        <div class="footer">Đề thi cấu trúc mới (GDPT 2018) - Tạo bởi AI Engineer</div>
    </body>
    </html>
    """
    
    with open(output_filename, "wb") as result_file:
        pisa.CreatePDF(full_html, dest=result_file)

# --- 3. LOGIC CHÍNH ---
def main():
    # Lấy Key và Input từ GitHub
    api_key = os.environ.get("GEMINI_API_KEY")
    topic = os.environ.get("INPUT_TOPIC", "Nguyên tử")
    num_questions = os.environ.get("INPUT_NUM", "5")
    
    if not api_key: raise ValueError("Thiếu API Key")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    print(f"--- ĐANG XỬ LÝ: {topic} ---")
    
    # Cập nhật Prompt theo cấu trúc đề thi mới (3 phần)
    prompt = f"""
    Đóng vai giáo viên KHTN giỏi. Soạn đề kiểm tra chủ đề: {topic}.
    
    Yêu cầu cấu trúc đề thi mới (theo định dạng đánh giá năng lực GDPT 2018):
    
    PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn (Khoảng 40% số lượng).
    - Các câu hỏi có 4 phương án A, B, C, D. Chọn 1 phương án đúng.
    
    PHẦN II. Câu trắc nghiệm đúng sai (Khoảng 30% số lượng).
    - Mỗi câu hỏi có 4 ý a), b), c), d).
    - Học sinh phải trả lời Đúng hoặc Sai cho từng ý.
    
    PHẦN III. Câu trắc nghiệm trả lời ngắn (Khoảng 30% số lượng).
    - Câu hỏi yêu cầu học sinh điền kết quả (số hoặc từ ngắn), không có đáp án chọn sẵn.
    
    Tổng số lượng câu hỏi khoảng: {num_questions} câu (phân bổ hợp lý cho 3 phần).
    
    Yêu cầu định dạng Markdown để xuất file đẹp:
    - Tiêu đề H1: ĐỀ KIỂM TRA (CẤU TRÚC MỚI)
    - Dùng H2 cho tên các Phần (Ví dụ: ## PHẦN I...)
    - Câu hỏi in đậm (**Câu 1:** ...)
    - Cuối cùng là H2: ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM CHI TIẾT.
    """
    
    response = model.generate_content(prompt)
    md_content = response.text
    
    if not os.path.exists('output'): os.makedirs('output')
    
    # Xuất PDF
    print("-> Đang xuất PDF...")
    convert_to_pdf(md_content, f'output/De_Thi_{topic}.pdf')
    
    # Xuất DOCX
    try:
        print("-> Đang xuất DOCX...")
        pypandoc.convert_text(md_content, 'docx', format='md', outputfile=f'output/De_Thi_{topic}.docx')
    except Exception as e:
        print(f"Lỗi xuất Word: {e}")

if __name__ == "__main__":
    main()
