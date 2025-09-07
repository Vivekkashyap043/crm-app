# CRM Mini App - MongoDB Schema Diagram

```mermaid
graph TD
  User["users\n- _id\n- name\n- email\n- passwordHash\n- role"]
  Customer["customers\n- _id\n- name\n- email\n- phone\n- company\n- ownerId (User._id)"]
  Lead["leads\n- _id\n- customerId (Customer._id)\n- title\n- description\n- status\n- value\n- createdAt"]

  User --|owns| Customer
  Customer --|has| Lead
```

- **users**: Registered users (Admin/User)
- **customers**: Each customer belongs to a user (ownerId)
- **leads**: Each lead is linked to a customer (customerId)

> You can visualize this diagram using a Mermaid live editor or compatible Markdown viewer.
