# Paco Dice Game

#### Paco dice game and Staking developed with MERN

## Tech Stack

[![React](https://img.shields.io/badge/React-18.2.0-%2361DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.10.0-green)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-38B2AC?logo=tailwind-css)](LINK_TO_TAILWIND_CSS)
[![React Router](https://img.shields.io/badge/React_Router-6.16.0-CA4245?logo=react-router)](LINK_TO_REACT_ROUTER)
[![React-Query](https://img.shields.io/badge/React_Query-4.35.3-FFD53E?logo=react-query)](LINK_TO_REACT_QUERY)
[![React-Icons](https://img.shields.io/badge/React_Icons-4.11.0-61DAFB?logo=react)](LINK_TO_REACT_ICONS)
[![Express.js](https://img.shields.io/badge/Express.js-4.18.1-000000?logo=express)](LINK_TO_EXPRESS)
[![Mongoose](https://img.shields.io/badge/Mongoose-7.6.3-47A248?logo=mongoose)](LINK_TO_MONGOOSE)
[![Docker](https://img.shields.io/badge/Docker-24.0.7-2496ED?logo=docker)](LINK_TO_DOCKER)

### Installing

A step by step series of examples that tell you how to get a development environment running:

1. Clone the repository

```
git clone https://github.com/harun-rucse/paco-dice-game.git
```

2. Copy the `.env.example` file and create two file named `.env.development` and `.env.production` for both api and client.

3. Install dependencies for both api & client directory

```
yarn
```

4. Start the development server for both api & client

```
yarn dev
```

## Run Docker in development

```
docker-compose -f docker-compose.dev.yml up -d --build
```

## Run Docker in production

```
docker-compose -f docker-compose.prod.yml up -d --build
```

## Built With

- [Node.js](https://nodejs.org/) - The JavaScript runtime used on the back-end
- [MongoDB](https://www.mongodb.com/) - The database used to store data
- [React](https://reactjs.org/) - The JavaScript library used on the front-end
- [Express](https://expressjs.com/) - The back-end web framework used to build the API
