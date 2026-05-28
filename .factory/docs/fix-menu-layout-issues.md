# I. Primer (Mở đầu)

## 1. TL;DR kiểu Feynman
* **Vấn đề**: Menu 3 cấp trên máy tính (ví dụ: Danh sách sản phẩm -> Cơ - Điện tử - Van -> Van điều khiển) đang bị lỗi hiển thị. Khi hover vào cấp 2, menu cấp 3 bị ẩn đi và không thấy đâu. Đồng thời, menu cấp 2 bị giới hạn chiều cao và xuất hiện thanh cuộn dọc (scrollbar) trông rất chật chội và khó bấm.
* **Nguyên nhân**: Bản nâng cấp gần đây đã thêm thuộc tính `overflow-y-auto` (cuộn dọc) và giới hạn chiều cao tối đa `maxHeight` cho các menu dropdown dọc. Trong CSS, khi một phần tử cha bật thuộc tính `overflow` (dù là `auto`, `scroll` hay `hidden`), các phần tử con được định vị bay ra bên cạnh (`absolute left-full`) sẽ bị cắt bỏ (clip) hoặc gây cuộn ngang bên trong cha, không thể hiển thị tràn ra ngoài.
* **Giải pháp**: 
  1. Đổi điều kiện nhận diện Mega Menu: Nếu một menu có từ 3 cấp trở lên (`>= 3` thay vì `>= 4` như hiện tại), hệ thống sẽ tự động hiển thị nó dưới dạng **Mega Menu** (chia cột rộng rãi, trực quan) thay vì dropdown dọc dài. Điều này giúp menu "Danh sách sản phẩm" hiển thị các cột sản phẩm cực kỳ đẹp mắt.
  2. Bỏ `overflow-y-auto` và giới hạn `maxHeight` cho các dropdown dọc thường **khi chúng có chứa menu con bên trong** (để các menu con có thể bay sang hai bên bình thường). Chỉ giữ lại cuộn khi đó là dropdown phẳng hoàn toàn (không có menu con).

