const express = require('express');
const apirouter = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : false}))

app.use('/api/',apirouter);

app.listen(process.env.PORT || '3000', () => {
    console.log(`Server is runing on port: ${process.env.PORT || '3000'}`);
});