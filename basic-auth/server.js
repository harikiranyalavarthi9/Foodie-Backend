import express from 'express';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hostname = 'localhost';
const port = 3001;

const app = express();

app.use(morgan('dev'));

const auth = (req, res, next) => {
    console.log(req.headers);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        const err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
    }

    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];
    if (user === 'admin' && pass === 'password') {
        return next(); // authorized
    } else {
        const err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
    }
}

app.use(auth);

app.use(express.static(`${__dirname}/public`));

app.use((err, req, res, next) => {
    res.writeHead(err.status || 500, {
        'WWW-Authenticate': 'Basic',
        'Content-Type': 'text/plain'
    });
    res.end(err.message);
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
