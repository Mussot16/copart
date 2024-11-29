const WebSocket = require("ws");
const http = require("http");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Set the countdown to 24 hours (in milliseconds)
const COUNTDOWN_DURATION = 24 * 60 * 60 * 1000;
let countdownTime = COUNTDOWN_DURATION; // Initial 24-hour countdown

// Store bids in memory (use a database in production)
let bids = [];

// Function to format time as HH:MM:SS
const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

// Broadcast a message to all connected clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Start the countdown timer
const startCountdown = () => {
  setInterval(() => {
    if (countdownTime > 0) {
      countdownTime -= 1000; // Decrease by one second
      broadcast({ type: "countdown", remainingTime: formatTime(countdownTime) });
    } else {
      clearInterval(this); // Stop the timer
      broadcast({ type: "countdown", remainingTime: "00:00:00" });
    }
  }, 1000); // Run every second
};

// Handle new WebSocket connections
wss.on("connection", (ws) => {
  console.log("Client connected");

  // Send initial data to the connected client
  ws.send(
    JSON.stringify({
      type: "init",
      remainingTime: formatTime(countdownTime),
      bids,
    })
  );

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    // Handle new bids
    if (data.type === "new_bid") {
      const newBid = {
        amount: data.amount,
        user: data.user,
        timestamp: new Date(),
      };
      bids.push(newBid); // Add to bids
      broadcast({ type: "new_bid", bid: newBid }); // Notify all clients
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
});

// Start the server on port 3002
startCountdown();
server.listen(3002, () => {
  console.log("WebSocket server running on ws://localhost:3002");
});

module.exports = { broadcast };
