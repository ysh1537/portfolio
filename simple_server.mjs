import http from 'http';
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Hello Node!');
});
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
