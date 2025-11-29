# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# to Copy package.json + lock file
COPY package*.json ./

# well to install dependencies 
RUN npm install

# Copy the rest of the backend
COPY . .

# Expose backend port (change it basically if needed)
EXPOSE 8000

# Run nodemon (development mode)
CMD ["npm", "run", "server"]
