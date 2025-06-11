const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>tao la hacker</h1>');
});

server.listen(3000, () => {
  console.log('Server running at http://hoasen.edu.vn');
});
