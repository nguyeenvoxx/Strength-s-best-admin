# Test Cases - Strength Best Admin Application

## Test Case Template
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|

---

## 1. Authentication & Authorization Test Cases

### TC-AUTH-001: Admin Login with Valid Credentials
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-AUTH-001 | Admin Login with Valid Credentials | User successfully logs in and redirects to dashboard | | Functional | Manual | | | 1. Navigate to /login<br>2. Enter valid admin email<br>3. Enter valid password<br>4. Check "Agree to terms"<br>5. Click "ĐĂNG NHẬP" button | Verify token is stored in localStorage |

### TC-AUTH-002: Admin Login with Invalid Credentials
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-AUTH-002 | Admin Login with Invalid Credentials | Error message displayed, user stays on login page | | Functional | Manual | | | 1. Navigate to /login<br>2. Enter invalid email<br>3. Enter invalid password<br>4. Click "ĐĂNG NHẬP" button | Verify error message appears |

### TC-AUTH-003: Non-Admin User Login Attempt
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-AUTH-003 | Non-Admin User Login Attempt | Error message: "Chỉ tài khoản admin mới được phép đăng nhập vào trang quản trị!" | | Functional | Manual | | | 1. Navigate to /login<br>2. Enter non-admin user credentials<br>3. Click "ĐĂNG NHẬP" button | Verify admin role check |

### TC-AUTH-004: Login Form Validation
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-AUTH-004 | Login Form Validation | Form validation prevents submission without required fields | | Functional | Manual | | | 1. Navigate to /login<br>2. Leave email empty<br>3. Leave password empty<br>4. Try to submit form | Verify validation messages |

### TC-AUTH-005: Password Visibility Toggle
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-AUTH-005 | Password Visibility Toggle | Password field toggles between visible and hidden | | Functional | Manual | | | 1. Navigate to /login<br>2. Enter password<br>3. Click eye icon<br>4. Verify password visibility changes | Test both show/hide states |

### TC-AUTH-006: Logout Functionality
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-AUTH-006 | Logout Functionality | User logs out and redirects to login page | | Functional | Manual | | | 1. Login as admin<br>2. Click logout button<br>3. Verify redirect to login | Verify token is removed from localStorage |

---

## 2. Dashboard Test Cases

### TC-DASH-001: Dashboard Load with Statistics
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-DASH-001 | Dashboard Load with Statistics | Dashboard displays total users, orders, revenue statistics | | Functional | Manual | | | 1. Login as admin<br>2. Navigate to dashboard<br>3. Verify statistics cards display | Check for loading states |

### TC-DASH-002: Revenue Chart Filtering
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-DASH-002 | Revenue Chart Filtering | Chart updates when filter type changes (day/month/year) | | Functional | Manual | | | 1. Navigate to dashboard<br>2. Change filter type<br>3. Verify chart updates | Test all filter types |

### TC-DASH-003: Latest Orders Display
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-DASH-003 | Latest Orders Display | Latest orders table displays recent orders with details | | Functional | Manual | | | 1. Navigate to dashboard<br>2. Scroll to latest orders section<br>3. Verify order details display | Check order status colors |

### TC-DASH-004: Top Selling Products
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-DASH-004 | Top Selling Products | Top selling products section displays with images and stats | | Functional | Manual | | | 1. Navigate to dashboard<br>2. Scroll to top selling products<br>3. Verify product images and stats | Check product image loading |

---

## 3. User Management Test Cases

### TC-USER-001: View Users List
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-USER-001 | View Users List | Users page displays paginated list of users | | Functional | Manual | | | 1. Navigate to /users<br>2. Verify user list displays<br>3. Check pagination works | Verify user details display correctly |

### TC-USER-002: Edit User Information
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-USER-002 | Edit User Information | User information can be edited and saved successfully | | Functional | Manual | | | 1. Navigate to /users<br>2. Click edit on a user<br>3. Modify user details<br>4. Save changes | Verify form validation |

