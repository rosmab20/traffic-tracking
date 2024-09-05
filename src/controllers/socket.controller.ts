import { Request, Response } from 'express';
import { io, Socket } from 'socket.io-client';
import { TrafficService } from '@/services/taffic.service';
const trafficService = TrafficService.getInstance();

let socketClient: Socket | null = null;

const connectToSocketIO = () => {
  if (!socketClient) {
    socketClient = io('http://36835.hostserv.eu:3002', {
      reconnection: true,
    });

    socketClient.on('connect', () => {
      console.log('Verbunden mit dem Socket.io-Server', socketClient!.id);
    });

    socketClient.on('disconnect', () => {
      console.log('Verbindung zum Socket.io-Server getrennt');
    });

    socketClient.on('connect_error', (error) => {
      console.error('Verbindungsfehler SocketIO:', error);
    });
  }
};

export class SocketController {
  public static async startTrafficRecord() {
    trafficService.getSocketClient();
    trafficService.start();
  }
}
