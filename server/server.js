const app = require('./src/app');
const dotenv = require('dotenv');
dotenv.config();
const connectToDb = require('./src/db/db');
connectToDb();

app.listen(3000, () => {
    console.log('server is running at port 3000.')
})