### TC-USER-003: Update User Avatar
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-USER-003 | Update User Avatar | User avatar can be uploaded and updated | | Functional | Manual | | | 1. Navigate to /users<br>2. Edit a user<br>3. Upload new avatar image<br>4. Save changes | Test with different image formats |

### TC-USER-004: Delete User
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-USER-004 | Delete User | User can be deleted with confirmation dialog | | Functional | Manual | | | 1. Navigate to /users<br>2. Click delete on a user<br>3. Confirm deletion<br>4. Verify user removed from list | Test confirmation dialog |

### TC-USER-005: User Status Toggle
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-USER-005 | User Status Toggle | User status can be toggled between active/inactive | | Functional | Manual | | | 1. Navigate to /users<br>2. Toggle user status<br>3. Verify status changes | Check status indicator updates |

---

## 4. Product Management Test Cases

### TC-PROD-001: View Products List
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-PROD-001 | View Products List | Products page displays paginated list with images | | Functional | Manual | | | 1. Navigate to /all-products<br>2. Verify product list displays<br>3. Check product images load | Verify image URLs are correct |

### TC-PROD-002: Add New Product
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-PROD-002 | Add New Product | New product can be created with all required fields | | Functional | Manual | | | 1. Navigate to /add-new-product<br>2. Fill all required fields<br>3. Upload product image<br>4. Submit form | Test form validation |

### TC-PROD-003: Edit Product
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-PROD-003 | Edit Product | Product information can be edited and saved | | Functional | Manual | | | 1. Navigate to /all-products<br>2. Click edit on a product<br>3. Modify product details<br>4. Save changes | Verify image preview works |

### TC-PROD-004: Delete Product
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-PROD-004 | Delete Product | Product can be deleted with confirmation | | Functional | Manual | | | 1. Navigate to /all-products<br>2. Click delete on a product<br>3. Confirm deletion<br>4. Verify product removed | Test confirmation dialog |

### TC-PROD-005: Product Filtering
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-PROD-005 | Product Filtering | Products can be filtered by name, brand, category, price | | Functional | Manual | | | 1. Navigate to /all-products<br>2. Apply different filters<br>3. Verify filtered results | Test all filter combinations |

### TC-PROD-006: Product Detail View
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-PROD-006 | Product Detail View | Product details modal displays complete information | | Functional | Manual | | | 1. Navigate to /all-products<br>2. Click view details on a product<br>3. Verify detail modal opens | Check all product fields display |

---

## 5. Order Management Test Cases

### TC-ORDER-001: View Orders List
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-ORDER-001 | View Orders List | Orders page displays paginated list of orders | | Functional | Manual | | | 1. Navigate to /orders<br>2. Verify order list displays<br>3. Check order details | Verify order status colors |

### TC-ORDER-002: View Order Details
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-ORDER-002 | View Order Details | Order details modal shows complete order information | | Functional | Manual | | | 1. Navigate to /orders<br>2. Click view details on an order<br>3. Verify detail modal opens | Check payment information |

### TC-ORDER-003: Update Order Status
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-ORDER-003 | Update Order Status | Order status can be updated through dropdown | | Functional | Manual | | | 1. Navigate to /orders<br>2. Change order status<br>3. Verify status updates | Test all status options |

### TC-ORDER-004: Order Filtering
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-ORDER-004 | Order Filtering | Orders can be filtered by status and date range | | Functional | Manual | | | 1. Navigate to /orders<br>2. Apply status filter<br>3. Apply date filter<br>4. Verify filtered results | Test filter combinations |

---

## 6. Category Management Test Cases

### TC-CAT-001: View Categories List
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-CAT-001 | View Categories List | Categories page displays list of categories | | Functional | Manual | | | 1. Navigate to /categories<br>2. Verify category list displays | Check category status indicators |

### TC-CAT-002: Add New Category
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-CAT-002 | Add New Category | New category can be created successfully | | Functional | Manual | | | 1. Navigate to /categories<br>2. Click add category<br>3. Enter category name<br>4. Submit form | Verify form validation |

### TC-CAT-003: Edit Category
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-CAT-003 | Edit Category | Category name can be edited | | Functional | Manual | | | 1. Navigate to /categories<br>2. Click edit on a category<br>3. Modify category name<br>4. Save changes | Test with empty name validation |

