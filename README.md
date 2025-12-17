# WebSocket Chat - Serverless & Node.js

Real-time chat application built with **Clean Architecture** principles, running on **AWS Lambda**, **API Gateway (WebSockets)**, and **DynamoDB**.

## 📋 Project Summary
This project acts as a scalable backend for a real-time chat service. It manages WebSocket connections, broadcasts messages, and handles user authorization via JWT. The infrastructure is fully serverless, ensuring low cost and high scalability.

Key Features:
- **Real-time Messaging:** WebSockets for instant bidirectional communication.
- **Broadcasting:** Messages sent by one user are broadcast to all connected clients.
- **Security:** JWT-based authorization for connection establishment and actions.
- **Scalability:** Built on AWS serverless primitives (Lambda, DynamoDB).

## 🏗 Architecture
The project follows **Clean Architecture** to ensure separation of concerns and testability.

### Layers
1.  **Domain**: Core business logic and entities. Independent of external frameworks.
    -   *Use Cases*: `Connect`, `Authorize`, `SendMessage`, `Broadcast`.
    -   *Interfaces*: `ConnectionRepository`, `MessageGateway`.
2.  **Infrastructure**: Implementation of interfaces and external adapters.
    -   *DB*: DynamoDB implementation of `ConnectionRepository`.
    -   *Gateways*: API Gateway management for sending messages.
3.  **Presentation**: Entry points (driving adapters).
    -   *Handlers*: Lambda functions (`connection-handler`, `send-message-handler`, etc.) that parse events and call Use Cases.
4.  **Shared**: Common utilities (Logger, etc.).

### Stack
-   **Runtime**: Node.js 20.x
-   **Framework**: Serverless Framework v4
-   **Cloud Provider**: AWS
    -   *Compute*: Lambda
    -   *API*: API Gateway (WebSocket API)
    -   *Database*: DynamoDB
-   **Testing**: Jest (Unit Tests & Coverage)

## 🧪 Test Coverage
The project maintains high standards for code quality through comprehensive unit tests.

**Current Coverage Thresholds:**
| Metric     | Threshold |
|------------|-----------|
| Statements | **90%**   |
| Lines      | **90%**   |
| Functions  | **80%**   |
| Branches   | **69%**   |

To run tests and check coverage:
```bash
npm run test:coverage
```

## 🚀 Push Policy (Git Hooks)
To ensure stability, this repository enforces quality checks before any code is pushed.

**Criteria for successful push:**
1.  **Tests Must Pass**: All unit tests must execute without errors.
2.  **Coverage Met**: The code coverage must meet or exceed the thresholds defined above.

**Mechanism:**
-   **Husky** manages the git hooks.
-   A `.husky/pre-push` hook triggers `npm run test:coverage`.
-   If tests fail or coverage drops, the push is **rejected**.

---

## 🛠 Installation & Usage

### Prerequisites
- Node.js v20+
- Serverless Framework (`npm i -g serverless`)
- AWS CLI configured

### Setup
1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Deploy:
    ```bash
    serverless deploy
    ```
3.  Connect via WebSocket Client (e.g., `wscat`):
    ```bash
    wscat -c wss://your-api-url.com/dev -H "Authorization: <JWT_TOKEN>"
    ```

### Generate Test Token
```bash
node -e "
const jwt = require('jsonwebtoken');
console.log(jwt.sign(
  { sub: '123', name: 'Dev User', roles: ['admin'] },
  'SECRET,
  { algorithm: 'HS256' }
));
"
```
