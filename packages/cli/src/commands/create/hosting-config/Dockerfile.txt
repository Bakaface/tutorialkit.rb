# Minimal nginx image to serve pre-built static files
# Build happens in GitHub Actions (with WASM caching), not here

FROM nginx:alpine

# Copy pre-built site from GitHub Actions
COPY dist /usr/share/nginx/html

# Add required headers for WebContainers (SharedArrayBuffer support)
RUN echo 'add_header Cross-Origin-Embedder-Policy "require-corp";' > /etc/nginx/conf.d/custom-headers.conf \
    && echo 'add_header Cross-Origin-Opener-Policy "same-origin";' >> /etc/nginx/conf.d/custom-headers.conf \
    && echo 'add_header Cross-Origin-Resource-Policy "cross-origin";' >> /etc/nginx/conf.d/custom-headers.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