## 2. Elaboration & Self-Explanation (Giải thích chi tiết)
* **Phân tích hiện trạng**: 
  Hệ thống dựng cây menu (`menuTree`) dựa trên thứ tự (`order`) và độ sâu (`depth`). Menu "Danh sách sản phẩm" (ID: `k17drdvpcw1gxks5bnpnyvv3g582km67`) có tổng cộng 3 cấp (gốc: Danh sách sản phẩm -> cấp 2: Thiết bị truyền động, Thiết bị thủy lực... -> cấp 3: Vòng bi, Bơm thủy lực...).
  Trong file [Header.tsx](file:///e:/NextJS/job/job_from_system_vietadmin/ktec/components/site/Header.tsx), hàm `isDeepMenuForItem` quyết định xem một menu gốc có được render thành Mega Menu (popup rộng chia cột) hay không. Hiện tại điều kiện là `(maxLevel >= 4)`. Vì menu của chúng ta chỉ có 3 cấp (level 3), nó không thỏa mãn điều kiện này và bị đẩy vào nhánh dropdown dọc thường.
  Trong nhánh dropdown dọc thường, để tránh menu quá dài tràn màn hình, lập trình viên trước đó đã thêm class `overflow-y-auto` và `max-h-[290px]`. Khi người dùng hover vào các mục cấp 2 như "Cơ - Điện tử - Van" (có chứa con cấp 3 như "Van / Control Valve"), CSS cố gắng render menu con cấp 3 này ở vị trí `absolute left-full top-0 ml-1` (tức là bay sang bên phải của dropdown cha). Tuy nhiên, do dropdown cha đang có `overflow-y-auto`, trình duyệt sẽ cắt bỏ hoàn toàn phần nội dung nằm ngoài biên 200px của dropdown cha. Kết quả là menu cấp 3 hoàn toàn biến mất khỏi tầm mắt người dùng, chỉ có mũi tên xoay 90 độ chỉ xuống `v` mà không có nội dung nào xuất hiện.

* **Hướng xử lý**:
  * **Chuyển đổi sang Mega Menu**: Bất kỳ menu nào có cấu trúc từ 3 cấp trở lên sẽ được nâng cấp giao diện thành Mega Menu. Đối với các trang web thương mại điện tử / kỹ thuật như Ktec Vina, việc hiển thị Mega Menu chia cột (Thiết bị truyền động, Thiết bị thủy lực...) giúp khách hàng dễ dàng bao quát tất cả sản phẩm của công ty mà không phải di chuột ziczac phiền phức.
  * **Khắc phục dropdown thường**: Với các dropdown dọc thường (2 cấp), chúng ta sẽ kiểm tra xem nó có chứa menu con hay không. Nếu có con, bắt buộc phải loại bỏ `overflow-y-auto` và giới hạn chiều cao để đảm bảo cơ chế flyout (bay sang bên) hoạt động chính xác.

## 3. Concrete Examples & Analogies (Ví dụ & Minh họa trực quan)
* **Ví dụ thực tế**:
  Cấu trúc dữ liệu menu sản phẩm hiện tại:
  ```
  Danh sách sản phẩm (cấp 1 - Gốc)
   ├── Thiết bị truyền động (cấp 2)
   │    └── Vòng bi, Cáp xích, Motor - hộp số (cấp 3)
   ├── Thiết bị thủy lực (cấp 2)
   │    └── Bơm thủy lực, Van thủy lực, Ống thủy lực (cấp 3)
   └── Cơ - Điện tử - Van (cấp 2)
        └── Van / Control Valve (cấp 3)
  ```
* **Minh họa ẩn dụ**: 
  Hãy tưởng tượng dropdown cha giống như một hành lang hẹp có tường kính bao quanh (`overflow-y-auto`). Khi bạn mở một cánh cửa phòng con ở hai bên hành lang (menu cấp 3 bay ngang), cánh cửa đó đâm sầm vào tường kính và không thể mở ra được. Cách giải quyết là chúng ta phải dỡ bỏ bức tường kính đó (bỏ `overflow-y-auto`), hoặc chuyển hẳn sang một sảnh hội nghị rộng lớn (Mega Menu) nơi mọi thứ được bày biện trên các bàn trưng bày riêng biệt (chia cột).

---

# II. Audit Summary (Tóm tắt kiểm tra)
* **Đoạn code bị lỗi**: Trong file [Header.tsx](file:///e:/NextJS/job/job_from_system_vietadmin/ktec/components/site/Header.tsx):
  * Dòng 564: Định nghĩa `isDeepMenuForItem` yêu cầu level `>= 4`.
  * Các dòng 1175, 1749, 2019: Class `overflow-y-auto scrollbar-menu-thin` và thuộc tính style `maxHeight: 'min(70vh, 290px)'` được áp dụng vô điều kiện cho dropdown dọc thường, chặn đứng việc hiển thị menu cấp tiếp theo.
* **Tình trạng dữ liệu**: Dữ liệu trong Convex (Header Menu) được tổ chức chuẩn với các giá trị `depth` (0 cho cấp 1, 1 cho cấp 2, 2 cho cấp 3). Cấu trúc dữ liệu hoàn toàn chính xác, lỗi nằm hoàn toàn ở giao diện CSS hiển thị.

---

# III. Root Cause & Counter-Hypothesis (Nguyên nhân gốc & Giả thuyết đối chứng)
* **Nguyên nhân gốc**: Việc áp dụng `overflow-y-auto` và `maxHeight` vô điều kiện vào container dropdown dọc làm kích hoạt cơ chế clipping của trình duyệt đối với các phần tử con định vị `absolute` định vị bên ngoài biên của container đó.
* **Độ tin cậy nguyên nhân gốc**: **High (Cao)** - Lỗi này được chứng minh bằng lý thuyết layout CSS chuẩn và trùng khớp hoàn toàn với hành vi không hiển thị menu cấp 3 trên giao diện web thực tế.
* **Giả thuyết đối chứng**: Có thể do lỗi z-index làm menu cấp 3 bị đè dưới các phần tử khác? 
  * *Bác bỏ*: Mũi tên của menu cấp 2 đã xoay 90 độ (cho thấy trạng thái hover đã kích hoạt và DOM của menu cấp 3 đã được render), nhưng kiểm tra bằng DevTools (hoặc phân tích CSS) cho thấy chiều rộng dropdown cha bị giới hạn và không hề có thanh cuộn ngang hay bất kỳ phần tử nào lồi ra ngoài. Việc tắt thuộc tính `overflow` trong DevTools sẽ lập tức làm hiện menu cấp 3.

---

# IV. Proposal (Đề xuất)
1. Cập nhật hàm `isDeepMenuForItem` trong [Header.tsx](file:///e:/NextJS/job/job_from_system_vietadmin/ktec/components/site/Header.tsx) để nhận diện các menu từ 3 cấp trở lên là Mega Menu:
   ```typescript
   const isDeepMenuForItem = useCallback((itemId: Id<'menuItems'>) => (maxLevelByRootId.get(itemId) ?? 1) >= 3, [maxLevelByRootId]);
   ```
2. Cập nhật logic render dropdown thường trong [Header.tsx](file:///e:/NextJS/job/job_from_system_vietadmin/ktec/components/site/Header.tsx) (cho cả 3 kiểu Layout: `classic`, `topbar`, `allbirds`):
   * Xác định xem dropdown hiện tại có chứa phần tử con đa cấp hay không:
     ```typescript
     const hasSubChildren = item.children.some(child => child.children.length > 0);
     ```
   * Nếu `hasSubChildren` là `true`, loại bỏ `overflow-y-auto` và `maxHeight` (hoặc đặt `maxHeight` thành `none` và `overflow` thành `visible`) để menu flyout hoạt động hoàn hảo.
   * Nếu `hasSubChildren` là `false` (dropdown phẳng hoàn toàn), giữ nguyên `overflow-y-auto` và `maxHeight` để bảo toàn tính năng tối ưu hóa cuộn cho danh sách dài.

---

# V. Files Impacted (Tệp bị ảnh hưởng)
* **Sửa**: [components/site/Header.tsx](file:///e:/NextJS/job/job_from_system_vietadmin/ktec/components/site/Header.tsx)
  * Vai trò hiện tại: Quản lý hiển thị toàn bộ phần Header và Navigation Menu của website ở chế độ Desktop và Mobile.
  * Thay đổi: Điều chỉnh điều kiện `isDeepMenuForItem` và cập nhật các class/style của dropdown để vô hiệu hóa `overflow-y-auto` khi dropdown chứa menu con.

---

# VI. Execution Preview (Xem trước thực thi)
1. **Bước 1**: Đọc và định vị chính xác các dòng khai báo dropdown thường trong file [Header.tsx](file:///e:/NextJS/job/job_from_system_vietadmin/ktec/components/site/Header.tsx).
2. **Bước 2**: Thay đổi điều kiện `isDeepMenuForItem` từ `>= 4` thành `>= 3`.
3. **Bước 3**: Thêm biến kiểm tra `hasSubChildren` trước khi render dropdown thường.
4. **Bước 4**: Điều chỉnh style và className của dropdown thường dựa trên giá trị của `hasSubChildren`.
5. **Bước 5**: Kiểm tra tĩnh code (TypeScript và lint) để đảm bảo không phát sinh lỗi biên dịch.

---

# VII. Verification Plan (Kế hoạch kiểm chứng)
1. **Kiểm tra biên dịch**: Chạy `bunx tsc --noEmit` để đảm bảo code sạch lỗi TypeScript.
2. **Kiểm tra thực tế (Tester phụ trách)**:
   * Hover vào "Danh sách sản phẩm": Kiểm tra xem giao diện Mega Menu chia cột có hiển thị đẹp mắt và cân đối không.
   * Kiểm tra các menu 2 cấp khác (nếu có): Dropdown thường vẫn hiển thị đúng và có scrollbar nếu quá dài.

---

# VIII. Todo
- [ ] Cập nhật định nghĩa `isDeepMenuForItem` thành `>= 3` trong [Header.tsx](file:///e:/NextJS/job/job_from_system_vietadmin/ktec/components/site/Header.tsx).
- [ ] Tìm tất cả các khối dropdown thường trong [Header.tsx](file:///e:/NextJS/job/job_from_system_vietadmin/ktec/components/site/Header.tsx) (layouts `classic`, `topbar`, `allbirds`).
- [ ] Thêm biến `hasSubChildren` cho các block dropdown thường này.
- [ ] Điều kiện hóa class `overflow-y-auto scrollbar-menu-thin` và style `maxHeight` dựa trên `hasSubChildren`.

---

# IX. Acceptance Criteria (Tiêu chí chấp nhận)
* Menu 3 cấp (Danh sách sản phẩm) tự động hiển thị dạng Mega Menu chia cột rõ ràng.
* Các dropdown dọc thường nếu chứa menu con (flyout) thì khi hover vào mục cấp 2, menu cấp 3 phải bay ra ngoài và hiển thị đầy đủ, không bị cắt xén hay bị cuộn ẩn.
* Giao diện không bị lỗi bể layout hoặc vỡ CSS trên các kích thước màn hình desktop chuẩn.

---

# X. Risk / Rollback (Rủi ro / Hoàn tác)
* **Rủi ro**: Thay đổi logic định dạng Mega Menu có thể khiến một số menu 3 cấp trước đó đang muốn hiển thị dạng dọc nay chuyển sang Mega Menu. Tuy nhiên, đây là hành vi mong muốn và tối ưu hơn về UX.
* **Hoàn tác**: Sử dụng lệnh `git checkout components/site/Header.tsx` để khôi phục trạng thái ban đầu của file.

---

# XI. Out of Scope (Ngoài phạm vi)
* Thay đổi dữ liệu thực trong Convex (cấu trúc menu trong DB).
* Điều chỉnh phần menu trên thiết bị di động (Mobile Menu) vì Mobile Menu hiển thị dạng accordion dọc chồng lên nhau, không sử dụng cơ chế hover flyout nên không bị lỗi này ảnh hưởng.
