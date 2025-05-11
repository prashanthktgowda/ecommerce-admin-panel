# frontend/Dockerfile

# ---- Build Stage ----
    FROM node:18-alpine AS builder
    # Choose a Node version compatible with your Create React App version
    
    WORKDIR /usr/src/app/frontend
    
    # Copy package.json and package-lock.json (or yarn.lock)
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy the rest of your application code
    COPY . .
    
    # Set the public URL (important if your app is served under a subpath, not needed for root)
    # ENV PUBLIC_URL=/
    
    # Build the React app for production
    RUN npm run build
    
    # ---- Serve Stage ----
    FROM nginx:stable-alpine
    # Using Nginx to serve static files
    
    # Copy the built static files from the 'builder' stage to Nginx's default serve directory
    COPY --from=builder /usr/src/app/frontend/build /usr/share/nginx/html
    
    # (Optional) Copy a custom Nginx configuration if needed
    # COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Expose port 80 (Nginx default)
    EXPOSE 80
    
    # Default command to start Nginx
    CMD ["nginx", "-g", "daemon off;"]