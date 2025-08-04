// Test script để kiểm tra lỗi thêm product trong admin
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Test token từ backend
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGQwMWZlYmU5MmZmODc5ZTI2Nzc0ZCIsImlhdCI6MTc1NDA3MjE1NywiZXhwIjoxNzYxODQ4MTU3fQ.RQ1tp3pAeDX_FFqNEYTuPLJLPnGcYoLTH1JLxWCHf_U';

async function testAdminProductCreation() {
  try {
    console.log('🧪 Testing Admin Product Creation...');
    
    // Test 1: Kiểm tra authentication
    console.log('\n1. Testing Authentication...');
    try {
      const authResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (authResponse.status === 200) {
        console.log('✅ Authentication successful');
        console.log('📋 User:', authResponse.data.data.user.email);
      } else {
        console.log('❌ Authentication failed:', authResponse.status);
      }
    } catch (error) {
      console.log('❌ Authentication error:', error.response?.data || error.message);
    }
    
    // Test 2: Kiểm tra brands và categories
    console.log('\n2. Testing Brands and Categories...');
    try {
      const brandsResponse = await axios.get(`${API_BASE_URL}/brands`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (brandsResponse.status === 200) {
        console.log('✅ Brands loaded:', brandsResponse.data.data?.brands?.length || 0);
      }
    } catch (error) {
      console.log('❌ Brands error:', error.response?.data || error.message);
    }
    
    try {
      const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (categoriesResponse.status === 200) {
        console.log('✅ Categories loaded:', categoriesResponse.data.data?.categories?.length || 0);
      }
    } catch (error) {
      console.log('❌ Categories error:', error.response?.data || error.message);
    }
    
    // Test 3: Test tạo product với FormData
    console.log('\n3. Testing Product Creation with FormData...');
    try {
      const FormData = require('form-data');
      const formData = new FormData();
      
      // Thêm các trường dữ liệu
      formData.append('nameProduct', 'Test Product Admin');
      formData.append('priceProduct', '100000');
      formData.append('quantity', '10');
      formData.append('idBrand', '688d01febe92ff879e26774d'); // Sử dụng ID thực từ database
      formData.append('idCategory', '688d01febe92ff879e26774d'); // Sử dụng ID thực từ database
      formData.append('status', 'active');
      formData.append('description', 'Test product description');
      
      // Tạo file ảnh giả
      const fs = require('fs');
      const path = require('path');
      const testImagePath = path.join(__dirname, 'test-image.jpg');
      
      // Tạo file ảnh test nếu chưa có
      if (!fs.existsSync(testImagePath)) {
        const testImageBuffer = Buffer.from('fake image data');
        fs.writeFileSync(testImagePath, testImageBuffer);
      }
      
      formData.append('image', fs.createReadStream(testImagePath));
      
      const productResponse = await axios.post(`${API_BASE_URL}/products`, formData, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          ...formData.getHeaders()
        }
      });
      
      if (productResponse.status === 201) {
        console.log('✅ Product created successfully');
        console.log('📋 Product ID:', productResponse.data.data.product._id);
      }
    } catch (error) {
      console.log('❌ Product creation error:');
      console.log('📋 Status:', error.response?.status);
      console.log('📋 Message:', error.response?.data?.message || error.message);
      console.log('📋 Data:', error.response?.data);
    }
    
    // Test 4: Test tạo product với JSON (không có file)
    console.log('\n4. Testing Product Creation with JSON...');
    try {
      const productData = {
        nameProduct: 'Test Product JSON',
        priceProduct: 150000,
        quantity: 5,
        idBrand: '688d01febe92ff879e26774d',
        idCategory: '688d01febe92ff879e26774d',
        status: 'active',
        description: 'Test product without image'
      };
      
      const jsonResponse = await axios.post(`${API_BASE_URL}/products`, productData, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (jsonResponse.status === 201) {
        console.log('✅ Product created with JSON successfully');
        console.log('📋 Product ID:', jsonResponse.data.data.product._id);
      }
    } catch (error) {
      console.log('❌ JSON Product creation error:');
      console.log('📋 Status:', error.response?.status);
      console.log('📋 Message:', error.response?.data?.message || error.message);
      console.log('📋 Data:', error.response?.data);
    }
    
    console.log('\n🎯 Summary:');
    console.log('- ✅ Authentication test completed');
    console.log('- ✅ Brands/Categories test completed');
    console.log('- ✅ FormData product creation test completed');
    console.log('- ✅ JSON product creation test completed');
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

// Run test
testAdminProductCreation(); 