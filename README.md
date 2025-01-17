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
    "user_id": "user_id",
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

- **Endpoint**: `/profile`
- **Method**: `GET`
- **Success Response**:
  ```json
  {
    "Profile": {
      "user_id": "string",
      "Username": "string",
      "Email": "string",
      "auth_method": "string"
    }
  }
  ```

### Update Password

- **Endpoint**: `/profile/password`
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

- **Endpoint**: `/wallet/`
- **Method**: `GET`
- **Success Response**:
  ```json
  {    
      {
        "id": "number",
        "user_id": "number",
        "name": "string",
        "balance": "number",
        "created_at": "date"
      },
      {
        "id": "number",
        "user_id": "number",
        "name": "Bank string",
        "balance": "number",
        "created_at": "date"
      }
  }
  ```

### Show Wallet Details

- **Endpoint**: `/wallet/:wallet_id/detail`
- **Method**: `GET`
- **Success Response**:
  ```json
  {
    "name": "string",
    "balance": "number"
  }
  ```

### Add Wallet

- **Endpoint**: `/wallet`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "wallet_name": "string",
    "balance": "number"
  }
  ```
- **Success Response**:
  ```json
  {
    "message": "Wallet added successfully"
  }
  ```

### Edit Wallet

- **Endpoint**: `/wallet/:wallet_id`
- **Method**: `PATCH`
- **Request Body**:
  ```json
  {
    "wallet_name": "string"
  }
  ```
- **Success Response**:
  ```json
  {
    "message": "Wallet update successfully"
  }
  ```

### Delete Wallet

- **Endpoint**: `/wallet/:wallet_id`
- **Method**: `DELETE`
- **Success Response**:
  ```json
  {
    "message": "Wallet successfully deleted",
  }
  ```

---

## Transaction Management

### Get User Transactions

- **Endpoint**: `/transactions`
- **Method**: `GET`
- **Success Response**:
  ```json
  {
      {
          "transaction_id": "number",
          "transaction_date": "string",
          "amount": "number",
          "category_name": "string",
          "wallet_name": "string",
          "description": "string",
          "type": "string"
      },
      {
          "transaction_id": "number",
          "transaction_date": "string",
          "amount": "number",
          "category_name": "string",
          "wallet_name": "string",
          "description": "string",
          "type": "string"
      },
  }
  ```

### Get Transaction Details

- **Endpoint**: `/transactions/:transaction_id/detail`
- **Method**: `GET`
- **Success Response**:

  ```json
  {
    {
        "transaction_date": "string",
        "amount": "number",
        "category_name": "string",
        "wallet_name": "string",
        "description": "string"
    }
  }

  ```

### Add Income Transaction

- **Endpoint**: `/transactions/income`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "wallet_name": "string",
    "category_name": "string",
    "transaction_date": "date",
    "amount": "number",
    "description": "string"
  }
  ```

### Add Expense Transaction

- **Endpoint**: `/transactions/expense`
- **Method**: `POST`
- **Request Body**: Same as Income Transaction.

### Update Transaction

- **Endpoint**: `/transactions/:transaction_id/income` or `/expense`
- **Method**: `PUT`
- **Request Body**: Same as Add Transaction.
- **Success Response**:
  ```json
  {
    "message": "Transaction update successfully"
  }
  ```

### Delete Transaction

- **Endpoint**: `/transactions/:transaction_id`
- **Method**: `DELETE`
- **Success Response**:
  ```json
  {
    "message": "Transaction successfully deleted"
  }
  ```

### Monthly Reports

- **Endpoint**: `/transactions/monthly`
- **Method**: `GET`
- **Success Response**:
  ```json
  {
      {
        "month": "date",
        "total_income": "number",
        "total_expense": "number",
        "net_balance": "number"
      }    
  }
  ```

---

## Category Management

### Get User Categories

- **Endpoint**: `/category/:type`
- **Method**: `GET`
- **Parameters**: `type`: "income" or "expense"
- **Success Response**:
  ```json
  {
    {
      "id": "number",
      "name": "string",
      "type": "string"
    },
    {
      "id": "number",
      "name": "string",
      "type": "string"
    }
  }
  ```

### Get Category Details

- **Endpoint**: `/category/:category_id/detail`
- **Method**: `GET`
- **Success Response**:
  ```json
  {
    "name": "Transport"
  }
  ```

### Add Income Category

- **Endpoint**: `/category/income`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "category_name": "string"
  }
  ```

### Add Expense Category

- **Endpoint**: `/category/expense`
- **Method**: `POST`
- **Request Body**: Same as Income Category.
- **Success Response**:
  ```json
  {
    "message": "Category added successfully"
  }
  ```

### Edit Category

- **Endpoint**: `/category/:category_id`
- **Method**: `PATCH`
- **Request Body**:
  ```json
  {
    "category_name": "string"
  }
  ```
- **Success Response**:
  ```json
  {
    "message": "Category update successfully"
  }
  ```

### Delete Category

- **Endpoint**: `/category/:category_id`
- **Method**: `DELETE`
- **Success Response**:
  ```json
  {
    "message": "Category successfully deleted"
  }
---

## Budget Management

### Weekly Report

- **Endpoint**: `/weekly`
- **Method**: `GET`
- **Success Response**:
  ```json
  {
    "budgets": [
      {
        "category_id": "number",
        "category_name": "string",
        "limit_amount": "number",
        "total_amount": "number",
        "remaining_budget": "number"
      }
    ]
  }
  ```

### Monthly Report

- **Endpoint**: `/monthly`
- **Method**: `GET`
- **Success Response**:
  ```json
  {
    "budgets": [
      {
        "category_id": "number",
        "category_name": "string",
        "limit_amount": "number",
        "total_amount": "number",
        "remaining_budget": "number"
      },
      {
        "category_id": "number",
        "category_name": "string",
        "limit_amount": "number",
        "total_amount": "number",
        "remaining_budget": "number"
      }
    ]
  }
  ```

### Annually Report

- **Endpoint**: `/annually`
- **Method**: `GET`
- **Success Response**:
  ```json
  {
    "budgets": [
      {
        "category_id": "number",
        "category_name": "string",
        "limit_amount": "number",
        "total_amount": "number",
        "remaining_budget": "number"
      },
      {
        "category_id": "number",
        "category_name": "string",
        "limit_amount": "number",
        "total_amount": "number",
        "remaining_budget": "number"
      }
    ]
  }
  ```

### Edit Budget

- **Endpoint**: `/:category_id`
- **Method**: `PATCH`
- **Request Body**:
  ```json
  {
    "limit_amount": "number"
  }
  ```
- **Success Response**:
  ```json
  {
    "message": "Limit Amount successfully set"
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
