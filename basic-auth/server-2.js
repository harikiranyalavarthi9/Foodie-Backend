import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hostname = 'localhost';
const port = 3002;

const app = express();

app.use(morgan('dev'));
app.use(cookieParser('12345-67890-09876-54321')); // secret key

const auth = (req, res, next) => {
    console.log(req.headers);
    if (!req.signedCookies.user) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            const err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
            return;
        }
        const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const user = auth[0];
        const pass = auth[1];
        if (user === 'admin' && pass === 'password') {
            res.cookie('user', 'admin', { signed: true });
            next(); // authorized
        } else {
            const err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    } else {
        if (req.signedCookies.user === 'admin') {
            next();
        } else {
            const err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
};

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