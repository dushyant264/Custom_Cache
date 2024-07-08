const net= require('net')
const readline= require('readline')
const UserStore= require('./User_Store')
const { read } = require('fs')

// server class

class Server{
    constructor(address){
        this.address= address
        this.userStore= new UserStore()
        this.server= net.createServer((socket)=>this.handleConn(socket))
    }

    // start 
    start(){
        this.server.listen(this.address,()=>{
            console.log(`server started at ${this.address.host}:${this.address.port}`)
        })
    }

    // handle conn
    
handleConn(socket) {
    console.log(`new client connected ${socket.remoteAddress}`);
    socket.write('Login or SignUp\n');
    
    // interface cmd
    const cli = readline.createInterface({
        input: socket,
        output: socket,
        terminal: false
    });

    let currentUser = null;
    let authenticated = false; // initial states

    // function to handle authentication
    const authenticate = (line) => {
        const authType = line.trim().toUpperCase();
        
        if (authType === 'LOGIN') {   // trying to login
            socket.write('Enter username: ');
            
            cli.once('line', (username) => {
                username = username.trim();
                
                if (this.userStore.isUserExisting(username)) { // user exists
                    socket.write('Enter Password: ');
                    
                    cli.once('line', (password) => {
                        password = password.trim();
                        
                        if (this.userStore.isCorrPass(username, password)) { // correct password
                            socket.write(`User ${username} Authenticated\n`);
                            authenticated = true;
                            currentUser = username;
                            cli.on('line', (line) => this.handleCMD(currentUser, line, socket)); // ready for cache commands
                        } else {
                            socket.write('Invalid password. Try again\n');  // incorrect password
                            authenticate('LOGIN'); // retry authentication
                        }
                    });
                } else {
                    socket.write('Invalid username. Try again\n'); // user not found
                    authenticate('LOGIN'); // retry authentication
                }
            });
        } else if (authType === 'SIGNUP') { // trying to signup
            socket.write('Enter username: ');
            
            cli.once('line', (username) => {
                username = username.trim();
                
                if (this.userStore.isUserExisting(username)) { // user already exists
                    socket.write('Username already exists. Try login\n');
                    authenticate('LOGIN'); // retry authentication
                } else {
                    socket.write('Enter password: '); // new user
                    cli.once('line', (password) => {
                        password = password.trim();
                        this.userStore.setNewUser(username, password);
                        socket.write(`User ${username} created\n`);
                        currentUser = username;
                        authenticated = true;
                        cli.on('line', (line) => this.handleCMD(currentUser, line, socket)); // ready for cache commands
                    });
                }
            });
        } else {
            socket.write('Invalid command. Write either Login or SignUp\n');
            authenticate(''); // retry authentication
        }
    };

    // initiate authentication process
    cli.once('line', authenticate);
}

// handle input
handleCMD(currentUser, command, socket) {
    const inputs = command.trim().split(' ');

    if (inputs.length < 2) { // improper command
        socket.write('Invalid command. Try again\n');
        return;
    }

    const cmd = inputs[0].toUpperCase();
    const key = inputs[1];
    let val; // declare val outside if block

    if (inputs.length > 2) {
        val = inputs.slice(2).join(' '); // join remaining inputs as val
    }

    const userCache = this.userStore.getCache(currentUser);

    // switch case for commands
    switch (cmd) {
        case 'GET':
            if (userCache.has(key)) {
                socket.write(`${key}:${userCache.get(key)}\n`);
            } else {
                socket.write(`Key ${key} not found\n`);
            }
            break;

        case 'SET':
            if (inputs.length < 3) {
                socket.write('Invalid command. Try again\n');
                return;
            }
            userCache.set(key, val);
            socket.write(`Key ${key} set to ${val}\n`);
            break;

        case 'HAS':
            socket.write(userCache.has(key) + '\n');
            break;

        case 'UPDATE':
            if (inputs.length < 3) {
                socket.write('Invalid command. Try again\n');
                return;
            }
            userCache.update(key, val);
            socket.write(`Key ${key} updated to ${val}\n`);
            break;

        case 'DELETE':
            if (userCache.delete(key)) {
                socket.write(`Key ${key} deleted\n`);
            } else {
                socket.write(`Key ${key} not found\n`);
            }
            break;

        default:
            socket.write('Invalid command. Try again\n');
            break;
    }
}
}

// Server class initialization and start
const server = new Server({ host: '127.0.0.1', port: 8000 });
server.start();
