FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy the standalone server and static assets produced by `next build`
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget -qO- http://localhost:3000/ || exit 1
CMD ["node", "server.js"]


# docker run --rm -it react-app:alpine sh 
# docker run --rm -it react-app:alpine sh

# Runs a Docker container from the image named react-app:alpine.

# --rm means the container will be automatically removed when it stops.

# -it means it runs in interactive mode with a TTY, allowing you to interact with the container.

# sh runs the shell inside the container, so you get a command prompt inside it.

# This is commonly used for debugging or manually checking the container environment.
# this port forward any image for sure but not sure about next js
# docker run --rm -d -p 9000:80 react-app:nginx
# Runs a Docker container from the image named react-app:nginx.

# --rm means the container is removed automatically on stop.

# -d means the container runs in detached mode (in the background).

# -p 9000:80 maps port 80 inside the container to port 9000 on the host machine, making the app accessible at localhost:9000.

# This command runs the React app served by an Nginx web server in the background.
# docker logs -f containerid
# Shows the logs of the running container with the specified containerid.

# -f means "follow", so it streams the logs in real time as they are generated.

# This is used to monitor container output and debug live issues.
# serve application
# docker stop $(docker ps -q) - remove all container while docker ps -q will list out all ruinning container while -aq will list out all the running and stopped container
# docker rm $(docker ps -aq)    
# docker run --name web-server -d nginx:latest
# docker exec -it web-server sh
# docker build -t react-app:dev -f dockerfile.dev
# docker volume create website-data
# docker run -d -p
# docker run --rm -d -p 3000:5173  -v ./public:/app/public  -v ./src:/app/src react-app:devV3
# nameed volume 
# docker run -d -p 3001:80 ---name website-main -v website-data:/usr/share/nginx/html nginx:latest -- names volumes
# docker run -d -p 3002:80 ---name website-main -v website-data:/usr/share/nginx/html nginx:latest -- names volumes
# docker run -d -p 3002:80 ---name website-main -v website-data:/usr/share/nginx/html nginx:latest -- names volumes
# docker exec -it website-main sh  - to get inside container and use shell
# echo "Hello abhishek doing changes from main container" > usr/share/nginx/html/index.html
#  cpu limits for docker container
# docker run -d --rm --name cpu_shares_high --cpu-shares=2048 --cpuset-cpus=0 busybox sh -c "while true; do :; done"
# docker run -d --rm --name cpu_shares_low --cpu-shares=512 --cpuset-cpus=0 busybox sh -c "while true; do :; done"
# docker run -d --rm --name cpu_shares_quota --cpus=0.75 busybox sh -c "while true; do :; done" 
#                                      ||
# docker run -d --rm --name cpu_shares_quota --cpu-quota=100000 --cpu-period=750000 busybox sh -c "while true; do :; done"
# use docker stats to see 
# docker kill $(docker ps -qa or -q -a)
# setting memory limits for container
# docker run -d --rm --name mongodb --memory="20m" mongo:latest 
# docker run -d --rm --name mongodb --memory-reservation="80m" --memory="100m" mongo:latest 
# docker run -d --rm --name mongodb --memory-reservation="80m" --memory="100m" mongo:latest 
# docker run -d --rm --name mongodb --memory="20m" --memory-swap="200m"  mongo:latest 
# docker run -d --rm  --name restart_failure --restart on-failure:3 busybox sh -c  " sleep 3; exit 0"
# docker run -d --rm  --name restart_failure --restart always  busybox sh -c  " sleep 3; exit 0"
