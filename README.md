# Tic Tac Toe

A classic singleplayer or multiplayer built with React, Node.js, Socket.io, and Typescript.

## Installation

```
git clone https://github.com/bauele/tic-tac-toe.git
cd tic-tac-toe
npm install

cd src/server
npm install
npx tsc
```

Make sure to run npm install twice. The first installs all the package for the client, while the second installs the packages for the server.

## Configuration

By default, the client will run on localhost:3000 and the server will run on localhost:3001. If you wish to change where the server is running, changes must be made to the configuration file located at

```
src/shared/config.json
```

If any changes are made to this file, you must run the following command to tell git you wish to maintain your own custom version of the configuration file.

```
git update-index --skip-worktree <path-name>
```

### Running

From the main directory, run each command in its own terminal

```
node ./src/server/src/js/server/src/ts/index.js
npm run start
```
