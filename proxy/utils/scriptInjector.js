/**
 * Script injector utility for adding scroll persistence to proxied pages
 */

import { Transform } from 'stream';

/**
 * Creates a transform stream that injects a script before </body>
 * @param {string} windowId - Window ID for tracking
 * @param {number} scrollDebounceMs - Debounce time for scroll events
 * @returns {Transform} Transform stream
 */
export function createScriptInjector(windowId, scrollDebounceMs = 100) {
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
            }
          }, ${scrollDebounceMs});
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

    return new Transform({
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
}
