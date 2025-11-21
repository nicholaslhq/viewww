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

app.get('/proxy', proxyHandler);
app.get('/proxy/metadata', metadataHandler);

// Start server
app.listen(config.port, () => {
});
