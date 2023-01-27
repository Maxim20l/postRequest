const LimitSizeStream = require('./LimitSizeStream');
const http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer();

const setStatusResponse = (res, code, message) => {
    res.statusCode = code;
    res.end(message);
}

server.on('request', (req, res) => {
    if (req.method === 'POST') {

        const pathFile = url.parse(req.url).pathname.slice(1);
        const createFile = fs.createWriteStream(pathFile, { flags: 'wx' });
        req.on('close', () => {
            createFile.destroy();
        })
        createFile.on('error', (error) => {
            if (error.code === 'EEXIST') {
                setStatusResponse(res, 409, `file ${pathFile} exist`);
            } else {
                setStatusResponse(res, 500, 'some error');
            }
        })
        const limitSizeStream = new LimitSizeStream({ limit: 10 });
        req.pipe(limitSizeStream).pipe(createFile);
        limitSizeStream.on('error', (error) => {
            if (error.code === 'LIMIT_EXCEEDED') {
                setStatusResponse(res, 413, 'limit exceeded')
            } else {
                setStatusResponse(res, 500, 'some error')
            }
        })

        res.end()
    }


})

module.exports = server;