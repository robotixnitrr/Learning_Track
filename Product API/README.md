# Reimplement Express API

This project is a implementation of a simple Express API that allows managing products with authentication, rate limiting, logging, and validation.

## Steps to Implement

### 1. Setup the Project
- Initialize a new Node.js project: `npm init -y`
- Install required dependencies:  
  ```sh
  npm install express dotenv zod fs path
  ```
- Create a `.env` file and add:
  ```env
  PORT=5000
  API_KEY=your-secret-key
  ```

### 2. Setup Express Server
- Create an `index.js` file
- Import required modules (`express`, `dotenv`, `fs`, `path`, `zod`)
- Initialize `express` and configure it to parse JSON requests
- Start the server with `app.listen(PORT, () => {...})`

### 3. Implement Middleware
- **Authentication Middleware:** Checks for API key in request headers
- **Rate Limiting Middleware:** Limits requests per user per second
- **Logging Middleware:** Stores request logs in a JSON file

### 4. Define Product Schema with Zod
- Use `zod` to create a validation schema for product data
- Validate incoming request bodies for `POST`, `PUT`, and `PATCH`

### 5. Implement API Endpoints
- `GET /api/products` → Fetch all products (with optional category filter)
- `GET /api/products/:id` → Fetch a product by ID
- `POST /api/products` → Add a new product (Requires authentication)
- `PUT /api/products/:id` → Update a product (Requires authentication)
- `PATCH /api/products/:id` → Partially update a product (Requires authentication)
- `DELETE /api/products/:id` → Delete a product (Requires authentication)

### 6. Implement Error Handling Middleware
- Create a centralized error handler to send structured error responses

### 7. Test the API
- Use tools like Postman or cURL to send requests and verify functionality

### 8. Run the Server
- Start the server with:
  ```sh
  node index.js
  ```

## Additional Enhancements
- Implement a database instead of JSON file storage
- Add user authentication with JWT
- Deploy the API on a cloud platform
