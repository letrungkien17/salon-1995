-- ============================================================
-- SEED DATA FOR SALON 1995 - HAIR SALON & HERBAL HEAD SPA
-- Database: salon_booking
-- ============================================================

USE salon_booking;

-- Tắt kiểm tra khóa ngoại tạm thời để xóa/nạp dữ liệu an toàn
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE reviews;
TRUNCATE TABLE payments;
TRUNCATE TABLE booking_details;
TRUNCATE TABLE bookings;
TRUNCATE TABLE vouchers;
TRUNCATE TABLE otp_verifications;
TRUNCATE TABLE customers;
TRUNCATE TABLE users;
TRUNCATE TABLE role_permissions;
TRUNCATE TABLE permissions;
TRUNCATE TABLE roles;
TRUNCATE TABLE work_shifts;
TRUNCATE TABLE employee_skills;
TRUNCATE TABLE employees;
TRUNCATE TABLE service_products;
TRUNCATE TABLE products;
TRUNCATE TABLE services;
TRUNCATE TABLE service_categories;
TRUNCATE TABLE branches;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. CHI NHÁNH (branches)
INSERT INTO branches (branch_id, branch_name, address, phone, opening_time, closing_time, status) VALUES
(1, 'Salon 1995 - Chi nhánh Quận 1 (Flagship)', '195 Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh', '0901995195', '08:30:00', '20:30:00', 'active'),
(2, 'Salon 1995 - Chi nhánh Thảo Điền', '48 Xuân Thủy, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh', '0901995196', '08:30:00', '21:00:00', 'active'),
(3, 'Salon 1995 - Chi nhánh Hoàn Kiếm Hà Nội', '88 Tràng Thi, Phường Hàng Bông, Quận Hoàn Kiếm, Hà Nội', '0901995197', '08:30:00', '20:30:00', 'active');

-- 2. VAI TRÒ (roles)
INSERT INTO roles (role_id, role_name, description) VALUES
(1, 'Admin', 'Quản trị viên tối cao toàn bộ hệ thống'),
(2, 'Manager', 'Quản lý vận hành chi nhánh salon'),
(3, 'Staff', 'Kỹ thuật viên gội đầu dưỡng sinh & Stylist tạo kiểu tóc'),
(4, 'Receptionist', 'Lễ tân tiếp đón, điều phối lịch hẹn và thu ngân'),
(5, 'Customer', 'Khách hàng sử dụng dịch vụ');

-- 3. QUYỀN HẠN (permissions)
INSERT INTO permissions (permission_id, permission_code, module, description) VALUES
(1, 'BOOKING_VIEW', 'Booking', 'Xem danh sách và chi tiết lịch hẹn'),
(2, 'BOOKING_MANAGE', 'Booking', 'Duyệt, chuyển trạng thái và xếp thợ cho lịch hẹn'),
(3, 'SERVICE_MANAGE', 'Catalog', 'Thêm, sửa, cập nhật giá và dịch vụ salon'),
(4, 'STAFF_MANAGE', 'Staff', 'Quản lý nhân viên, kỹ năng và ca làm việc'),
(5, 'REPORT_VIEW', 'Report', 'Xem báo cáo doanh thu và công suất phục vụ');

INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 2), (2, 3), (2, 4),
(3, 1),
(4, 1), (4, 2);

-- 4. DANH MỤC DỊCH VỤ (service_categories)
INSERT INTO service_categories (category_id, category_name, description) VALUES
(1, 'Gội Đầu Dưỡng Sinh Hoàng Gia', 'Liệu trình gội đầu thảo mộc 12 vị cổ truyền, đả thông kinh lạc, bấm huyệt lưu thông khí huyết và giải tỏa căng thẳng'),
(2, 'Thiết Kế & Tạo Kiểu Tóc Cao Cấp', 'Dịch vụ cắt thiết kế cá nhân hóa, uốn sóng nước Hàn Quốc, nhuộm phủ bóng phục hồi collagen'),
(3, 'Trị Liệu Cổ - Vai - Gáy & Thư Giãn', 'Liệu pháp massage chuyên sâu bằng đá nóng núi lửa, bài độc da đầu, cạo gió ngọc bích giảm đau mỏi mạn tính'),
(4, 'Combo Trọn Gói Đặc Quyền 1995', 'Gói kết hợp làm tóc và trị liệu dưỡng sinh tối ưu thời gian với chi phí ưu đãi nhất');

