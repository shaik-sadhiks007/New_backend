const http = require('http');  // importing by defaultly Cjs
// import http from 'http'; // ejs

const server = http.createServer((req,res) => {

    // req is coming from frontend
    // res means sending to frontend
    res.end('backend iadsfsfs') // end function we can write anything

})


const port = 3000

server.listen(port, () => {
    console.log('Server is running')
})
