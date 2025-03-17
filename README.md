# Student Grocery System

## 📌 Overview
The **Student Grocery System** is a web-based application that allows students to browse and purchase groceries from various sellers. Sellers can manage their products and track completed orders. The system supports features like product management, cart functionality, order tracking, and delivery slot selection.

## 🚀 Features
### **For Students:**
- Browse available grocery items
- Add products to the cart
- Buy selected items or use "Buy Now"
- Track order history
- Select delivery slots

### **For Sellers:**
- Manage product listings (Add, Edit, Activate/Deactivate)
- Track new and completed orders
- Update order statuses

## 🏗️ Tech Stack
- **Frontend:** Next.js, React, Bootstrap, React Toastify
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT-based authentication

## 🔧 Installation & Setup
### **1. Clone the Repository**
```sh
git clone https://github.com/your-repo/student-grocery-system.git
cd student-grocery-system
```

### **2. Install Dependencies**
#### Backend
```sh
cd server
npm install
```

#### Frontend
```sh
cd client
npm install
```

### **3. Configure Environment Variables**
Create a `.env` file inside the `server/` folder and add:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### **4. Run the Application**
#### Start Backend Server
```sh
cd server
npm start
```

#### Start Frontend Client
```sh
cd client
npm run dev
```

## 📄 API Endpoints
### **Authentication**
- `POST /api/auth/login` - Login for students & sellers
- `POST /api/auth/signup` - Register new users

### **Products**
- `GET /api/products` - Fetch active products
- `PUT /api/products/:id/toggle-active` - Activate/Deactivate product

### **Cart & Orders**
- `POST /api/cart/add` - Add product to cart
- `POST /api/cart/buy-selected` - Buy selected items from cart
- `POST /api/orders/buy-now` - Instant purchase (Buy Now)
- `GET /api/orders/completed` - Fetch completed orders
- `GET /api/seller/orders/completed` - Fetch completed orders for seller

## 👥 Roles & Access
- **Students:** Browse products, add to cart, purchase, track orders
- **Sellers:** Manage products, track and update orders

## 📌 Contribution Guidelines
1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Added new feature"`)
4. Push to your branch (`git push origin feature-name`)
5. Open a pull request

## 🔥 Future Enhancements
- Payment gateway integration
- Seller dashboard analytics
- Product reviews & ratings

## 💡 License
This project is open-source under the **MIT License**.
