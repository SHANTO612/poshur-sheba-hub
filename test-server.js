import fetch from 'node-fetch';

async function testServer() {
  try {
    console.log('Testing server endpoints...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5000/');
    const healthData = await healthResponse.text();
    console.log('Health endpoint response:', healthData);
    
    // Test veterinarians endpoint
    const vetResponse = await fetch('http://localhost:5000/api/veterinarians');
    const vetData = await vetResponse.text();
    console.log('Veterinarians endpoint response:', vetData);
    
    // Test test endpoint
    const testResponse = await fetch('http://localhost:5000/test-veterinarians');
    const testData = await testResponse.text();
    console.log('Test veterinarians endpoint response:', testData);
    
  } catch (error) {
    console.error('Error testing server:', error);
  }
}

testServer(); 