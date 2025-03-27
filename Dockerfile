# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build TypeScript files
RUN npm run build

# Expose the correct port (Render assigns PORT dynamically)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
