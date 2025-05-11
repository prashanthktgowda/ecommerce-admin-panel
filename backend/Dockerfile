# backend/Dockerfile

# 1. Choose a base image
FROM node:18-alpine AS builder
# Using Alpine for smaller image size. Choose a Node version compatible with your app.

# 2. Set the working directory inside the container
WORKDIR /usr/src/app/backend

# 3. Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# 4. Install dependencies
# Using --only=production if you don't need devDependencies in the final image
# For this example, we'll install all to make sure `npm run build` (if any) works
RUN npm install

# 5. Copy the rest of your application code
COPY . .

# (Optional) If you have a build step for your backend (e.g., TypeScript compilation)
# RUN npm run build

# --- Production Stage ---
FROM node:18-alpine

WORKDIR /usr/src/app/backend

# Copy dependencies from the builder stage
COPY --from=builder /usr/src/app/backend/node_modules ./node_modules
# Copy built application code (or source if no build step)
COPY --from=builder /usr/src/app/backend .

# 6. Expose the port your backend runs on (from your .env or code)
EXPOSE 5001

# 7. Define the command to run your application
CMD [ "node", "server.js" ]
# Or if you use a different entry point or npm script:
# CMD [ "npm", "start" ]