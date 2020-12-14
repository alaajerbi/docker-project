# Docker project

A docker swarm containing:
- a web service for a simple todo API built in nodejs
- a database service running on a mongo instance and mounted to a local volume

## Prerequisites (Important)
You need the following ports open to traffic to and from each node participating the docker swarm:
- **TCP** port **2377** for cluster management communications
- **TCP** and **UDP** port **7946** for communication among nodes
- **UDP** port **4789** for overlay network traffic

## Starting the docker swarm and running services

1. Clone this repo and upload it to your instances
2. Build the image for the todo-app in each of your instances by running the command:
```bash
$ docker build -t todo-app .
```
3. Choose the instance that will function as a manager and initialize a new docker swarm by running the command:
```bash
$ docker swarm init
```
A token will be generated and a join command will be displayed that looks like this:
```bash
$ docker swarm join --token {some token} {some ip}:2377
```
4. Run that command in the other worker instances you want to them to join the swarm
5. In the manager instance, run this command to deploy the services in the `docker-compose.yml` file:
```bash
$ docker stack deploy --compose-file=docker-compose.yml app
```
`app` is the name of the stack and it can be anything you want :)
## Scaling the services

To scale a service (`app_db` or `app_web`), run this command:
```bash
$ docker service scale {service name}={number of replicas to scale to}
```
Keep in mind that both services are limited in how they can be replicated:
- app_db is to be only replicated at most **1 replica per node** (to avoid port conflicts).
- app_web is to be replicated at most **3 nodes per node**, you can still change that in the `docker-compose.yml` if you want.

## Using the web API
The app is simple. It allows you create and list todos.
### Create todo
From any instance, run this command:
```bash
$ curl -X POST -H "Content-Type: application/json" \
    -d '{"title": "Todo title"}' \
    localhost:8080/todos
```
Change `Todo title` to the text for the todo.
### GET todos
To display the array of todos, run the command:
```bash
$ curl localhost:8080/todos
```


