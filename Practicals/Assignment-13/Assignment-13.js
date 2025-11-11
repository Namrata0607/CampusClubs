/**
 * Assignment-13: Express.js Request and Response Demonstration
 * 
 * Demonstrates:
 * - Creating Express server
 * - Handling different HTTP methods (GET, POST, PUT, DELETE)
 * - URL parameters and query strings
 * - Request body parsing
 * - Response methods
 * - Status codes
 * - Middleware
 */

const express = require('express');

const app = express();
const PORT = 3000;

// ============= Middleware =============
// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Custom middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ============= Example 1: GET Request - Home Route =============
app.get('/', (req, res) => {
  const response = {
    message: 'Welcome to Express.js Request & Response Demo',
    routes: {
      home: 'GET /',
      user: 'GET /user/:id',
      search: 'GET /search?query=something',
      users: 'POST /users (send JSON body)',
      profile: 'GET /profile?name=John&age=30',
      update: 'PUT /users/:id',
      delete: 'DELETE /users/:id',
      file: 'GET /file',
      redirect: 'GET /redirect-to-home',
    },
  };
  res.json(response);
});

// ============= Example 2: GET Request with URL Parameters =============
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const response = {
    message: `User Details for ID: ${userId}`,
    userId: userId,
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      department: 'Engineering',
    },
  };
  res.json(response);
});

// ============= Example 3: GET Request with Query Parameters =============
app.get('/search', (req, res) => {
  const { query, sort, limit } = req.query;
  const response = {
    message: 'Search Results',
    query: query || 'Not provided',
    sort: sort || 'default',
    limit: limit || '10',
    results: [
      { id: 1, title: 'Result 1' },
      { id: 2, title: 'Result 2' },
    ],
  };
  res.json(response);
});

// ============= Example 4: GET Request with Multiple Query Params =============
app.get('/profile', (req, res) => {
  const name = req.query.name || 'Guest';
  const age = req.query.age || 'Not specified';
  const response = {
    profile: {
      name: name,
      age: age,
      bio: 'Software Developer',
    },
  };
  res.json(response);
});

// ============= Example 5: POST Request - Create User =============
app.post('/users', (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: 'Name and email are required',
      received: req.body,
    });
  }

  const response = {
    message: 'User created successfully',
    user: {
      id: Math.floor(Math.random() * 1000),
      name: name,
      email: email,
      age: age || 'Not specified',
      createdAt: new Date().toISOString(),
    },
  };
  res.status(201).json(response);
});

// ============= Example 6: PUT Request - Update User =============
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  const response = {
    message: `User ${userId} updated successfully`,
    user: {
      id: userId,
      name: name || 'No change',
      email: email || 'No change',
      updatedAt: new Date().toISOString(),
    },
  };
  res.json(response);
});

// ============= Example 7: DELETE Request =============
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const response = {
    message: `User ${userId} deleted successfully`,
    deletedUserId: userId,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// ============= Example 8: Different Response Types =============
app.get('/file', (req, res) => {
  // Send file download
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename="data.txt"');
  res.send('This is a downloadable file from Express server');
});

// ============= Example 9: Redirect =============
app.get('/redirect-to-home', (req, res) => {
  res.redirect('/');
});

// ============= Example 10: HTML Response =============
app.get('/html', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Express Server</title>
      <style>
        body { font-family: Arial; margin: 30px; background: #f0f0f0; }
        .container { background: white; padding: 20px; border-radius: 5px; }
        a { display: block; margin: 10px 0; color: #0066cc; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Express.js Demo</h1>
        <p>Try these endpoints:</p>
        <a href="/">Home</a>
        <a href="/user/123">User with ID</a>
        <a href="/search?query=nodejs">Search</a>
        <a href="/profile?name=Alice&age=25">Profile</a>
        <a href="/html">This Page</a>
      </div>
    </body>
    </html>
  `);
});

// ============= Example 11: Error Handling - 404 Not Found =============
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.url,
    availableRoutes: [
      'GET /',
      'GET /user/:id',
      'GET /search?query=something',
      'GET /profile?name=John&age=30',
      'POST /users',
      'PUT /users/:id',
      'DELETE /users/:id',
      'GET /file',
      'GET /html',
      'GET /redirect-to-home',
    ],
  });
});

// ============= Start Server =============
app.listen(PORT, () => {
  console.log('\n✓ Express server running');
  console.log(`✓ Listening on http://localhost:${PORT}`);
  console.log('\n===== Available Endpoints =====');
  console.log(`GET http://localhost:${PORT}/ - Home page`);
  console.log(`GET http://localhost:${PORT}/user/123 - User with ID parameter`);
  console.log(`GET http://localhost:${PORT}/search?query=nodejs - Search with query`);
  console.log(`GET http://localhost:${PORT}/profile?name=Alice&age=25 - Profile with query params`);
  console.log(`GET http://localhost:${PORT}/html - HTML page`);
  console.log(`POST http://localhost:${PORT}/users - Create user (send JSON)`);
  console.log(`PUT http://localhost:${PORT}/users/1 - Update user`);
  console.log(`DELETE http://localhost:${PORT}/users/1 - Delete user`);
  console.log(`GET http://localhost:${PORT}/file - Download file`);
  console.log(`GET http://localhost:${PORT}/redirect-to-home - Redirect`);
  console.log('\n===== Example POST Request =====');
  console.log('curl -X POST http://localhost:3000/users \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"name":"John","email":"john@example.com","age":30}\'');
  console.log('\n===== Press Ctrl+C to stop =====\n');
});

// ============= Summary =====
console.log('\n===== Express.js Request & Response Demo =====');
console.log('Key Concepts:');
console.log('1. HTTP Methods - GET, POST, PUT, DELETE');
console.log('2. URL Parameters - req.params');
console.log('3. Query Strings - req.query');
console.log('4. Request Body - req.body (with middleware)');
console.log('5. Response Methods - res.json(), res.send(), res.status()');
console.log('6. Middleware - express.json(), express.urlencoded()');
console.log('7. Status Codes - 200, 201, 400, 404, etc.');
console.log('8. Routing - Different endpoints with handlers');
console.log('9. Error Handling - 404 Not Found');
console.log('10. Redirects - res.redirect()');
