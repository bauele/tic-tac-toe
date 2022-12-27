import { io } from 'socket.io-client';
const serverConfig = require('./config.json');

const url = `${serverConfig.host.protocol}://${serverConfig.host.hostname}:${serverConfig.host.port}`;

export const socket = io(url);

socket.on('connect', () => {
    console.log(socket.id);
});
