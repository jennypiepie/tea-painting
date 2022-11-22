//HTTP

const http = require('http')
const url = require('url')
const path = require('path')

const fs = require('fs')

const server = http.createServer(handleRequest)

server.listen(8080)

console.log('Server started on port 8080');

function handleRequest(req,res) { 
    let pathname = req.url
    
    if (pathname == '/') { 
        pathname = 'index.html'
    }

    const ext = path.extname(pathname)

    const typeExt = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css'
    }

    const contentType = typeExt[ext] || 'text/plain'

    fs.readFile(__dirname + pathname, (err, data) => { 
        if (err) {
            res.writeHead(500)
            return res.end('Error loading' + pathname)
        }

        res.writeHead(200, { 'Content-Type': contentType })
        res.end(data)
    })
}

//WebSocket
const io = require('socket.io')(server)

io.sockets.on('connection', (socket) => { 
    console.log('we have a new client' + socket.id);
    
    socket.on('disconnect', () => { 
        console.log('client has disconnected');
    })
})
