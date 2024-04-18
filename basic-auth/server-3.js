import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FileStore = sessionFileStore(session);
const hostname = 'localhost';
const port = 3001;
const app = express();

app.use(morgan('dev'));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: true,
  resave: true,
  store: new FileStore()
}));

const auth = (req, res, next) => {
    console.log(req.headers);
    if (!req.session.user) {
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
            req.session.user = 'admin';
            next(); // authorized
        } else {
            const err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
    else {
        if (req.session.user === 'admin') {
            console.log('req.session: ',req.session);
            next();
        }
        else {
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
