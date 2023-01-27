const stream = require('stream');
const LimitExceededError = require('./LimitExceededError')
class LimitSizeStream extends stream.Transform {
    constructor({limit}) {
        super()
        this.limit = limit
        this.length = 0
    }
    _transform(chunk, encoding, callback) {
        this.length += chunk.length;
        if (this.length > this.limit) {
               callback(new LimitExceededError())
        } else {
            callback(null, chunk.toString('utf-8'))
        }
    }
}

module.exports = LimitSizeStream;