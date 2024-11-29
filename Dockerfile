FROM node:18

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Install MySQL client
RUN apt-get update && apt-get install -y mariadb-client

# Copy the rest of the application
COPY . .

# Expose the ports for the Next.js app and WebSocket server
EXPOSE 3000
EXPOSE 3002

# Start both the Next.js app and WebSocket server
CMD ["npm", "run", "dev"]
