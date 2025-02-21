const axios = require('axios');

// Mock payment API call with random success/failure
const mockPaymentApi = async () => {
  const shouldFail = Math.random() > 0.7; // 30% chance of success to simulate flaky API
  if (shouldFail) throw new Error('Timeout or Soft Decline');
  return { status: 200, message: 'Payment Approved' };
};

// Retry logic
const retryRequest = async (maxRetries = 3, delayMs = 1000) => {
  let attempt = 1;

  while (attempt <= maxRetries) {
    try {
      console.log(`Attempt ${attempt}: Sending payment request...`);
      const response = await mockPaymentApi();
      console.log('Success:', response.message);
      return response; // Exit on success
    } catch (error) {
      console.log(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === maxRetries) {
        console.log('Max retries reached. Giving up.');
        throw error; // Final failure
      }
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt)); // Exponential backoff
      attempt++;
    }
  }
};

// Run the retry system
retryRequest()
  .then(result => console.log('Final Result:', result))
  .catch(err => console.error('Final Error:', err.message));
