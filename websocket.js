import { WebSocketServer } from 'ws';
import CookieSign from 'cookie-signature';

export default async function (expressServer) {
    const webSocketServer = new WebSocketServer({
        noServer: true,     // do not set up an HTTP server alongside this websocket server.
        path: '/ws',
    });

    expressServer.on('upgrade', function (req, socket, head) {
        webSocketServer.handleUpgrade(req, socket, head, function (websocket) {
            webSocketServer.emit('connection', websocket, req);
        });
    });

    // When a connection is established
    webSocketServer.on('connection',
        function connection(webSocketConnection, connectionReq) {
            console.log('ws established ', connectionReq.upgradeReq);
            webSocketConnection.on('message', function (message) {
                console.log(JSON.parse(message));
                webSocketConnection.send(JSON.stringify(JSON.parse(message)));
            });

            webSocketConnection.on('close', function (code, reason) {
                console.log('Client disconnected ', code);
            });
            setTimeout(function () {
                webSocketConnection.terminate();
            }, 5000);
        });

    return webSocketServer;
}