import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
// import bodyParser from 'body-parser';
import cors from 'cors';
// import morgan from 'morgan';
// import helmet from 'helmet';
// import { notFound, errorHandler } from './middleware';
// import mainRouter from './routes';
// import './routes/auth/auth';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.DEV_CLIENT_ORIGIN, process.env.PROD_CLIENT_ORIGIN],
    },
});

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(morgan('dev'));
// app.use(helmet());
app.use(cors());
// app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'Server Online' });
});

// app.use('/api', mainRouter);

// app.use(notFound);
// app.use(errorHandler);

const userMap = new Map();
io.on('connection', (socket) => {});

export default server;
