const http = require('http');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const url = require('url');
const ErrorHandling = require('./ErrorHandling');


const server = http.createServer();

server.on('request', async (req, res) => {
    try {
        const nameFile = req.url.slice(1);
        if (fs.existsSync(nameFile)) {
            throw new ErrorHandling('FILE_EXISTS');
        }
        const creatFile = fs.createWriteStream(nameFile);

        const limitSizeStream = new LimitSizeStream({ limit: 1000000 });
        limitSizeStream.pipe(creatFile);


        req.on('data', (chunk) => {
            limitSizeStream.write(chunk)
        })
        res.end('hello');
        res.on('aborted', () => [
            fs.rm(nameFile, options, (error) => {
                console.log(error);
            })
        ])
    } catch (error) {
        if (error.message === 'FILE_EXISTS') {
            res.statusCode = 409;
            res.end(`${res.statusCode}`)
        } else if (error.message === 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
            res.end(`${res.statusCode}`)
        }
    }
})

server.listen(3000);