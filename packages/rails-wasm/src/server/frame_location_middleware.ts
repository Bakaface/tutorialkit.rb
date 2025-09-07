import { type Request, type Response, type NextFunction } from 'express';

export interface FrameLocationTrackingOptions {
  injectionPoint?: string;
}

const createFrameLocationTrackingMiddleware = (options: FrameLocationTrackingOptions = {}) => {
  const { injectionPoint = '</body>' } = options;

  const trackingScript = `
    <script>
      (function() {
        // Avoid double initialization
        if (window.__locationTrackingInitialized) return;
        window.__locationTrackingInitialized = true;

        function notifyParentLocation() {
          if (window.parent === window) return;

          try {
            window.parent.postMessage({
              type: '$locationChange',
              location: {
                href: window.location.href,
              },
              timestamp: Date.now()
            }, '*');
            console.log('notified location change', window.location.href);
          } catch (e) {
            console.error('Failed to notify parent:', e);
          }
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', notifyParentLocation);
        } else {
          notifyParentLocation();
        }

        window.addEventListener('popstate', notifyParentLocation);
        window.addEventListener('hashchange', notifyParentLocation);

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
          const result = originalPushState.apply(history, arguments);
          setTimeout(notifyParentLocation, 0);
          return result;
        };

        history.replaceState = function() {
          const result = originalReplaceState.apply(history, arguments);
          setTimeout(notifyParentLocation, 0);
          return result;
        };
      })();
    </script>
  `;

  return (req: Request, res: Response, next: NextFunction) => {
    // store the original send method
    const originalSend = res.send;

    res.send = function(data: any) {
      const contentType = res.get('Content-Type');

      if (contentType && contentType.includes('text/html') && typeof data === 'string') {
        if (data.includes(injectionPoint)) {
          data = data.replace(injectionPoint, trackingScript + injectionPoint);
        }
      }

      return originalSend.call(this, data);
    };

    next();
  };
};

export default createFrameLocationTrackingMiddleware;
