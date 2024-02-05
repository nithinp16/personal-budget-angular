// Budget API

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const budget = {
    myBudget: [
        {
            title: 'Eat out',
            budget: 25
        },
        {
            title: 'Rent',
            budget: 275
        },
        {
            title: 'Grocery',
            budget: 110
        },
        {
            title: 'Medical Expenses',
            budget: 50
        },
        {
            title: 'Car Insurance',
            budget: 30
        },
        {
            title: 'Shopping',
            budget: 100
        },
        {
            title: 'Health Insurance',
            budget: 25
        },
    ]
};
app.use('/',express.static('public'));

app.get('/budget', (req, res) => {
    res.json(budget);
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});