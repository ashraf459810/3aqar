var app = require('express')(),
  server = require('http').createServer(app);

server.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
  