-- 5. DỊCH VỤ CỤ THỂ (services)
INSERT INTO services (service_id, category_id, service_name, description, duration_minutes, price, status) VALUES
-- Dưỡng sinh
(1, 1, 'Gội Đầu Thảo Dược Cổ Truyền (60 phút)', 'Gội 2 lần bằng nước bồ kết nấu tươi 12 vị thuốc bắc, massage da đầu thư giãn, sấy tạo kiểu nhẹ', 60, 199000.00, 'active'),
(2, 1, 'Gội Dưỡng Sinh Đả Thông Kinh Lạc (75 phút)', 'Liệu trình hoàng gia: Khai thông huyệt đạo vùng đầu, xông hơi tai mắt, đắp mặt nạ ngọc trai và xịt tinh chất bưởi', 75, 299000.00, 'active'),
(3, 1, 'Dưỡng Sinh Chuyên Sâu Tứ Quý (90 phút)', 'Trọn vẹn 12 bước tinh hoa: Ngâm chân thảo mộc, gội đầu, cạo gió ngọc bích da đầu, massage đá nóng cổ vai gáy', 90, 399000.00, 'active'),
-- Làm tóc
(4, 2, 'Cắt Thiết Kế Tạo Kiểu Nam / Nữ Chuẩn Tỷ Lệ Vàng', 'Tư vấn dáng tóc phù hợp khuôn mặt, cắt form chuẩn, sấy tạo kiểu thời trang', 45, 180000.00, 'active'),
(5, 2, 'Uốn Sóng Lơi Hàn Quốc Phủ Bóng Collagen', 'Kỹ thuật uốn setting hiện đại giữ nếp tự nhiên, bổ sung collagen tươi bảo vệ cấu trúc sợi tóc', 120, 650000.00, 'active'),
(6, 2, 'Nhuộm Phục Hồi Nano Không Xơ Rối', 'Nhuộm màu thời trang theo xu hướng bằng hạt màu nano hữu cơ, kết hợp khóa màu chuyên sâu', 120, 750000.00, 'active'),
(7, 2, 'Phục Hồi Tóc Hư Tổn Nặng Keratin / Olaplex', 'Tái tạo liên kết tóc đứt gãy do hóa chất, trả lại mái tóc bóng khỏe, mềm mượt tự nhiên', 60, 450000.00, 'active'),
-- Trị liệu
(8, 3, 'Trị Liệu Chuyên Sâu Cổ Vai Gáy Đá Nóng (45 phút)', 'Xoa bóp day ấn huyệt vùng lưng trên, cổ vai gáy kết hợp đá bazan giữ nhiệt giảm đau tức thì', 45, 220000.00, 'active'),
(9, 3, 'Chăm Sóc & Thải Độc Da Đầu Bằng Thảo Dược (50 phút)', 'Tẩy tế bào chết da đầu sinh học, chiếu ánh sáng sinh học trị gàu và kích thích mọc nang tóc', 50, 250000.00, 'active'),
-- Combo
(10, 4, 'Combo Hoàng Kim: Cắt Tóc + Gội Dưỡng Sinh 75 Phút', 'Sự kết hợp hoàn hảo giữa diện mạo tóc mới và giây phút thư giãn tuyệt đỉnh', 105, 429000.00, 'active'),
(11, 4, 'Combo Thư Thái Toàn Diện: Dưỡng Sinh 90 Phút + Trị Liệu Vai Gáy', 'Trọn gói hồi phục năng lượng cho người làm việc văn phòng bận rộn', 120, 549000.00, 'active');

-- 6. SẢN PHẨM & MỸ PHẨM (products)
INSERT INTO products (product_id, product_name, unit, stock_quantity, unit_price, branch_id) VALUES
(1, 'Nước Gội Bồ Kết Nấu Tươi Hoàng Gia 1995', 'Chai 500ml', 120.00, 185000.00, 1),
(2, 'Tinh Dầu Bưởi Kích Thích Mọc Tóc Organic', 'Chai 100ml', 85.00, 220000.00, 1),
(3, 'Huyết Thanh Phục Hồi Keratin Nano Italy', 'Ống 20ml', 200.00, 95000.00, 1),
(4, 'Mặt Nạ Thảo Mộc Ngọc Trai Dưỡng Da', 'Gói 50g', 150.00, 60000.00, 1);

-- 7. LIÊN KẾT DỊCH VỤ - SẢN PHẨM (service_products)
INSERT INTO service_products (service_id, product_id, quantity_used) VALUES
(1, 1, 0.20),
(2, 1, 0.25),
(2, 4, 1.00),
(3, 1, 0.30),
(3, 2, 0.10),
(7, 3, 2.00);

