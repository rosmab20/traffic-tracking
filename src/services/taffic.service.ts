import { io, Socket } from "socket.io-client";


export class TrafficService{
    private isrunning: boolean = false;

    private static instance: TrafficService;
    private socketClient: Socket | null = null;
    private KZD = 10000;
    private LZD = 1000000;
    private countPKW = 0;
    
    private constructor() {
        this.connectToSocketIO();
    }

    public static getInstance(): TrafficService {
        if (!TrafficService.instance) {
            TrafficService.instance = new TrafficService();
        }

        return TrafficService.instance;
    }

    private connectToSocketIO() {
        if (!this.socketClient) {
            this.socketClient = io("http://36835.hostserv.eu:3002", {
                reconnection: true,
            });

            this.socketClient.on('connect', () => {
                console.log('Verbunden mit dem Socket.io-Server', this.socketClient!.id);
            });

            this.socketClient.on('disconnect', () => {
                console.log('Verbindung zum Socket.io-Server getrennt');
            });

            this.socketClient.on('connect_error', (error) => {
                console.error('Verbindungsfehler SocketIO:', error);
            });
        }
    }

    public start(){
        console.log('Start Traffic Service');
        this.trafficUpdate();
    }

    

    private trafficUpdate(){
        if(this.isrunning){
            return;
        }

        this.isrunning = true;

        const intervall = () => {
            setTimeout(() => {
                console.log('Traffic:', this.countPKW); 
                this.socketClient?.emit('traffic', this.countPKW);
                this.countPKW = 0;
                intervall();
            }, (0));
        }
        intervall();

        const update = () => {
            const randomTime = Math.floor(Math.random() * 5000) + 100;
            setTimeout(() => {
                this.countPKW++;
                update();
            }, randomTime);
        }
        update();
        


    }

    public getSocketClient(): Socket | null {
        return this.socketClient;
    }
}