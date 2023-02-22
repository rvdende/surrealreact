# Surreal React

[![Fly Deploy](https://github.com/rvdende/surrealreact/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/rvdende/surrealreact/actions/workflows/main.yml)

SurrealDB explorer.. its a work in progress but have fun :)

![screenshot](https://raw.githubusercontent.com/rvdende/surrealreact/main/screenshot.png)

# Live preview/test

https://surrealreact.fly.dev/

# How to run locally

```
git clone https://github.com/rvdende/surrealreact
cd surrealreact
yarn install
yarn start
```

Open browser at http://localhost:3000/

# To connect to a localhost surreal instance:

```
surreal start --log debug --user root --pass root memory
```

url: http://0.0.0.0:8000/rpc  
user: root  
pass: root
