# Distributed Key-Value Cache Server

A simple distributed key-value cache server implemented in Node.js with user authentication. This project includes a TCP server that allows clients to connect, authenticate, and execute cache commands (`SET`, `GET`, `HAS`, `Update`, `DELETE`).

## Features

- User authentication (Login/Signup)
- In-memory key-value store per user
- Commands: `SET`, `GET`, `HAS`, `Update`, `DELETE`

## Prerequisites

- [Node.js](https://nodejs.org/) installed

## Setup

1. Clone the repository or create a new project directory:
    ```bash
    git clone https://github.com/dushyant264/Custom_Cache
    ```

2. Initialize Dependencies :
    ```bash
    npm i
    ```

## Running the Server

1. **Start the Server**:
   ```bash
   node server.js

2. **You should see**
   ```bash
   Server started at 127.0.0.1:8080

## Connecting to the Server

To interact with the server, you can use a TCP client. You can use telnet for simplicity, or any other TCP client you prefer.
1. Open a Terminal and Connect Using `telnet`:
```bash
telnet 127.0.0.1 8080
```
## Usage Examples
1. **SignUp**
```bash
   SIGNUP
   Enter username: testuser
   Enter password: testpass
   User created successfully
```

2. **Login**
```bash
  LOGIN
  Enter username: testuser
  Enter password: testpass
  Authenticated successfully

```  
3. **Set**
```bash
Set Key
Value
```
4. **Update**
 ```bash
Update Key1
newVal
```
5. **Delete**
```bash
DELETE key1
OK

