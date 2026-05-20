const axios = require('axios');

async function testAPI() {
  const baseURL = 'http://localhost:3000';
  
  try {
    console.log('Testing Website Audit API...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test audit endpoint with a simple website
    console.log('\n2. Testing audit endpoint...');
    const auditResponse = await axios.post(`${baseURL}/audit`, {
      url: 'https://example.com'
    });
    
    console.log('✅ Audit completed successfully!');
    console.log('URL:', auditResponse.data.url);
    console.log('Status:', auditResponse.data.status);
    console.log('Summary:');
    console.log(`  - Issues: ${auditResponse.data.summary.totalIssues}`);
    console.log(`  - Warnings: ${auditResponse.data.summary.totalWarnings}`);
    console.log(`  - Passed: ${auditResponse.data.summary.totalPassed}`);
    console.log('Recommendations:');
    auditResponse.data.summary.recommendations.forEach(rec => {
      console.log(`  - ${rec}`);
    });
    
    console.log('\n🎉 All tests passed! The API is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testAPI(); 