### TC-CAT-004: Delete Category
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-CAT-004 | Delete Category | Category can be deleted with confirmation | | Functional | Manual | | | 1. Navigate to /categories<br>2. Click delete on a category<br>3. Confirm deletion<br>4. Verify category removed | Test with categories that have products |

### TC-CAT-005: Restore Category
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-CAT-005 | Restore Category | Deleted category can be restored | | Functional | Manual | | | 1. Navigate to /categories<br>2. Delete a category<br>3. Click restore<br>4. Verify category restored | Check status changes |

---

## 7. Brand Management Test Cases

### TC-BRAND-001: View Brands List
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-BRAND-001 | View Brands List | Brands page displays list of brands | | Functional | Manual | | | 1. Navigate to /brands<br>2. Verify brand list displays | Check brand status indicators |

### TC-BRAND-002: Add New Brand
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-BRAND-002 | Add New Brand | New brand can be created successfully | | Functional | Manual | | | 1. Navigate to /brands<br>2. Click add brand<br>3. Enter brand name<br>4. Submit form | Verify form validation |

### TC-BRAND-003: Edit Brand
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-BRAND-003 | Edit Brand | Brand name can be edited | | Functional | Manual | | | 1. Navigate to /brands<br>2. Click edit on a brand<br>3. Modify brand name<br>4. Save changes | Test with empty name validation |

### TC-BRAND-004: Delete Brand
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-BRAND-004 | Delete Brand | Brand can be deleted with confirmation | | Functional | Manual | | | 1. Navigate to /brands<br>2. Click delete on a brand<br>3. Confirm deletion<br>4. Verify brand removed | Test with brands that have products |

### TC-BRAND-005: Restore Brand
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-BRAND-005 | Restore Brand | Deleted brand can be restored | | Functional | Manual | | | 1. Navigate to /brands<br>2. Delete a brand<br>3. Click restore<br>4. Verify brand restored | Check status changes |

---

## 8. Review Management Test Cases

### TC-REVIEW-001: View Reviews List
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-REVIEW-001 | View Reviews List | Reviews page displays paginated list of reviews | | Functional | Manual | | | 1. Navigate to /reviews<br>2. Verify review list displays<br>3. Check review details | Verify rating stars display |

### TC-REVIEW-002: Add Admin Reply
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-REVIEW-002 | Add Admin Reply | Admin can add reply to a review | | Functional | Manual | | | 1. Navigate to /reviews<br>2. Click reply on a review<br>3. Enter reply content<br>4. Submit reply | Verify reply appears under review |

### TC-REVIEW-003: Edit Admin Reply
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-REVIEW-003 | Edit Admin Reply | Admin can edit existing reply | | Functional | Manual | | | 1. Navigate to /reviews<br>2. Click edit on a reply<br>3. Modify reply content<br>4. Save changes | Verify reply updates |

### TC-REVIEW-004: Delete Review
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-REVIEW-004 | Delete Review | Review can be deleted with confirmation | | Functional | Manual | | | 1. Navigate to /reviews<br>2. Click delete on a review<br>3. Confirm deletion<br>4. Verify review removed | Test confirmation dialog |

### TC-REVIEW-005: Delete Admin Reply
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-REVIEW-005 | Delete Admin Reply | Admin reply can be deleted | | Functional | Manual | | | 1. Navigate to /reviews<br>2. Click delete on a reply<br>3. Confirm deletion<br>4. Verify reply removed | Check reply disappears |

---

## 9. Voucher Management Test Cases

### TC-VOUCHER-001: View Vouchers List
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-VOUCHER-001 | View Vouchers List | Vouchers page displays paginated list of vouchers | | Functional | Manual | | | 1. Navigate to /vouchers<br>2. Verify voucher list displays<br>3. Check voucher details | Verify status indicators |

### TC-VOUCHER-002: Add New Voucher
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-VOUCHER-002 | Add New Voucher | New voucher can be created with all fields | | Functional | Manual | | | 1. Navigate to /vouchers<br>2. Click add voucher<br>3. Fill all required fields<br>4. Submit form | Test form validation |

