import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;

// allow multiple origins
const allowedOrigins = ['http://localhost:5173']

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: 'http://localhost:5173', credentials: true}));


app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});