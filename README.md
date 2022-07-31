## Instructions

1. Install node. Go to the root folder and run

```bash
npm install
```

2. Install mongodb and redis to your system and start both the servers

3. Create .env file in the root folder

```.env
PORT
MONGODB_URI = mongodb://<localhost-or-container-name>:27017/<db-name>
CLIENT_URL = http://localhost:<PORT>
MAILER_HOST = <any-name-or-mail-provider-name>
MAILER_USERNAME = <related-to-mailer-host>
MAILER_PASSWORD = <related-to-mailer-host>
MAILER_PORT = <related-to-mailer-host>
MAILER_ADMIN = <related-to-mailer-host>
ACCESS_TOKEN_SECRET  = <access-token-secret>
REDIS_PORT = <redis-server-port>
REDIS_HOST = <localhost-or-container-name>
REDIS_DB = <number-of-db>
```

4. Start the node server

```bash
npm start
```

5. Instead you can run all the services with docker, install docker and docker-compose, and then,

```bash
docker-compose up --build
```

### Or run your docker services separately,

References,
```
d = runs a detached container
rm = removes the container when the respective server is stopped
v = volume
p = port
t = tag
```

```bash
docker run --name <mongo-container-name> --network <my-net> -p 27017:27017 -v /path/to/the/database:/data/db -d --rm mongo
```
then ,

```bash
docker run --name <redis-container-name> --network <my-net> -p 6379:6379 -v /path/to/the/database:/data -d --rm redis
```
To run the server first run,

```
docker build -t <image-name>
```

then,

```bash
docker run --name <server-container-name> --network <my-net> -p 8000:8000 -v /path/to/the/project:/home/apps/e-commerce -v node_modules:/home/apps/e-commerce/node_modules -d --rm <built-image-name>
```
