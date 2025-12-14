import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

async function testAuth() {
  console.log('🧪 Testing NEURON Tasks Authentication\n');

  // Test 1: Login with demo account
  console.log('Test 1: Login with demo account');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'demo@neurontasks.com',
        password: 'demo123'
      })
    });
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Login successful!');
      console.log('   User:', data.user.name);
      console.log('   Email:', data.user.email);
      console.log('   Token:', data.token.substring(0, 20) + '...');
    } else {
      console.log('❌ Login failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n');

  // Test 2: Login with wrong password
  console.log('Test 2: Login with wrong password (should fail)');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'demo@neurontasks.com',
        password: 'wrongpassword'
      })
    });
    const data = await response.json();
    
    if (!data.success) {
      console.log('✅ Correctly rejected wrong password');
      console.log('   Message:', data.message);
    } else {
      console.log('❌ SECURITY ISSUE: Accepted wrong password!');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n');

  // Test 3: Login with non-existent user
  console.log('Test 3: Login with non-existent user (should fail)');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'anypassword'
      })
    });
    const data = await response.json();
    
    if (!data.success) {
      console.log('✅ Correctly rejected non-existent user');
      console.log('   Message:', data.message);
    } else {
      console.log('❌ SECURITY ISSUE: Accepted non-existent user!');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n');

  // Test 4: Register new user
  console.log('Test 4: Register new user');
  const randomEmail = `test${Date.now()}@example.com`;
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: randomEmail,
        password: 'test123'
      })
    });
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Registration successful!');
      console.log('   User:', data.user.name);
      console.log('   Email:', data.user.email);
      
      // Test 5: Login with newly registered user
      console.log('\nTest 5: Login with newly registered user');
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: randomEmail,
          password: 'test123'
        })
      });
      const loginData = await loginResponse.json();
      
      if (loginData.success) {
        console.log('✅ Login with new user successful!');
      } else {
        console.log('❌ Login with new user failed:', loginData.message);
      }
    } else {
      console.log('❌ Registration failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n✨ Authentication tests complete!\n');
}

testAuth();
