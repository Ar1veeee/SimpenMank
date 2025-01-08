# SimpenMank

## Description
**SimpenMank** is an app designed to help users efficiently track their expenses and income. With a simple interface and intuitive features, this app aims to make daily financial management easier.

---

## Key Features
- **Transaction Recording**: Add income or expense with customizable categories.
- **Transaction History**: View a complete list of past transactions.
- **Wallet Management**: Organize transactions based on wallet types.
- **Category Management**: Organize transactions based on categories.

---

## Technologies Used
- **Backend**: Node.js with Express
- **Database**: MySQL
- **Hosting**: Cloud Run
- **Authentication**: OAuth 2.0 / JWT / Accounts

---

## Installation and Setup

### Prerequisites
1. Make sure you have **Node.js** (v14 or newer) and **npm/yarn** installed on your computer.
2. A configured database.

### Installation Steps
1. Clone this repository:
    ```bash
    git clone https://github.com/username/SimpenMank.git
    cd money-tracker
    ```
2. Install dependencies:
    ```bash
    npm install
    # or if using yarn
    yarn install
    ```
3. Configure the `.env` file:
    - Copy the `.env.example` to `.env`.
    - Fill in the environment variable values such as database URL, API keys, etc.
4. Run the application:
    ```bash
    npm start
    # or
    yarn start
    ```
---

## API Documentation

## Authentication

### Google Authentication
- **Endpoint**: `/auth/google`
- **Method**: `GET`
- **Description**: Initiates Google OAuth authentication.
- **Response**: Redirects to the Google login page.

### Google Callback
- **Endpoint**: `/auth/google/callback`
- **Method**: `GET`
- **Description**: Handles Google OAuth callback.
- **Success Response**:
    ```json
    {
      "message": "Login successful",
      "UserID": "user_id",
      "user": "username",
      "token": "jwt_token"
    }
    ```
- **Error Response**: Redirects to `/login` on failure.

---

## User Authentication

### Register
- **Endpoint**: `/auth/register`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```
- **Password Requirements**:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one number
    - At least one special character
- **Success Response**:
    ```json
    {
      "message": "Registration Successfully"
    }
    ```
- **Error Response**:
    ```json
    {
      "message": "Email already exists"
    }
    ```

### Login
- **Endpoint**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
- **Success Response**:
    ```json
    {
      "message": "Login Successfully",
      "user_id": "string",
      "username": "string",
      "token": "jwt_token"
    }
    ```
- **Error Response**:
    ```json
    {
      "message": "User Not Found"
    }
    ```

---

## User Profile

### Get Profile
- **Endpoint**: `/profile/:user_id`
- **Method**: `GET`
- **Success Response**:
    ```json
    {
      "Profile": {
        "UserID": "string",
        "Username": "string",
        "Email": "string",
        "Method": "string"
      }
    }
    ```

### Update Password
- **Endpoint**: `/profile/:user_id/password`
- **Method**: `PUT`
- **Request Body**:
    ```json
    {
      "newPassword": "string"
    }
    ```
- **Success Response**:
    ```json
    {
      "message": "Update Password Successfully"
    }
    ```

---

## Wallet Management

### Show Wallets
- **Endpoint**: `/wallet/:user_id`
- **Method**: `GET`
- **Success Response**:
    ```json
    {
      "wallets": [
        {
          "user_wallets": [],
          "default_wallets": []
        }
      ]
    }
    ```

### Add Wallet
- **Endpoint**: `/wallet/:user_id`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
      "name": "string",
      "balance": number
    }
    ```
- **Success Response**:
    ```json
    {
      "message": "Wallet added successfully"
    }
    ```

---

## Transaction Management

### Get All Transactions
- **Endpoint**: `/transactions/:user_id`
- **Method**: `GET`
- **Success Response**:
    ```json
    {
      "transactions": []
    }
    ```

### Get Transaction Details
- **Endpoint**: `/transactions/:user_id/:transaction_id`
- **Method**: `GET`
- **Success Response**:
    ```json
    {
      "transactionDetail": {}
    }
    ```

### Add Income Transaction
- **Endpoint**: `/transactions/:user_id/income`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
      "wallet_name": "string",
      "category_name": "string",
      "transaction_date": "date",
      "amount": number,
      "description": "string"
    }
    ```

### Add Expense Transaction
- **Endpoint**: `/transactions/:user_id/expense`
- **Method**: `POST`
- **Request Body**: Same as Income Transaction.

### Update Transaction
- **Endpoint**: `/transactions/:user_id/:transaction_id/income` or `/expense`
- **Method**: `PUT`
- **Request Body**: Same as Add Transaction.
- **Success Response**:
    ```json
    {
      "message": "Transaction update successfully"
    }
    ```

### Delete Transaction
- **Endpoint**: `/transactions/:user_id/:transaction_id`
- **Method**: `DELETE`
- **Success Response**:
    ```json
    {
      "message": "Transaction has been successfully deleted"
    }
    ```

### Monthly Reports
- **Endpoint**: `/transactions/:user_id/monthly`
- **Method**: `GET`
- **Success Response**:
    ```json
    {
      "data": [
        {
            "month": "2025-01",
            "total_income": "1000000.00",
            "total_expense": "100000.00",
            "net_balance": "900000.00"
        }
      ]
    }
    ```

---

## Category Management

### Get Categories
- **Endpoint**: `/categories/:user_id/:type`
- **Method**: `GET`
- **Parameters**: `type`: "income" or "expense"
- **Success Response**:
    ```json
    {
      "categories": []
    }
    ```

### Add Income Category
- **Endpoint**: `/categories/:user_id/income`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
      "name": "string"
    }
    ```

### Add Expense Category
- **Endpoint**: `/categories/:user_id/expense`
- **Method**: `POST`
- **Request Body**: Same as Income Category.
- **Success Response**:
    ```json
    {
      "message": "Category added successfully"
    }
    ```

---

## System Health

### Test API
- **Endpoint**: `/test`
- **Method**: `GET`
- **Success Response**:
    ```json
    {
      "message": "API is working",
      "timestamp": "ISO_string"
    }
    ```

### Test Database
- **Endpoint**: `/test/db`
- **Method**: `GET`
- **Success Response**:
    ```json
    {
      "message": "Database connection successful"
    }
    ```
- **Error Response**:
    ```json
    {
      "message": "Database connection failed",
      "error": "error_message"
    }
    ```

---

This API provides endpoints for user authentication, profile management, wallet management, transaction tracking, and category management.



## Contributing
We welcome contributions from the community! If you would like to contribute code, please follow these steps:
1. Fork this repository.
2. Create a new feature branch: `git checkout -b feature/feature-name`.
3. Commit your changes: `git commit -m 'Add feature feature-name'`.
4. Push to your branch: `git push origin feature/feature-name`.
5. Create a pull request.

---

## Developer
[Alief Arifin Mahardiko](https://github.com/Ar1veeee)

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Contact
If you have any questions, please contact us at aliefarifin99@gmail.com or visit [Instagram](https://instagram.com/aliefarfn).
