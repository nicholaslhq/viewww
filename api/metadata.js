import axios from 'axios';
import { config } from '../proxy/config.js';

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': config.userAgent
            }
        });

        const html = response.data;
        // Simple regex to extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : null;

        res.json({ title });
    } catch (error) {
        res.json({ title: null, error: error.message });
    }
}