### TC-VOUCHER-003: Edit Voucher
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-VOUCHER-003 | Edit Voucher | Voucher details can be edited | | Functional | Manual | | | 1. Navigate to /vouchers<br>2. Click edit on a voucher<br>3. Modify voucher details<br>4. Save changes | Verify date validation |

### TC-VOUCHER-004: Delete Voucher
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-VOUCHER-004 | Delete Voucher | Voucher can be deleted with confirmation | | Functional | Manual | | | 1. Navigate to /vouchers<br>2. Click delete on a voucher<br>3. Confirm deletion<br>4. Verify voucher removed | Test confirmation dialog |

### TC-VOUCHER-005: Voucher Status Management
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-VOUCHER-005 | Voucher Status Management | Voucher status can be managed (active/expired/disabled) | | Functional | Manual | | | 1. Navigate to /vouchers<br>2. Change voucher status<br>3. Verify status updates | Check status color changes |

---

## 10. News Management Test Cases

### TC-NEWS-001: View News List
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-NEWS-001 | View News List | News page displays paginated list of news articles | | Functional | Manual | | | 1. Navigate to /news<br>2. Verify news list displays<br>3. Check news details | Verify image thumbnails |

### TC-NEWS-002: Add New News
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-NEWS-002 | Add New News | New news article can be created | | Functional | Manual | | | 1. Navigate to /news<br>2. Click add news<br>3. Fill title and content<br>4. Upload image (optional)<br>5. Submit form | Test rich text editor |

### TC-NEWS-003: Edit News
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-NEWS-003 | Edit News | News article can be edited | | Functional | Manual | | | 1. Navigate to /news<br>2. Click edit on a news article<br>3. Modify content<br>4. Save changes | Verify content updates |

### TC-NEWS-004: Delete News
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-NEWS-004 | Delete News | News article can be deleted with confirmation | | Functional | Manual | | | 1. Navigate to /news<br>2. Click delete on a news article<br>3. Confirm deletion<br>4. Verify article removed | Test confirmation dialog |

### TC-NEWS-005: News Search
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-NEWS-005 | News Search | News can be searched by title | | Functional | Manual | | | 1. Navigate to /news<br>2. Enter search term<br>3. Verify filtered results | Test search functionality |

---

## 11. Navigation & Layout Test Cases

### TC-NAV-001: Sidebar Navigation
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-NAV-001 | Sidebar Navigation | All sidebar menu items navigate to correct pages | | Functional | Manual | | | 1. Login as admin<br>2. Click each sidebar menu item<br>3. Verify correct page loads | Test all menu items |

### TC-NAV-002: Header Search
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-NAV-002 | Header Search | Global search functionality works across all data | | Functional | Manual | | | 1. Click search icon in header<br>2. Enter search term<br>3. Verify search results | Test search across products, users, orders |

### TC-NAV-003: Notifications
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-NAV-003 | Notifications | Notification bell shows notifications and allows interaction | | Functional | Manual | | | 1. Click notification bell<br>2. Verify notifications display<br>3. Test mark as read functionality | Check notification count |

### TC-NAV-004: Responsive Design
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-NAV-004 | Responsive Design | Application works correctly on different screen sizes | | Functional | Manual | | | 1. Test on desktop<br>2. Test on tablet<br>3. Test on mobile<br>4. Verify layout adapts | Test all breakpoints |

---

## 12. API Integration Test Cases

### TC-API-001: API Authentication
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-API-001 | API Authentication | API requests include proper authentication headers | | Integration | Automatic | | | 1. Monitor network requests<br>2. Verify Authorization headers<br>3. Check token expiration handling | Use browser dev tools |

### TC-API-002: API Error Handling
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-API-002 | API Error Handling | Application handles API errors gracefully | | Integration | Manual | | | 1. Simulate network errors<br>2. Test invalid responses<br>3. Verify error messages display | Test various error scenarios |

