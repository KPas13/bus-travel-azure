const express = require('express');
const sql = require('mssql');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

app.use(express.static('public'));

app.get('/api/bus-routes', async (req, res) => {
    try {
        await sql.connect(sqlConfig);
        const result = await sql.query`
            SELECT br.RouteID, br.RouteName, bl.Latitude, bl.Longitude
            FROM BusRoutes br
            JOIN BusLocations bl ON br.RouteID = bl.RouteID
            ORDER BY br.RouteID, bl.Timestamp
        `;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});