import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { notFound, errorHandler } from './middleware';
// import mainRouter from './routes';
import './routes/auth/auth';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'Server Online' });
});

// app.use('/api', mainRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
