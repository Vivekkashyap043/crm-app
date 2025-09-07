# CRM Mini App - MongoDB Schema Diagram

```mermaid
graph TD
  User["users\n_id\nname\nemail\npasswordHash\nrole"]
  Customer["customers\n_id\nname\nemail\nphone\ncompany\nownerId (User._id)"]
  Lead["leads\n_id\ncustomerId (Customer._id)\ntitle\ndescription\nstatus\nvalue\ncreatedAt"]

  User -->|owns| Customer
  Customer -->|has| Lead
```

- **users**: Registered users (Admin/User)
- **customers**: Each customer belongs to a user (ownerId)
- **leads**: Each lead is linked to a customer (customerId)

> You can visualize this diagram using a Mermaid live editor or compatible Markdown viewer.
