# CRM Mini App

## Data Model Overview

### User
- Represents a registered person who can log in to the CRM (Admin/User roles).
- Fields: `_id`, `name`, `email`, `passwordHash`, `role`
- A user can own multiple customers (via `ownerId`).

### Customer
- Represents a company or individual your business manages.
- Fields: `_id`, `name`, `email`, `phone`, `company`, `ownerId` (references User)
- Each customer is owned by a user.
- Each customer can have multiple leads.
- **Status:**
  - **Active:** The customer has at least one open (not "Converted" or "Lost") lead.
  - **Inactive:** The customer has no open leads (all leads are "Converted" or "Lost", or has no leads).

### Lead
- Represents a sales opportunity or deal for a customer.
- Fields: `_id`, `customerId` (references Customer), `title`, `description`, `status`, `value`, `createdAt`
- Each lead is linked to a customer.

## How They Are Connected
- **User** owns many **Customers** (via `ownerId`).
- **Customer** has many **Leads** (via `customerId`).
- **Lead** belongs to one **Customer**.

## Metrics Explained
- **Total Revenue:** Sum of `value` for all leads with status `Converted` (won deals).
- **Pipeline Revenue:** Sum of `value` for all leads that are not `Converted` or `Lost` (open opportunities).
- **Win Rate:** Percentage of leads that are `Converted` out of all leads.  
  _Formula: (Number of Converted Leads / Total Leads) * 100_

## Lead Statuses
- **new:** Fresh lead, just added to the system.
- **qualified:** Lead has been vetted and is a good fit.
- **proposal:** A proposal/quote has been sent to the lead.
- **contacted:** The lead has been contacted by your team.
- **won / converted:** The deal is closed and successful (revenue is counted).
- **lost:** The deal did not close (no revenue).

## Customer Status
- **Active:** Customer has at least one open lead (status is not `Converted` or `Lost`).
- **Inactive:** Customer has no open leads (all leads are `Converted` or `Lost`, or has no leads).

---

# Setup Instructions

## Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or cloud instance)

## 1. Clone the Repository
```
git clone https://github.com/Vivekkashyap043/crm-app.git
cd crm-app
```

## 2. Server Setup
```
cd server
npm install
```
- Create a `.env` file in the `server` folder with:
  ```
  MONGODB_URI=mongodb://localhost:27017/crm-app
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```
- Start the server:
  ```
  npm start
  ```

## 3. Client Setup
```
cd ../client
npm install
```
- Start the client:
  ```
  npm run dev
  ```
- The app will be available at `http://localhost:5173`

## 4. Usage
- Register a new user (Admin/User)
- Add customers
- Add leads for customers
- View dashboard, manage customers/leads, and see analytics in the reporting section

---

For any issues, please open an issue on the repository or contact the maintainer.
