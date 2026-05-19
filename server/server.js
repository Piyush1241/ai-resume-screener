const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectMongo = require('./config/mongo');
const { connectPostgres } = require('./config/postgres');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://ai-resume-screener-nu.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

connectMongo();
connectPostgres();

app.use('/api/auth',    require('./routes/authRoutes'));
app.use('/api/jobs',    require('./routes/jobRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/score',   require('./routes/scoreRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));