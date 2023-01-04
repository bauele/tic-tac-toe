import { io } from 'socket.io-client';
const serverConfig = require('../server/src/ts/config.json');

const url = `${serverConfig.host.protocol}://${serverConfig.host.hostname}:${serverConfig.host.port}`;

export const socket = io(url);

socket.on('connect', () => {});
