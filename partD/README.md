# Grocery Store Management System

## Overview
This project is a comprehensive management system designed for neighborhood grocery stores. It features both a **supplier interface** and a **store owner interface**, enabling order placement, and tracking.

## Features
- **Supplier Interface**:
  - Registration and login for suppliers.
  - Ability to view and confirm store orders.
  - Option to update order status.

- **Store Owner Interface**:
  - Ability to place orders with suppliers.
  - View and update the status of orders.

- **Bonus Feature (Automatic Stock Replenishment)**:
  - The system monitors stock levels.
  - When a product’s stock falls below the minimum threshold, an automatic order is placed with the supplier offering the most competitive price for that product.

## Technologies Used
- **Backend**: Node.js (`grocery-app-server`)
- **Frontend**: React (`grocery-app-client`)
- **Database**: MongoDB
- **API**: RESTful API for communication between client and server.

## How It Works
- **Supplier Login**: Suppliers can register and log in to manage their orders.
- **Order Management**: Store owners can place orders, track their status, and confirm deliveries.
- **Automatic Ordering**: The system automatically places orders with the supplier offering the best price when stock falls below the threshold.

## Setup Instructions

### Backend (Node.js - grocery-app-server)
1. Clone the repository.
2. Navigate to the `grocery-app-server` directory.
3. Run `npm install` to install the necessary dependencies.
4. Run `npm start` to start the backend server.

### Frontend (React - grocery-app-client)
1. Navigate to the `grocery-app-client` directory.
2. Run `npm install` to install the necessary dependencies.
3. Run `npm start` to launch the frontend.

## Conclusion
This system enhances the efficiency of grocery store management by automating order placement, inventory tracking, and stock replenishment, ultimately simplifying store owners' operations.
