/**
 * Assignment-12: Node.js Web Modules Demonstration (Simple)
 * 
 * Demonstrates:
 * - HTTP module (creating basic web server)
 * - URL module (parsing URLs)
 * - Query string module (parsing query parameters)
 */

const http = require('http');
const url = require('url');
const querystring = require('querystring');

// ============= Example 1: URL Parsing =============
console.log('===== Example 1: URL Parsing =====');

const testUrls = [
  'http://example.com:8080/path?id=123&name=John',
  'https://api.github.com/users?page=1&limit=10',
  '/greet?greeting=hello&name=Alice',
];

testUrls.forEach((testUrl) => {
  const parsed = url.parse(testUrl, true);
  console.log(`\nURL: ${testUrl}`);
  console.log('  Pathname:', parsed.pathname);
  console.log('  Query:', JSON.stringify(parsed.query));
});

// ============= Example 2: Query String Parsing =============
console.log('\n===== Example 2: Query String Parsing =====');

const queryStrings = [
  'id=123&name=John&email=john@example.com',
  'search=nodejs&filter=tutorials',
  'color=red&color=blue&color=green',
];

queryStrings.forEach((qs) => {
  const parsed = querystring.parse(qs);
  console.log(`\nQuery String: ${qs}`);
  console.log('Parsed:', JSON.stringify(parsed));
});

// ============= Example 3: Building URLs =============
console.log('\n===== Example 3: Building URLs =====');

const urlObj = {
  protocol: 'https:',
  host: 'api.example.com',
  pathname: '/users',
};

const builtUrl = url.format(urlObj);
console.log('Built URL:', builtUrl);

// ============= Example 4: Simple HTTP Server =============
console.log('\n===== Example 4: Simple HTTP Server =====');

const PORT = 3000;
const HOST = 'localhost';

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`\nRequest: ${req.method} ${req.url}`);

  res.setHeader('Content-Type', 'application/json');

  if (pathname === '/') {
    const response = {
      message: 'Welcome to Node.js Web Server',
      endpoints: [
        'GET /user?id=1&name=John',
        'GET /greet?name=Alice',
        'GET /api/users',
      ],
    };
    res.writeHead(200);
    res.end(JSON.stringify(response, null, 2));
  } else if (pathname === '/user') {
    const response = {
      route: '/user',
      userId: query.id || 'Not provided',
      userName: query.name || 'Not provided',
    };
    res.writeHead(200);
    res.end(JSON.stringify(response, null, 2));
  } else if (pathname === '/greet') {
    const name = query.name || 'Guest';
    const response = {
      message: `Hello, ${name}! Welcome to Node.js`,
      timestamp: new Date().toISOString(),
    };
    res.writeHead(200);
    res.end(JSON.stringify(response, null, 2));
  } else if (pathname === '/api/users') {
    const response = {
      users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ],
    };
    res.writeHead(200);
    res.end(JSON.stringify(response, null, 2));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found', path: pathname }));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`\n✓ Server running on http://${HOST}:${PORT}`);
  console.log('\nTry these URLs:');
  console.log(`  http://${HOST}:${PORT}/`);
  console.log(`  http://${HOST}:${PORT}/user?id=1&name=John`);
  console.log(`  http://${HOST}:${PORT}/greet?name=Alice`);
  console.log(`  http://${HOST}:${PORT}/api/users`);
  console.log('\nPress Ctrl+C to stop\n');
});

// ============= Summary =====
console.log('\n===== Summary =====');
console.log('Key Web Modules:');
console.log('1. HTTP module - Create web servers');
console.log('2. URL module - Parse URLs');
console.log('3. Query string - Parse query parameters');
console.log('\n---');
