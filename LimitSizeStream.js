const stream = require('stream');
const ErrorHandling = require('./ErrorHandling')
class LimitSizeStream extends stream.Transform {
    constructor({limit}) {
        super()
        this.limit = limit
        this.length = 0
    }
    _transform(chunk, encoding, callback) {
        this.length += chunk.length;
        console.log(this.length);
        if (this.length > this.limit) {
               throw new ErrorHandling('LIMIT_EXCEEDED')
        } else {
            callback(null, chunk.toString('utf-8'))
        }
    }
}

module.exports = LimitSizeStream;