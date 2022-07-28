import expressWs from 'express-ws';
import UserModel from '../models/user.model.js';
import CookieSign from 'cookie-signature';

const userConnections = {};
// Structure:
// userConnections = {
//     userId: {
//         sessionId1: ws1,
//         sessionId2: ws2,
//         ...
//     }
// }

async function isLogon(ws, req, next) {
    if (req.session.passport !== undefined
        && req.session.passport.user !== undefined) {
        return next();
    }
    ws.terminate();
}

function initConnection(ws, req) {
    const userId = req.session.passport.user._id;
    if (typeof (userConnections[`${userId}`]) === 'undefined') {
        userConnections[`${userId}`] = {};
    }
    userConnections[`${userId}`][`${req.sessionID}`] = ws;
}

function broadcastNotifyUser(message, userId) {
    if (typeof (userConnections[`${userId}`]) !== 'undefined') {
        Object.keys(userConnections[`${userId}`]).forEach(function (key, index) {
            // console.log(key, index);
            let ws = userConnections[`${userId}`][`${key}`];
            ws.send(message);
        });
    }
}

export function broadcastNotify(message, userId = null) {
    if (userId !== null) {
        broadcastNotifyUser(message, userId);
    }
    else {
        // Broadcast all userConnections
        Object.keys(userConnections).forEach(function (key, index) {
            broadcastNotifyUser(message, key);
        });
    }
}

export default async function (appBase) {
    let wsInstance = expressWs(appBase);
    let app = wsInstance.app;

    app.ws('/ws', isLogon, async function (ws, req) {
        initConnection(ws, req)
        console.log(req.session.passport.user._id, req.sessionID, 'connected websocket');

        // ws.on('message', async function (message) {
        //     console.log(JSON.parse(message));
        // });

        ws.on('close', function () {
            const userId = req.session.passport.user._id;
            delete userConnections[`${userId}`][`${req.sessionID}`];
        });
    });
}