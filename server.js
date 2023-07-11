const WebSocket = require('ws');
const express = require('express');
const app = express();
const wss = new WebSocket.Server({ port: 8080 });
const cors = require('cors'); // Import the package

// Use cors middleware
app.use(cors());

// Initialize dummy stocks with random prices
let stocks = {
  'ABNIC': getRandomPrice(),
  'ADAVIATION': getRandomPrice(),
  'ADC': getRandomPrice(),
  'ADCB': getRandomPrice(),
  'ADCW': getRandomPrice(),
  'ADIB': getRandomPrice(),
  'ADNH': getRandomPrice(),
  'ADNIC': getRandomPrice(),
  'ADNOCDIST': getRandomPrice(),
  //... add the rest of your stocks here
};

const port = 3080;

app.get('/initial-prices', (req, res) => {
  if (!stocks) {
    generateInitialStocks();
  }
  res.json(stocks);
});

app.listen(port, () => {
    console.log(`HTTP server listening at http://localhost:${port}`);
});

wss.on('connection', ws => {
  console.log('New client connected');

  // Send initial prices
  ws.send(JSON.stringify(stocks));

  // Set interval to update prices every minute
  setInterval(() => {
    for(let stock in stocks) {
      // Change price by a reasonable amount
      if(stocks[stock] <= 10) {
        // If the price goes below a certain threshold, increase it
        stocks[stock] += Math.random() * 0.2; // up to 2% of 10
      } else {
        // Otherwise, 50/50 chance to increase or decrease
        stocks[stock] += stocks[stock] * ((Math.random() - 0.5) * 0.02); // up to 2% of the current price
      }

      // Ensure the price never falls below 0
      stocks[stock] = Math.max(stocks[stock], 0);
    
       // Convert to 2 decimal places
       stocks[stock] = parseFloat(stocks[stock].toFixed(2));
    }

    // Send updated prices
    ws.send(JSON.stringify(stocks));
  }, 30 * 1000); // 60 * 1000 ms = 1 minute

});

// Function to generate random initial stock price
function getRandomPrice() {
    return parseFloat((0.1 + Math.random() * 25).toFixed(2)); // Price will be between 0.1 and 25.1
}