### TC-API-003: Data Loading States
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-API-003 | Data Loading States | Loading indicators display during API calls | | Integration | Manual | | | 1. Navigate between pages<br>2. Perform actions that trigger API calls<br>3. Verify loading states | Check for loading spinners |

---

## 13. Performance Test Cases

### TC-PERF-001: Page Load Performance
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-PERF-001 | Page Load Performance | Pages load within acceptable time limits | | Performance | Manual | | | 1. Measure page load times<br>2. Test with different data volumes<br>3. Verify performance metrics | Use browser dev tools |

### TC-PERF-002: Image Loading Performance
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-PERF-002 | Image Loading Performance | Product images load efficiently | | Performance | Manual | | | 1. Navigate to products page<br>2. Monitor image loading times<br>3. Check for lazy loading | Verify image optimization |

---

## 14. Security Test Cases

### TC-SEC-001: Token Security
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-SEC-001 | Token Security | Authentication tokens are handled securely | | Security | Manual | | | 1. Check token storage method<br>2. Verify token expiration<br>3. Test token refresh | Review localStorage usage |

### TC-SEC-002: Input Validation
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-SEC-002 | Input Validation | All user inputs are properly validated | | Security | Manual | | | 1. Test form inputs with invalid data<br>2. Try SQL injection attempts<br>3. Test XSS prevention | Test various input scenarios |

### TC-SEC-003: Authorization Checks
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-SEC-003 | Authorization Checks | Only admin users can access admin features | | Security | Manual | | | 1. Try accessing admin pages without login<br>2. Test with non-admin user<br>3. Verify proper redirects | Test access control |

---

## 15. Browser Compatibility Test Cases

### TC-BROWSER-001: Chrome Compatibility
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-BROWSER-001 | Chrome Compatibility | Application works correctly in Chrome | | Compatibility | Manual | | | 1. Test all features in Chrome<br>2. Verify no console errors<br>3. Check responsive design | Test latest Chrome version |

### TC-BROWSER-002: Firefox Compatibility
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-BROWSER-002 | Firefox Compatibility | Application works correctly in Firefox | | Compatibility | Manual | | | 1. Test all features in Firefox<br>2. Verify no console errors<br>3. Check responsive design | Test latest Firefox version |

### TC-BROWSER-003: Safari Compatibility
| ID | Title | Expected Result | Actual Result | Run Type | Manual/Automatic | Test By | Date Started | Steps | Notes |
|----|-------|----------------|---------------|----------|------------------|---------|--------------|-------|-------|
| TC-BROWSER-003 | Safari Compatibility | Application works correctly in Safari | | Compatibility | Manual | | | 1. Test all features in Safari<br>2. Verify no console errors<br>3. Check responsive design | Test latest Safari version |

---

## Test Execution Summary

### Test Categories:
- **Functional Tests**: 45 test cases
- **Integration Tests**: 3 test cases  
- **Performance Tests**: 2 test cases
- **Security Tests**: 3 test cases
- **Compatibility Tests**: 3 test cases

### Total Test Cases: 56

### Priority Levels:
- **High Priority**: Authentication, CRUD operations, Security
- **Medium Priority**: Performance, UI/UX, Navigation
- **Low Priority**: Browser compatibility, Edge cases

### Automation Potential:
- **Automatic**: API tests, Performance tests
- **Manual**: UI tests, User experience tests, Security tests

### Estimated Testing Time:
- **Manual Testing**: 8-10 hours
- **Automated Testing**: 2-3 hours
- **Total**: 10-13 hours

---

## Notes for Test Execution:

1. **Prerequisites**: 
   - Backend server running on localhost:3000
   - Test database with sample data
   - Admin user account created

2. **Test Environment**:
   - Modern web browser (Chrome/Firefox/Safari)
   - Stable internet connection
   - Browser developer tools enabled

3. **Test Data**:
   - Use existing test data or create new test data as needed
   - Document any test data created during testing

4. **Bug Reporting**:
   - Document actual results vs expected results
   - Include screenshots for UI issues
   - Note browser version and OS for compatibility issues

5. **Regression Testing**:
   - Re-run critical test cases after bug fixes
   - Focus on areas where changes were made 