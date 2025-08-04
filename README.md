# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

Bạn đã cập nhật ảnh trong thư mục `uploads/products/` nhưng ảnh sản phẩm vẫn không hiển thị trên frontend. Dưới đây là các nguyên nhân thường gặp và cách kiểm tra, khắc phục:

---

## 1. **Kiểm tra trường `image` trong dữ liệu sản phẩm**

- Ảnh chỉ hiển thị nếu trường `image` trong document sản phẩm (trong MongoDB) đúng với tên file ảnh trong thư mục `uploads/products/`.
- Nếu bạn chỉ copy ảnh vào thư mục mà không cập nhật trường `image` trong database, frontend sẽ không biết để hiển thị.

**Cách kiểm tra:**
- Vào MongoDB, kiểm tra document sản phẩm, trường `image` phải đúng tên file, ví dụ:  
  ```json
  {
    "nameProduct": "Sản phẩm A",
    "image": "ten-anh.jpg"
  }
  ```
- Nếu trường `image` là rỗng, sai tên, hoặc là đường dẫn cũ, ảnh sẽ không hiển thị.

---

## 2. **Kiểm tra đường dẫn ảnh trên frontend**

- Ở file `AllProducts.tsx`, đường dẫn ảnh được render như sau:
  ```js
  src={product.image ? `${API_URL}/uploads/products/${product.image}` : defaultImg}
  ```
- Nếu trường `image` đúng tên file, và file tồn tại trong `uploads/products/`, ảnh sẽ hiển thị.

---

## 3. **Kiểm tra API backend có trả về đúng trường `image`**

- Khi gọi API `/products`, mỗi sản phẩm phải có trường `image` đúng tên file ảnh.

---

## 4. **Kiểm tra server backend có serve static folder đúng không**

- Trong file backend (thường là `index.js` hoặc `app.js`), phải có dòng:
  ```js
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  ```
- Nếu không có, ảnh sẽ không truy cập được qua URL.

---

## 5. **Kiểm tra lỗi 404 ảnh trên trình duyệt**

- Mở tab Network, tìm request ảnh, nếu báo 404 thì:
  - Tên file ảnh trong DB không đúng với file thực tế.
  - File ảnh chưa được copy đúng vào thư mục.
  - Backend chưa serve static đúng.

---

## 6. **Kiểm tra seedData.js**

- Nếu bạn seed lại data, hãy đảm bảo trường `image` trong seed data đúng tên file ảnh mới.

---

## **Tóm lại:**

- Trường `image` trong DB phải đúng tên file ảnh.
- Ảnh phải nằm đúng trong `uploads/products/`.
- Backend phải serve static folder `/uploads`.
- Nếu seed lại data, phải cập nhật trường `image` trong file seed cho đúng.

---

**Bạn hãy kiểm tra lại các điểm trên. Nếu vẫn không được, hãy gửi ví dụ 1 document sản phẩm trong DB (hoặc file seed), tên file ảnh thực tế, và đường dẫn ảnh trên trình duyệt để mình hỗ trợ chi tiết!**
