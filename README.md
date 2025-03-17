
# 🌟 **Project Documentation**
Welcome to the documentation for our shopping website "shoply"! This project is a modern, MERN-stack e-commerce application where users can browse, add items to their cart, and make purchases seamlessly. It's built with the latest web technologies to ensure a fast, secure, and user-friendly shopping experience.

Frontend: https://github.com/davariijs/E-commerce-Website-MERN-Stack-FrontEnd

Website: https://shoply-clothes.netlify.app/

---


---

## ✨ **Key Features**
1. 🖥️ **MERN-Stack Application**: Combines a React frontend and Node.js, Express.js, MongoDb backend.
2. 🔒 **Secure**: Environment variables managed through `.env` files.
3. 🔥 **Firebase Integration**: Authentication.
4. 🌐 **State Management**: Powered by Redux-Toolkit.
5. 🎨 **Modern UI**: Styled with Tailwind CSS.
6. 🚀 **TypeScript**: Ensures type safety for backend logic.

---

## 🗂️ **Folder Structure**

### 📦 **Backend**
```
📂 backend/
├── dist/                ⚙️ Compiled backend code
├── src/                 🖋️ Backend source code
│   ├── models/          📊 Database models
│   ├── routes/          🗺️ API route definitions
│   ├── types/           🔧 Types
│   └── index.ts         🏠 Entry point for the backend
├── .env                 🔑 Environment variables
├── package.json         📜 Project metadata and dependencies
├── tsconfig.json        🛠️ TypeScript configuration
```

### 📦 **Frontend**
```
frontend/
├── public/              # 🌐 Public static files
├── src/                 # 🖥️ Frontend source code
│   ├── assets/          # 🖼️ Static assets (images, icons, etc.)
│   ├── components/      # 🧩 Reusable React components
│   ├── data/            # 📊 Static or mock data
│   ├── firebase/        # 🔥 Firebase configurations
│   ├── pages/           # 📄 Page-level components
│   ├── redux/           # 🌐 State management (Redux Toolkit)
│   ├── routes/          # 🗺️ Application routes
│   ├── utils/           # 🛠️ Helper functions
│   ├── App.css          # 🎨 Application-wide styles
│   ├── App.tsx          # 🏠 Main React entry point
│   ├── index.css        # 🎨 Global styles
│   ├── store.ts         # 🌐 Redux store setup
├── .env                 # 🔑 Environment variables
├── .gitignore           # 🚫 Files ignored by Git
├── package.json         # 📜 Frontend dependencies and scripts
├── package-lock.json    # 🔒 Dependency lock file
├── README.md            # 📖 Documentation
├── tailwind.config.js   # 🎨 Tailwind CSS configuration
└── tsconfig.json        # 🛠️ TypeScript configuration
```

## ⚙️ **How to Set Up**

### 🛠️ **Backend Setup**
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file using `env.example.txt` as a template.
4. Start the development server:
   ```bash
   npm run dev
   ```

---

### 🖥️ **Frontend Setup**
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file using `env.example.txt` as a template.
4. Start the frontend server:
   ```bash
   npm start
   ```

---

## 📦 **Dependencies**

### 📡 **Backend**
- **Express**: Web framework for Node.js.
- **TypeScript**: Static typing for JavaScript.
- **Dotenv**: Environment variable management.

### 🌐 **Frontend**
- **React**: Library for building user interfaces.
- **Redux**: State management.
- **Firebase**: Backend services.
- **Tailwind CSS**: Utility-first CSS framework.

---

## 🚀 **Project Scripts**

### 📡 **Backend Scripts**
- `npm start`: Start the production server.
- `npm run dev`: Start the development server with live reload.

### 🌐 **Frontend Scripts**
- `npm start`: Start the development server.
- `npm run build`: Generate production-ready assets.

---

## 📝 **Contribution Guidelines**
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes with meaningful messages:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push your branch and create a pull request.

---