# Depi-Final-project
#  Frontend Structure Documentation

This document explains the full structure, purpose, and responsibilities of each folder and file inside the **frontend** module of the project.  
The goal is to help all team members understand how to work inside the frontend environment in an organized, scalable, and maintainable way.

---

##  2. Folder-by-Folder Explanation

###  **assets/**
Contains all static files used by the frontend:
- **images** → logos, backgrounds, illustrations  
- **icons** → SVG/PNG icons  
- **fonts** → custom font files  

---

###  **components-html/**
Contains reusable HTML blocks that will be included across multiple pages:
- `header.html` → Top navigation bar  
- `sidebar.html` → Left menu  
- `footer.html` → Footer section  
- `modal.html` → Reusable popup component  

These help maintain a DRY (Don’t Repeat Yourself) structure.

---

###  **scripts/**
The main JavaScript logic for the frontend.

####  main.js  
Loads components, initializes the app, and handles global scripts.

---

### **scripts/core/**
Core utilities used by all modules:
- `api.js` → Functions to make API requests  
- `config.js` → API base URL, constants  
- `helpers.js` → Reusable helper functions  
- `storage.js` → LocalStorage/sessionStorage handler  

---

### **scripts/services/**
Business logic that communicates with the backend API:
- `authService.js` → Login, logout  
- `rolesService.js` → CRUD for roles  
- `usersService.js` → CRUD for users  
- `categoriesService.js` → CRUD for categories  

---

### **scripts/controllers/**
Controllers connect Pages ↔ UI ↔ Services.  
Each controller manages the logic for one page:

Example:
- `loginController.js`  
- `dashboardController.js`  
- `usersController.js`  

---

### **scripts/components/**
JavaScript components that control dynamic UI parts:
- `modal.js` → Opening/closing modal  
- `dropdown.js` → Dropdown menu logic  
- `sidebar.js` → Sidebar toggling  

---

###  **styles/**
All CSS files for the project.

####  main.css  
Imports all other CSS files.

---

### **styles/base/**
Foundation styling:
- `reset.css` → Remove browser default styles  
- `variables.css` → Colors, spacing, sizes  
- `typography.css` → Fonts and text styles  

---

### **styles/layout/**
Page layout structure:
- `header.css`  
- `sidebar.css`  
- `footer.css`  

---

### **styles/components/**
Reusable UI components:
- `buttons.css`  
- `cards.css`  
- `inputs.css`  

---

### **styles/pages/**
Styling specific for each page:
- `auth.css` → login/register page  
- `dashboard.css`  
- `roles.css`  
- `users.css`  
- `categories.css`  

---

##  3. Development Workflow

1. **Switch to frontend branch**
```bash
git checkout Front_end
