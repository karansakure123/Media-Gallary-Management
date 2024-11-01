import express from 'express';
import connectMongoose from './db/connection.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import cardRouter from './routes/homeRoutes.js';
import loginRoutes from './routes/authRoute.js'; // Ensure this path is correct
import mediaRouter from './routes/mediaRoutes.js';
import uploadRoutes from './routes/uploadRoute.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser())

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Adjust as necessary for your front-end
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
connectMongoose();

// Routes
app.use('/api/v1/cards', cardRouter);
app.use('/auth', loginRoutes); // All routes in login.js will be prefixed with /auth
app.use('/api/v1/media', mediaRouter); // Add media routes here
app.use('/userupload', uploadRoutes); // Prefix all routes with /userupload

const port = 4100;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
