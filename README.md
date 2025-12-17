# Serverless WebSocket Chat

This project is a real-time chat application built using the [Serverless Framework](https://www.serverless.com/), running on AWS Lambda, API Gateway (WebSockets), and DynamoDB.

## Features

-   **Connect/Disconnect**: Automatically manages connection IDs in DynamoDB.
-   **Broadcast Messages**: Sends messages to all connected clients.
-   **Serverless**: Fully serverless architecture (pay-per-use).

## Architecture

-   **AWS Lambda**: Node.js functions for handling WebSocket events (`$connect`, `$disconnect`, `$default`, `sendMessage`).
-   **AWS API Gateway**: WebSocket API entry point.
-   **AWS DynamoDB**: Stores active connection IDs (`chatIdTable`).

## Prerequisites

-   Node.js (v20.x or later)
-   Serverless Framework v4 (`npm install -g serverless`)
-   AWS CLI configured with appropriate permissions.

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd websockets-chat
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Deployment

Deploy the stack to AWS:

```bash
serverless deploy
```

After deployment, you will receive a WebSocket Endpoint URL (e.g., `wss://xxxxxx.execute-api.us-east-1.amazonaws.com/dev`).

## Usage

You can use `wscat` (included in dev dependencies) or any WebSocket client to test the application.

### 1. Connect

```bash
wscat -c wss://<your-api-id>.execute-api.us-east-1.amazonaws.com/dev
```

### 2. Send a Message

To send a message to all connected clients, send a JSON payload with the action `sendMessage` and a `data` property containing your message.

```json
{
  "action": "sendMessage",
  "data": "Hello, World!"
}
```

The message "Hello, World!" will be broadcasted to all other connected clients.

## Project Structure

-   `serverless.yml`: Infrastructure as Code configuration.
-   `handler.js`: Lambda function logic.
    -   `connectionHandler`: Handles `$connect` and `$disconnect`.
    -   `sendMessageHandler`: Handles `sendMessage` route (broadcasts to all).
    -   `defaultHandler`: Handles unknown routes.


## Reference project
- youtube.com.br/watch?v=Quk_XHMvFJI


## Generate code

node -e "
const jwt = require('jsonwebtoken');
console.log(jwt.sign(
  {
    sub: '1234567890',
    name: 'Cristian Scherer',
    roles: ['admin']
  },
  'test-websocket-chat-nodejs-secret-key-20251216201822',
  { algorithm: 'HS256' }
));
"
