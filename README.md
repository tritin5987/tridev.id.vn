# Hướng dẫn Cập nhật & Biên dịch LaTeX CV (tridev.id.vn)

Dự án này đã được cấu hình tích hợp sẵn mã nguồn LaTeX cho CV của bạn (`cv/cv.tex`) và các công cụ giúp tự động cập nhật và biên dịch thành tệp PDF (`assets/docs/Bui_Duong_Tri.pdf`) hiển thị trên website.

---

## 📁 Cấu trúc thư mục mới
*   `cv/cv.tex`: Tệp mã nguồn LaTeX chứa nội dung CV của bạn (được đổi tên từ `CV.sty` để đúng chuẩn LaTeX).
*   `cv/compile.ps1`: Script PowerShell để biên dịch nhanh CV trên máy local bằng Docker (không cần cài đặt các gói LaTeX nặng trên máy).
*   `.github/workflows/compile-cv.yml`: Quy trình tự động biên dịch (GitHub Actions) chạy khi bạn push code lên GitHub.
*   `.vscode/settings.json`: Cấu hình cho extension **LaTeX Workshop** trên VS Code để tự động biên dịch đúng thư mục và tên tệp khi lưu.

---

## 🛠️ Cách cập nhật CV

Mỗi khi bạn muốn cập nhật thông tin trong CV:

### Cách 1: Tự động hoàn toàn qua GitHub (Khuyên dùng)
1. Chỉnh sửa nội dung trong tệp `cv/cv.tex`.
2. Commit và push thay đổi lên GitHub:
   ```bash
   git add cv/cv.tex
   git commit -m "update: cập nhật thông tin CV"
   git push origin main
   ```
3. **GitHub Actions** sẽ tự động chạy:
   * Biên dịch `cv/cv.tex` sang tệp PDF.
   * Sao chép tệp PDF mới vào `assets/docs/Bui_Duong_Tri.pdf`.
   * Tự động commit tệp PDF mới này ngược lại vào repository của bạn.
   * Website của bạn sẽ hiển thị bản CV mới nhất ngay lập tức!

---

### Cách 2: Biên dịch trực tiếp trong VS Code (Bằng Extension)
Nếu bạn thích biên dịch ngay khi đang code trong VS Code:
1. Cài đặt extension **LaTeX Workshop** trên VS Code.
2. Mở dự án `tridev.id.vn` bằng VS Code.
3. Khi bạn chỉnh sửa và nhấn **Save** (`Ctrl + S`) tệp `cv/cv.tex`, extension sẽ tự động biên dịch và lưu đè trực tiếp vào thư mục `assets/docs/Bui_Duong_Tri.pdf` nhờ cấu hình sẵn trong `.vscode/settings.json`.

---

### Cách 3: Biên dịch local qua Docker (Không cần cài LaTeX cục bộ)
Nếu bạn có Docker Desktop đang chạy:
1. Mở PowerShell trong thư mục dự án.
2. Chạy lệnh:
   ```powershell
   ./cv/compile.ps1
   ```
3. Script sẽ tự động chạy container LaTeX, biên dịch, cập nhật tệp PDF vào thư mục `assets/docs/` và tự động dọn dẹp các tệp tạm (`.log`, `.aux`,...).
