# Kalpas Library Server

Kalpas Library Server is the backend service for managing library-related functionalities such as book listings, member management, book lending, and returns. Built using Node.js and Express, this server handles the core operations required for running a digital library system.

## Features

- **Book Management**: Add, update, delete, and retrieve information about books.
- **Member Management**: Manage library members and their details.
- **Book Lending**: Track borrowed books, due dates, and return statuses.
- **Authentication**: Secure access for administrators and members.
  
## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building the REST API.
- **MongoDB**: NoSQL database for managing data.
- **JWT (JSON Web Tokens)**: For secure authentication.
- **Mongoose**: MongoDB ORM for managing data models.

## Installation

To get the server up and running on your local machine, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Jaseel-Thalikulam/Kalpas_Library_Server.git
``

2. Navigate to the project directory:

```bash
cd Kalpas_Library_Server
```

3. Install the dependencies:

```bash
npm install
```

4. Set up the environment variables:

```bash
# Server Configuration
PORT=4000
CLIENT_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/kalpas_library?retryWrites=true&w=majority

# Twilio API Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Firebase Configuration
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_SERVICE_ACCOUNT_BASE_64=your_firebase_service_account_key_base64

```

5. Start the server:

```bash
npm run dev
```
