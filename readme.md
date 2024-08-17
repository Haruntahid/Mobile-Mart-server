# Mobile Mart Server 📱

This is the backend server for the Mobile Mart application. It serves as the API to handle mobile phone data, including filtering, sorting, and pagination. The server is built using Node.js, Express.js, and MongoDB.

## Features

- Fetch all mobile phones with filtering and sorting options.
- Supports pagination for mobile phone listings.
- Fetch all unique brands and categories available in the database.
- CORS configuration to allow requests from specific origins.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for handling server routes.
- **MongoDB**: NoSQL database for storing mobile phone data.
- **dotenv**: For managing environment variables.
- **CORS**: Middleware to handle cross-origin requests.

## Setup and Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/mobile-mart-backend.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd mobile-mart-server
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Set up environment variables:**

   ```bash
   PORT=5000
   DB_USER=your_mongodb_username
   DB_PASS=your_mongodb_password
   ```

5. **Server will be running on**
   ```bash
   http://localhost:5000
   ```
