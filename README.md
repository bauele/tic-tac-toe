# Tic Tac Toe

A classic singleplayer or multiplayer built with React, Node.js, Socket.io, and Typescript.

## Installation

## Running

By default, the client will run on localhost:3000 and the server will run on localhost:3001. If you wish to change where the server is running, changes must be made to both the server/ configuration file and the client/ configuration file.

client/src/config.json
server/src/config.json

If any changes are made to these file, you must run the following command to tell git you wish to maintain your own custom version of the configuration file. <path-name> will refer to the config.json file in both the client and server folders.

```
git update-index --skip-worktree <path-name>
```