-- 8. NHÂN VIÊN & KỸ THUẬT VIÊN (employees)
INSERT INTO employees (employee_id, branch_id, full_name, phone, email, gender, position, hire_date, status) VALUES
(1, 1, 'Nguyễn Văn Hoàng', '0912345601', 'hoang.nguyen@salon1995.vn', 'Nam', 'Stylist', '2023-01-15', 'active'),
(2, 1, 'Trần Thị Thu Thảo', '0912345602', 'thao.tran@salon1995.vn', 'Nữ', 'KTV Gội đầu dưỡng sinh', '2023-03-01', 'active'),
(3, 1, 'Lê Minh Tuấn', '0912345603', 'tuan.le@salon1995.vn', 'Nam', 'Stylist', '2023-05-10', 'active'),
(4, 1, 'Phạm Ngọc Ánh', '0912345604', 'anh.pham@salon1995.vn', 'Nữ', 'KTV Gội đầu dưỡng sinh', '2023-06-20', 'active'),
(5, 1, 'Vũ Thị Thanh Tâm', '0912345605', 'tam.vu@salon1995.vn', 'Nữ', 'Lễ tân', '2023-02-01', 'active'),
(6, 1, 'Đặng Quốc Huy', '0912345606', 'huy.dang@salon1995.vn', 'Nam', 'Quản lý', '2022-11-01', 'active');

-- 9. KỸ NĂNG NHÂN VIÊN (employee_skills)
INSERT INTO employee_skills (employee_id, service_id, skill_level) VALUES
(1, 4, 'Chuyên gia'),
(1, 5, 'Chuyên gia'),
(1, 6, 'Thành thạo'),
(1, 10, 'Chuyên gia'),
(2, 1, 'Chuyên gia'),
(2, 2, 'Chuyên gia'),
(2, 3, 'Chuyên gia'),
(2, 8, 'Thành thạo'),
(3, 4, 'Chuyên gia'),
(3, 6, 'Chuyên gia'),
(3, 7, 'Chuyên gia'),
(4, 1, 'Chuyên gia'),
(4, 2, 'Chuyên gia'),
(4, 8, 'Chuyên gia'),
(4, 9, 'Thành thạo');

-- 10. CA LÀM VIỆC (work_shifts) - Hôm nay và ngày mai
INSERT INTO work_shifts (shift_id, employee_id, branch_id, work_date, start_time, end_time, status) VALUES
(1, 1, 1, CURRENT_DATE(), '08:30:00', '16:30:00', 'scheduled'),
(2, 2, 1, CURRENT_DATE(), '08:30:00', '16:30:00', 'scheduled'),
(3, 3, 1, CURRENT_DATE(), '12:30:00', '20:30:00', 'scheduled'),
(4, 4, 1, CURRENT_DATE(), '12:30:00', '20:30:00', 'scheduled'),
(5, 1, 1, DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '08:30:00', '16:30:00', 'scheduled'),
(6, 2, 1, DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '08:30:00', '16:30:00', 'scheduled'),
(7, 3, 1, DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '12:30:00', '20:30:00', 'scheduled'),
(8, 4, 1, DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '12:30:00', '20:30:00', 'scheduled');

-- 11. TÀI KHOẢN NGƯỜI DÙNG HỆ THỐNG (users)
-- Mật khẩu mặc định: 'Admin@1995' cho admin/quanly và 'Staff@1995' cho nhân viên
INSERT INTO users (user_id, username, password_hash, role_id, employee_id, status) VALUES
(1, 'admin', '$2a$11$9iE8l8g7f6h5j4k3l2m1n.E3v8l9k0j1h2g3f4d5s6a7b8c9d0e1f2', 1, NULL, 'active'),
(2, 'quanly', '$2a$11$9iE8l8g7f6h5j4k3l2m1n.E3v8l9k0j1h2g3f4d5s6a7b8c9d0e1f2', 2, 6, 'active'),
(3, 'stylist.hoang', '$2a$11$9iE8l8g7f6h5j4k3l2m1n.E3v8l9k0j1h2g3f4d5s6a7b8c9d0e1f2', 3, 1, 'active'),
(4, 'ktv.thao', '$2a$11$9iE8l8g7f6h5j4k3l2m1n.E3v8l9k0j1h2g3f4d5s6a7b8c9d0e1f2', 3, 2, 'active'),
(5, 'letan', '$2a$11$9iE8l8g7f6h5j4k3l2m1n.E3v8l9k0j1h2g3f4d5s6a7b8c9d0e1f2', 4, 5, 'active');

