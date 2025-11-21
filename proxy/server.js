/**
 * Viewww Proxy Server
 * Modular proxy server for bypassing X-Frame-Options and adding scroll persistence
 */

import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { proxyHandler } from './routes/proxy.js';
import { metadataHandler } from './routes/metadata.js';

const app = express();

// CORS middleware
app.use(cors({ origin: config.corsOrigin }));

// Routes
app.get('/', (req, res) => {
    res.send('Viewww Proxy Server is running');
});

app.get('/debug-html', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Debug</title>
</head>
<body>
    <h1>Hello</h1>
</body>
</html>
    `);
});

app.get('/proxy', proxyHandler);
app.get('/proxy/metadata', metadataHandler);

// Start server
app.listen(config.port, () => {
});
