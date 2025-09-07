# CRM Mini App - MongoDB Schema Diagram


## Collections

| users         | customers         | leads                |
|---------------|------------------|----------------------|
| _id           | _id              | _id                  |
| name          | name             | customerId (FK)      |
| email         | email            | title                |
| passwordHash  | phone            | description          |
| role          | company          | status               |
|               | ownerId (User._id FK) | value           |
|               |                  | createdAt            |

## Relationships

users._id ──┬─▶ customers.ownerId
            │
            └─────────────▶ leads.customerId
customers._id ────────────▶ leads.customerId

* users (Admin/User) can own many customers (ownerId)
* customers can have many leads (customerId)


- **users**: Registered users (Admin/User)
- **customers**: Each customer belongs to a user (ownerId)
- **leads**: Each lead is linked to a customer (customerId)

> You can visualize this diagram using a Mermaid live editor or compatible Markdown viewer.
