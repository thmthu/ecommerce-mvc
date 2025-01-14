# Migration Script Setup and Execution Guide

This guide will help you set up and run the migration script for inserting data into MongoDB collections. Follow these steps carefully:

## 1. Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 14.x or higher recommended)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance
- A `data.json` file containing the data to be migrated (placed in the same directory as the script)

## 2. Setting Up the Environment

1. **Clone the Repository (or place the script)**
   Place the provided script file and the `data.json` file in a directory on your machine.

2. **Navigate to the Directory**
   Open a terminal and navigate to the directory containing the migration script.

   ```bash
   cd /path/to/your/migration/script
   ```

3. **Initialize the Project**
   If the `package.json` file does not exist in the directory, initialize a new Node.js project:

   ```bash
   npm init -y
   ```

## 3. Installing Dependencies

Install the required Node.js packages using the following command:

```bash
npm install mongoose fs path
```

## 4. Setting Up the MongoDB Connection String

1. **Obtain the Connection String**
   Log in to your MongoDB Atlas account or set up a local MongoDB instance. For Atlas:

   - Go to your Atlas cluster dashboard.
   - Click on "Connect" > "Connect Your Application".
   - Copy the connection string.

   Example connection string:

   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority
   ```

2. **Replace the Placeholder**
   Open the migration script file and replace the `mongoURI` value with your connection string:

   ```javascript
   const mongoURI = "YOUR_MONGO_CONNECTION"; // Replace this with your connection string
   ```

   Replace `<username>`, `<password>`, and `<database>` with your database credentials and name.

## 5. Preparing the Data File

Ensure your `data.json` file contains the correct structure. Example:

```json
{
  "Carts": [
    {
      "cart_products": [],
      "cart_count_products": 0,
      "cart_userId": "1234567890abcdef12345678"
    }
  ],
  "Customers": [
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "hashedpassword"
    }
  ],
  "Products": [
    {
      "product_name": "T-Shirt",
      "product_price": 19.99,
      "product_color": "Red",
      "product_size": "L"
    }
  ],
  "Orders": [
    {
      "userId": "1234567890abcdef12345678",
      "totalPrice": 49.99,
      "order_products": []
    }
  ],
  "Reviews": [
    {
      "product_id": "1234567890abcdef12345678",
      "email": "john.doe@example.com",
      "star": 5,
      "comment": "Great product!"
    }
  ]
}
```

## 6. Running the Script

Run the migration script using Node.js:

```bash
node your_script_name.js
```

### Expected Output

If everything is set up correctly, you should see messages similar to the following:

```plaintext
Successfully connected to MongoDB Atlas
[Array of carts data from data.json]
Inserted X carts
Inserted X customers
Inserted X products
Inserted X orders
Inserted X reviews
Migration completed successfully!
```

## 7. Troubleshooting

1. **Connection Errors**

   - Double-check your MongoDB connection string.
   - Ensure your IP is whitelisted in the MongoDB Atlas network access settings. If necessary, set it to 0.0.0.0/0.

2. **Validation Errors**

   - Verify the structure of your `data.json` file matches the schemas defined in the script.

3. **Other Issues**
   - Review the error logs printed in the terminal and fix the highlighted issues.

## 8. Post-Migration

Once the migration is complete, you can verify the data in your MongoDB database using MongoDB Compass, Atlas UI, or a MongoDB client library.

---

You are now ready to run the migration script successfully!
