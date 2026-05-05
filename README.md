# 🧠 Smart Daily Planner

Smart Daily Planner is a modern task management web application designed to help users organize, track, and complete their daily activities efficiently.

---

## 🚀 Features

* 📅 Interactive Calendar (Month / Week / Day view)
* ✅ Create, Edit, and Delete Tasks
* 📌 Today and Upcoming Task Views
* 🏷️ Task Categories (Work, Personal, etc.)
* ✔️ Mark Tasks as Completed
* 📊 Completed Tasks Page
* 🌙 Dark / Light Mode Support
* 📱 Responsive Design

---

## 🧰 Tech Stack

* ⚛️ React.js
* 🎨 CSS / Material UI
* 📅 FullCalendar (Calendar UI)
* 🗄️ Database: Supabase (PostgreSQL)
* 🔌 REST APIs for data handling

---

## 🗄️ Database

The application uses **Supabase** to store and manage task data.

### 📌 Table: `tasks`

```sql id="7t6b3o"
id UUID PRIMARY KEY
title TEXT
category TEXT
date TIMESTAMP
time TEXT
completed BOOLEAN
created_at TIMESTAMP
```

### 📊 Functionality

* Store tasks in database
* Fetch tasks dynamically
* Update task status (completed / pending)
* Delete tasks
* Real-time data handling (optional based on setup)

---

## 📂 Project Structure

```bash id="9lj1yq"
src/
 ├── components/
 │    ├── calendar/
 │    ├── TaskItem.jsx
 │    ├── TaskForm.jsx
 │    ├── Sidebar.jsx
 │    └── ...
 ├── pages/
 │    ├── Dashboard.jsx
 │    ├── Today.jsx
 │    ├── Upcoming.jsx
 │    ├── Calendar.jsx
 │    ├── Completed.jsx
 ├── contexts/
 │    └── ThemeContext.js
```

---

## 🛠️ Installation
---
git clone https://github.com/Sanjay1771/smart-daily-planner.git 
cd smart-daily-planner 
npm install 
npm start

---

## 🎯 Key Highlights

* Clean and modern UI design
* Modular component architecture
* Efficient task management system
* Database-integrated application using Supabase

---

## 📸 Screenshots

📊 Dashboard


<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/13ad5703-9ff2-4d13-a2b8-8aebfdcdfbcc" />

📅 Today View


<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/acc7f2fd-542d-4f29-a163-7b8e86643991" />

⏳ Upcoming Tasks


<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/6f687493-c873-4c8d-81c2-61bc0ba952db" />

🗓️ Calendar View


<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/5721db32-b71f-450a-8c6b-b1ef724fdece" />

✅ Completed Tasks


<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/ec574876-0b35-4ad8-b86a-121703628f2e" />

👤 Profile


<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/2cee7497-3cf0-4030-a087-69b19660f06d" />

⚙️ Settings


<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/2cb73e4f-e11c-4bd9-ac5d-2a2476676f11" />

---

## 👨‍💻 Author

**Sanjay K**

---

## ⭐ Contribution

This project is open for improvements and enhancements.

---

## 📄 License

This project is open-source and available under the MIT License.
