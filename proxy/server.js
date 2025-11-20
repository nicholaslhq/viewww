import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Viewww Proxy Server is running');
});

app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    const windowId = req.query.windowId; // Extract windowId from URL

    if (!targetUrl) {
        return res.status(400).send('Missing url parameter');
    }

    try {
        const response = await axios({
            method: 'get',
            url: targetUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // Remove restrictive headers and encoding headers (since axios decompresses)
        const headersToRemove = [
            'x-frame-options',
            'content-security-policy',
            'content-security-policy-report-only',
            'frame-options',
            'content-encoding',
            'content-length',
            'transfer-encoding'
        ];

        Object.entries(response.headers).forEach(([key, value]) => {
            if (!headersToRemove.includes(key.toLowerCase())) {
                res.setHeader(key, value);
            }
        });

        // Ensure we allow iframe embedding
        res.removeHeader('X-Frame-Options');
        res.removeHeader('Content-Security-Policy');

        // Inject script for scroll persistence with windowId from URL
        const script = `
            <script>
                (function() {
                    let scrollTimeout;
                    // Initialize windowId from URL parameter
                    let windowId = ${windowId ? `"${windowId}"` : 'null'};

                    window.addEventListener('scroll', function() {
                        if (scrollTimeout) clearTimeout(scrollTimeout);
                        scrollTimeout = setTimeout(function() {
                            if (windowId) {
                                window.parent.postMessage({
                                    type: 'SCROLL_UPDATE',
                                    windowId: windowId,
                                    scrollX: window.scrollX,
                                    scrollY: window.scrollY
                                }, '*');
                            } else {
                                console.warn('[Proxy Script] No windowId set, not sending scroll update');
                            }
                        }, 100);
                    });

                    window.addEventListener('message', function(e) {
                        if (e.data && e.data.type === 'RESTORE_SCROLL') {
                            // Update windowId if provided (fallback)
                            if (e.data.windowId && !windowId) {
                                windowId = e.data.windowId;
                            }
                            window.scrollTo(e.data.scrollX, e.data.scrollY);
                        }
                    });

                    // Notify parent that we are ready to receive scroll position
                    window.parent.postMessage({ type: 'PROXY_FRAME_READY' }, '*');
                })();
            </script>
        `;

        // Simple transform to inject script before </body>
        const { Transform } = await import('stream');
        const injectScript = new Transform({
            transform(chunk, encoding, callback) {
                const chunkString = chunk.toString();
                if (chunkString.includes('</body>')) {
                    const newChunk = chunkString.replace('</body>', script + '</body>');
                    this.push(newChunk);
                } else {
                    this.push(chunk);
                }
                callback();
            }
        });

        response.data.pipe(injectScript).pipe(res);
    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).send(`Error fetching URL: ${error.message}`);
    }
});

app.get('/proxy/metadata', async (req, res) => {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const html = response.data;
        // Simple regex to extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : null;

        res.json({ title });
    } catch (error) {
        console.error('Metadata error:', error.message);
        res.json({ title: null, error: error.message });
    }
});

app.listen(PORT, () => {
    // Proxy server running on http://localhost:${PORT}
});
