import dotenv from 'dotenv';
import app from './app.js';

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App running on http://localhost:${port}/`);
});
