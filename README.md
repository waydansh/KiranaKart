
# 🛒 KiranaKart

**KiranaKart** is a modern full-stack grocery store application built with the **MERN stack**, featuring a user-friendly UI, an admin dashboard, category filtering, cart management, and two payment options: **online via Stripe** and **cash on delivery**.

📦 **GitHub repository**: [github.com/waydansh/KiranaKart](https://github.com/waydansh/KiranaKart)
📦 **Live Link**: [https://kirana-kart.vercel.app/](https://kirana-kart.vercel.app/)

---

## 🚀 Features

- 🧑‍💼 User authentication (Email/Password or Google OAuth via Passport.js)
- 🛠️ Profile update support
- 🛍️ Browse and filter products by category
- 🔍 Product search functionality
- 🛒 Add/remove items from the cart
- 💳 Two payment methods: **Razorpay** (online) or **Cash on Delivery**
- 📦 Admin dashboard for order and product management (WIP/future scope)
- ☁️ Image upload with **Cloudinary**

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Axios, React Router DOM
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Authentication**: Passport.js (with Google OAuth)
- **Payments**: Stripe API (with webhook support)
- **Media Hosting**: Cloudinary
- **Deployment**: Vercel (frontend), Render (or local for backend)

---

## 🧑‍💻 Getting Started Locally

Clone the repository:

```bash
git clone https://github.com/waydansh/KiranaKart.git
cd KiranaKart
```

### 1. Install Dependencies

Navigate to both `client` and `server` folders and install dependencies:

```bash
# In root folder
cd client
npm install

# In another terminal
cd server
npm install
```

### 2. Environment Variables

Create a `.env` file inside the `server` folder with the following variables:

```
MONGODB_URI=your_mongodb_uri
NODE_ENV = "development"
SELLER_EMAI=create_a_seller_email
SELLER_PASSWORD=create_a_seller_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```
Create a `.env` file inside the `client` folder with the following variables:
```
VITE_CURRENCY=your_currency
VITE_BACKEND_URL=your_backend_url
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret

```


### 3. Run the App

Start both frontend and backend in separate terminals:

```bash
# In /client
npm run dev

# In /server
npm run dev
```



## 📌 License

This project is open-source and available under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## 🙌 Author

Developed by [Vedansh Gupta](https://github.com/waydansh)