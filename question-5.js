const http = require('http');

function findPowerSumCombination(res, data) {
  if (data && data.x && data.n) {
    const X = data.x;
    const N = data.n;
    const combinations = [];

    // Recursive function to find power combinations
    function findCombinationHelper(start, target, currentCombination) {
      if (target === 0) {
        combinations.push(currentCombination);
        return;
      }

      for (let i = start; Math.pow(i, N) <= target; i++) {
        const newTarget = target - Math.pow(i, N);
        const newCombination = [...currentCombination, i];

        findCombinationHelper(i + 1, newTarget, newCombination);
      }
    }

    findCombinationHelper(1, X, []);

    res.statusCode = 200;
    res.end(JSON.stringify({
      totalCombination: combinations.length,
      combinations: combinations
    }));
  } else {
    res.statusCode = 400;
    res.end(JSON.stringify({
      error: 'Require x and n value'
    }));
  }
}

const server = http.createServer((req, res) => {
  // Set response headers
  res.setHeader('Content-Type', 'application/json');
  
  // Check if the request method is POST and the URL matches
  if (req.method === 'POST' && req.url === '/services/powersum') {
    let requestBody = '';

    // Receive data in chunks
    req.on('data', (chunk) => {
      requestBody += chunk.toString();
    });

    // Process the received data when the request ends
    req.on('end', () => {
      try {
        // Parse the JSON input
        const inputData = JSON.parse(requestBody);

        // Perform any necessary processing on the input data
        findPowerSumCombination(res, inputData);
      } catch (error) {
        // JSON parsing error
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid JSON input' }));
      }
    });
  } else {
    // Invalid endpoint
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running, http://localhost:${port}`);
});
