# Docker Running Helper

This guide is only for running and updating the project with Docker.

## 1. Build image

```powershell
docker build -t productpage:local .
```

## 2. Run container on port 9001

```powershell
docker rm -f productpage 2>$null
docker run -d --name productpage -p 9001:3000 productpage:local
```

Open `http://localhost:9001`.

## 3. Update after code changes

```powershell
docker build -t productpage:local .
docker rm -f productpage 2>$null
docker run -d --name productpage -p 9001:3000 productpage:local
```

## 4. Update after pulling latest changes

```powershell
git pull
docker build -t productpage:local .
docker rm -f productpage 2>$null
docker run -d --name productpage -p 9001:3000 productpage:local
```

## 5. Check status

```powershell
docker ps --filter "name=productpage"
```

## 6. View logs

```powershell
docker logs -f productpage
```

## 7. Restart container

```powershell
docker restart productpage
```

## 8. Stop and remove container

```powershell
docker stop productpage
docker rm productpage
```