-- 12. KHÁCH HÀNG (customers)
INSERT INTO customers (customer_id, full_name, phone, email, password_hash, gender, membership_level, account_status, is_phone_verified, is_email_verified) VALUES
(1, 'Nguyễn Thị Mai', '0988123456', 'nguyenmai@gmail.com', '$2a$11$9iE8l8g7f6h5j4k3l2m1n.E3v8l9k0j1h2g3f4d5s6a7b8c9d0e1f2', 'Nữ', 'Vàng', 'Hoạt động', 1, 1),
(2, 'Trần Minh Hùng', '0977234567', 'hungtran@gmail.com', '$2a$11$9iE8l8g7f6h5j4k3l2m1n.E3v8l9k0j1h2g3f4d5s6a7b8c9d0e1f2', 'Nam', 'Bạc', 'Hoạt động', 1, 1),
(3, 'Lê Kim Oanh', '0966345678', 'kimoanh.le@gmail.com', '$2a$11$9iE8l8g7f6h5j4k3l2m1n.E3v8l9k0j1h2g3f4d5s6a7b8c9d0e1f2', 'Nữ', 'Thường', 'Hoạt động', 1, 0),
(4, 'Phạm Thu Trang', '0918456789', 'thutrang.pham@gmail.com', '$2a$11$9iE8l8g7f6h5j4k3l2m1n.E3v8l9k0j1h2g3f4d5s6a7b8c9d0e1f2', 'Nữ', 'Bạch kim', 'Hoạt động', 1, 1);

-- 13. MÃ GIẢM GIÁ (vouchers)
INSERT INTO vouchers (voucher_id, voucher_code, description, discount_type, discount_value, start_date, end_date, usage_limit, used_count, status) VALUES
(1, 'SALON1995', 'Khuyến mãi khai trương giảm 20% tổng hóa đơn', 'percent', 20.00, '2024-01-01', '2028-12-31', 500, 15, 'active'),
(2, 'DUONGSINH50', 'Giảm trực tiếp 50.000 VNĐ cho liệu trình gội dưỡng sinh', 'fixed', 50000.00, '2024-01-01', '2028-12-31', 300, 42, 'active'),
(3, 'VIPGOLD', 'Ưu đãi dành riêng thành viên Vàng giảm 15%', 'percent', 15.00, '2024-01-01', '2028-12-31', 200, 8, 'active');

-- 14. LỊCH HẸN MẪU (bookings)
INSERT INTO bookings (booking_id, customer_id, branch_id, booking_date, booking_time, status, note, created_at) VALUES
(1, 1, 1, CURRENT_DATE(), '09:00:00', 'Đã xác nhận', 'Khách thích gội nước ấm, massage vai gáy nhẹ nhàng', NOW()),
(2, 2, 1, CURRENT_DATE(), '10:30:00', 'Chờ xác nhận', 'Cắt tóc kiểu side-part 7/3 vuốt sáp tự nhiên', NOW()),
(3, 4, 1, CURRENT_DATE(), '14:00:00', 'Đang thực hiện', 'Combo trọn gói Hoàng Kim 1995', NOW()),
(4, 3, 1, DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '09:30:00', 'Chờ xác nhận', 'Trị liệu đau mỏi cổ vai gáy do ngồi máy tính nhiều', NOW());

-- 15. CHI TIẾT LỊCH HẸN (booking_details)
INSERT INTO booking_details (booking_detail_id, booking_id, service_id, employee_id, price, start_time, end_time, status) VALUES
(1, 1, 2, 2, 299000.00, '09:00:00', '10:15:00', 'Đang làm'),
(2, 2, 4, 1, 180000.00, '10:30:00', '11:15:00', 'Chờ'),
(3, 3, 10, 1, 429000.00, '14:00:00', '15:45:00', 'Đang làm'),
(4, 4, 8, 4, 220000.00, '09:30:00', '10:15:00', 'Chờ');

-- 16. THANH TOÁN (payments)
INSERT INTO payments (payment_id, booking_id, voucher_id, payment_method, total_amount, discount_amount, final_amount, payment_status, payment_date) VALUES
(1, 1, 2, 'Chuyển khoản', 299000.00, 50000.00, 249000.00, 'Đã thanh toán', NOW()),
(2, 2, NULL, 'Tiền mặt', 180000.00, 0.00, 180000.00, 'Chưa thanh toán', NULL),
(3, 3, 1, 'Momo', 429000.00, 85800.00, 343200.00, 'Đã thanh toán', NOW());

-- 17. ĐÁNH GIÁ (reviews)
INSERT INTO reviews (review_id, booking_id, customer_id, rating, comment, created_at) VALUES
(1, 1, 1, 5, 'Không gian đậm chất thư thái cổ điển, mùi thảo mộc thơm nhẹ dễ chịu, bạn Thảo làm rất tận tâm và tay nghề bấm huyệt rất đã!', NOW());
