# Test Cases - Challenge Management & User Management

## 1. Challenge Statistics Test Cases

### TC-CHAL-001: Dashboard Challenge Statistics Display
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-CHAL-001 | Dashboard Challenge Statistics Display | Dashboard hiển thị thống kê tổng quan về Challenge | | Functional | Manual | | | 1. Login với tài khoản admin<br>2. Truy cập Dashboard<br>3. Kiểm tra hiển thị thống kê Challenge | Kiểm tra loading state |

### TC-CHAL-002: Challenge Statistics Filtering
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-CHAL-002 | Challenge Statistics Filtering | Thống kê Challenge cập nhật theo bộ lọc thời gian | | Functional | Manual | | | 1. Truy cập Dashboard<br>2. Thay đổi filter (day/month/year)<br>3. Kiểm tra biểu đồ cập nhật | Test tất cả filter types |

### TC-CHAL-003: Challenge Revenue Chart
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-CHAL-003 | Challenge Revenue Chart | Biểu đồ doanh thu Challenge hiển thị chính xác | | Functional | Manual | | | 1. Truy cập Dashboard<br>2. Kiểm tra biểu đồ doanh thu<br>3. Verify dữ liệu hiển thị | Kiểm tra responsive design |

## 2. Participants/Submissions Viewing Test Cases

### TC-PART-001: View Challenge Participants List
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-PART-001 | View Challenge Participants List | Hiển thị danh sách người tham gia Challenge | | Functional | Manual | | | 1. Login admin<br>2. Truy cập trang Participants<br>3. Kiểm tra danh sách hiển thị | Kiểm tra pagination |

### TC-PART-002: Filter Participants by Status
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-PART-002 | Filter Participants by Status | Lọc người tham gia theo trạng thái | | Functional | Manual | | | 1. Truy cập trang Participants<br>2. Chọn filter status<br>3. Kiểm tra kết quả lọc | Test các status khác nhau |

### TC-PART-003: View Submission Details
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-PART-003 | View Submission Details | Xem chi tiết bài nộp của người tham gia | | Functional | Manual | | | 1. Truy cập danh sách Participants<br>2. Click vào bài nộp<br>3. Kiểm tra chi tiết hiển thị | Kiểm tra file upload |

### TC-PART-004: Export Participants Data
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-PART-004 | Export Participants Data | Xuất dữ liệu người tham gia ra file | | Functional | Manual | | | 1. Truy cập trang Participants<br>2. Click Export<br>3. Kiểm tra file download | Test format CSV/Excel |

## 3. User Management Test Cases (Based on Actual Code)

### TC-USER-001: View Users List
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-USER-001 | View Users List | Hiển thị danh sách người dùng với avatar, thông tin cơ bản | | Functional | Manual | | | 1. Login admin<br>2. Truy cập Users page<br>3. Kiểm tra table hiển thị | Kiểm tra avatar loading |

### TC-USER-002: Edit User Information
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-USER-002 | Edit User Information | Cập nhật thông tin người dùng thành công | | Functional | Manual | | | 1. Click "Sửa" trên user row<br>2. Thay đổi thông tin<br>3. Click "Lưu"<br>4. Kiểm tra cập nhật | Test validation |

### TC-USER-003: Update User Avatar
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-USER-003 | Update User Avatar | Upload và cập nhật avatar người dùng | | Functional | Manual | | | 1. Edit user<br>2. Chọn file ảnh<br>3. Kiểm tra preview<br>4. Lưu thay đổi | Test image format |

### TC-USER-004: Change User Role
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-USER-004 | Change User Role | Thay đổi role user/admin thành công | | Functional | Manual | | | 1. Edit user<br>2. Thay đổi role<br>3. Lưu thay đổi<br>4. Kiểm tra cập nhật | Test permission check |

### TC-USER-005: Update User Status
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-USER-005 | Update User Status | Thay đổi status active/inactive | | Functional | Manual | | | 1. Edit user<br>2. Thay đổi status<br>3. Lưu thay đổi<br>4. Kiểm tra cập nhật | Test status validation |

### TC-USER-006: Delete User
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-USER-006 | Delete User | Xóa người dùng với confirmation | | Functional | Manual | | | 1. Click "Xóa" trên user row<br>2. Confirm dialog<br>3. Kiểm tra user bị xóa | Test confirmation dialog |

### TC-USER-007: User Pagination
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-USER-007 | User Pagination | Pagination hoạt động chính xác | | Functional | Manual | | | 1. Truy cập Users page<br>2. Click next/prev page<br>3. Kiểm tra dữ liệu load | Test với nhiều pages |

### TC-USER-008: User Search Functionality
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-USER-008 | User Search Functionality | Tìm kiếm người dùng theo tên/email | | Functional | Manual | | | 1. Nhập từ khóa tìm kiếm<br>2. Kiểm tra kết quả filter<br>3. Test với từ khóa không tồn tại | Test search performance |

## 4. Integration Test Cases

### TC-INT-001: Challenge-User Integration
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-INT-001 | Challenge-User Integration | Liên kết Challenge với User management | | Integration | Manual | | | 1. Tạo Challenge mới<br>2. Assign users<br>3. Kiểm tra integration | Test data consistency |

### TC-INT-002: Submission-User Integration
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-INT-002 | Submission-User Integration | Liên kết Submission với User data | | Integration | Manual | | | 1. User submit bài<br>2. Admin view submission<br>3. Kiểm tra user info | Test data integrity |

## 5. Performance Test Cases

### TC-PERF-001: Large User List Performance
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-PERF-001 | Large User List Performance | Load danh sách 1000+ users trong <3s | | Performance | Automatic | | | 1. Tạo 1000+ test users<br>2. Load Users page<br>3. Đo thời gian response | Test pagination performance |

### TC-PERF-002: Challenge Statistics Performance
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-PERF-002 | Challenge Statistics Performance | Load thống kê Challenge trong <2s | | Performance | Automatic | | | 1. Truy cập Dashboard<br>2. Load Challenge stats<br>3. Đo thời gian render | Test chart rendering |

## 6. Security Test Cases

### TC-SEC-001: Admin Role Validation
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-SEC-001 | Admin Role Validation | Chỉ admin mới truy cập được Challenge management | | Security | Manual | | | 1. Login với user role<br>2. Truy cập Challenge pages<br>3. Kiểm tra access denied | Test authorization |

### TC-SEC-002: User Data Protection
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-SEC-002 | User Data Protection | Bảo vệ thông tin cá nhân người dùng | | Security | Manual | | | 1. Kiểm tra API endpoints<br>2. Verify token validation<br>3. Test data encryption | Test data security |

## 7. Browser Compatibility Test Cases

### TC-COMP-001: Cross Browser Compatibility
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-COMP-001 | Cross Browser Compatibility | Challenge management hoạt động trên Chrome, Firefox, Safari | | Compatibility | Manual | | | 1. Test trên Chrome<br>2. Test trên Firefox<br>3. Test trên Safari | Test responsive design |

---

**Tổng kết:**
- **Challenge Statistics**: 3 test cases
- **Participants/Submissions**: 4 test cases  
- **User Management**: 8 test cases (dựa trên code thực tế)
- **Integration**: 2 test cases
- **Performance**: 2 test cases
- **Security**: 2 test cases
- **Compatibility**: 1 test case

**Tổng cộng: 22 test cases** - Ngắn gọn, xúc tích nhưng đầy đủ ý nghĩa dựa trên source code thực tế của bạn. 