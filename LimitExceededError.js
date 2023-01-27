class LimitExceededError extends Error {
    constructor () {
        super();

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    
        this.code = 'LIMIT_EXCEEDED';
    }
}
module.exports = LimitExceededError;