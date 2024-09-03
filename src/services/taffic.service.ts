import { TrafficData } from '@/interfaces/trafficdata.interface';
import { TrafficDatas } from '@/interfaces/trafficdatas.interface';
import { io, Socket } from 'socket.io-client';

export class TrafficService {
  private isrunning: boolean = false;

  private static instance: TrafficService;
  private socketClient: Socket | null = null;
  private KZD = 10000;
  private LZD = 100000;
  private countPKW = 0;

  private currentTrafficDataKZD: TrafficDatas = {
    typ: 0,
    abfrageintervall: this.KZD,
    abfragezeitpunktstart: '',
    abfragezeitpunktende: '',
    KRAD: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
    PKW: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
    LFW: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
    PKWA: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
    LKWA: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
    LKW: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
    SATTEL: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
    BUS: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
    SONST: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
  };

  private currentTrafficDataLZD: TrafficDatas = {
    typ: 1,
    abfrageintervall: this.LZD,
    abfragezeitpunktstart: '',
    abfragezeitpunktende: '',
    KRAD: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
    PKW: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
    LFW: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
    PKWA: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
    LKWA: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
    LKW: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
    SATTEL: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
    BUS: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
    SONST: {
      anzahl: 0,
      durchschnittsgeschwindigkeit: 0,
    },
  };

  private constructor() {
    this.connectToSocketIO();
  }

  public static getInstance(): TrafficService {
    if (!TrafficService.instance) {
      TrafficService.instance = new TrafficService();
    }

    return TrafficService.instance;
  }

  private initTrafficDataKZD() {
    this.currentTrafficDataKZD.abfragezeitpunktstart = new Date().toISOString();
    this.currentTrafficDataKZD.typ = 0;
    this.currentTrafficDataKZD.PKW.anzahl = 0;
    this.currentTrafficDataKZD.KRAD.anzahl = 0;
    this.currentTrafficDataKZD.LFW.anzahl = 0;
    this.currentTrafficDataKZD.PKWA.anzahl = 0;
    this.currentTrafficDataKZD.LKWA.anzahl = 0;
    this.currentTrafficDataKZD.LKW.anzahl = 0;
    this.currentTrafficDataKZD.SATTEL.anzahl = 0;
    this.currentTrafficDataKZD.BUS.anzahl = 0;
    this.currentTrafficDataKZD.SONST.anzahl = 0;
    this.currentTrafficDataKZD.PKW.durchschnittsgeschwindigkeit = 0;
    this.currentTrafficDataKZD.KRAD.durchschnittsgeschwindigkeit = 0;
    this.currentTrafficDataKZD.LFW.durchschnittsgeschwindigkeit = 0;
    this.currentTrafficDataKZD.PKWA.durchschnittsgeschwindigkeit = 0;
    this.currentTrafficDataKZD.LKWA.durchschnittsgeschwindigkeit = 0;
    this.currentTrafficDataKZD.LKW.durchschnittsgeschwindigkeit = 0;
    this.currentTrafficDataKZD.SATTEL.durchschnittsgeschwindigkeit = 0;
    this.currentTrafficDataKZD.BUS.durchschnittsgeschwindigkeit = 0;
    this.currentTrafficDataKZD.SONST.durchschnittsgeschwindigkeit = 0;
  }

  private initTrafficDataLZD() {
    this.currentTrafficDataLZD.abfragezeitpunktstart = new Date().toISOString();
    this.currentTrafficDataLZD.typ = 1;
    this.currentTrafficDataLZD.PKW.anzahl = 0;
    this.currentTrafficDataLZD.KRAD.anzahl = 0;
    this.currentTrafficDataLZD.LFW.anzahl = 0;
    this.currentTrafficDataLZD.PKWA.anzahl = 0;
    this.currentTrafficDataLZD.LKWA.anzahl = 0;
    this.currentTrafficDataLZD.LKW.anzahl = 0;
    this.currentTrafficDataLZD.SATTEL.anzahl = 0;
    this.currentTrafficDataLZD.BUS.anzahl = 0;
    this.currentTrafficDataLZD.SONST.anzahl = 0;
    this.currentTrafficDataLZD.PKW.durchschnittsgeschwindigkeit = 0;
    this.currentTrafficDataLZD.KRAD.durchschnittsgeschwindigkeit = 0;
    this.currentTrafficDataLZD.LFW.durchschnittsgeschwindigkeit = 0;
    this.currentTrafficDataLZD.PKWA.durchschnittsgeschwindigkeit = 0;
    this.currentTrafficDataLZD.LKWA.durchschnittsgeschwindigkeit = 0;
    this.currentTrafficDataLZD.LKW.durchschnittsgeschwindigkeit = 0;
    this.currentTrafficDataLZD.SATTEL.durchschnittsgeschwindigkeit = 0;
    this.currentTrafficDataLZD.BUS.durchschnittsgeschwindigkeit = 0;
    this.currentTrafficDataLZD.SONST.durchschnittsgeschwindigkeit = 0;
  }

  private connectToSocketIO() {
    if (!this.socketClient) {
      this.socketClient = io('http://36835.hostserv.eu:3002', {
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

  private trafficJam() {
    this.socketClient?.emit('jam', 1);
  }

  private stopTrafficJam() {
    this.socketClient?.emit('jam', 0);
  }

  private ghostDriver() {
    this.socketClient?.emit('ghost', 1);
  }

  private stopGhostDriver() {
    this.socketClient?.emit('ghost', 0);
  }

  private fault() {
    this.socketClient?.emit('fault', 1);
  }

  public start() {
    console.log('Start Traffic Service');
    this.trafficUpdate();
  }

  private randomVehicle() {
    return Math.floor(Math.random() * 100) + 1;
  }

  private updateAverageSpeed(currentSpeed: number, currentCount: number) {
    let newSpeed = Math.random() * (100 - 20) + 20;
    let totalSpeed = currentSpeed * (currentCount - 1) + newSpeed;
    return totalSpeed / currentCount;
  }

  private trafficUpdate() {
    if (this.isrunning) {
      return;
    }

    this.isrunning = true;

    const intervallKZD = () => {
      setTimeout(() => {
        this.currentTrafficDataKZD.abfragezeitpunktende = new Date().toISOString();
        console.log('Traffic:', this.currentTrafficDataKZD);
        this.socketClient?.emit('traffic', this.countPKW);
        this.socketClient?.emit('traffic', this.currentTrafficDataKZD);
        this.initTrafficDataKZD();
        intervallKZD();
      }, this.KZD);
    };
    intervallKZD();

    const intervallLZD = () => {
      setTimeout(() => {
        this.currentTrafficDataLZD.abfragezeitpunktende = new Date().toISOString();
        console.log('Traffic:', this.currentTrafficDataLZD);
        this.socketClient?.emit('traffic', this.currentTrafficDataLZD);
        this.initTrafficDataLZD();
        intervallLZD();
      }, this.LZD);
    };
    intervallLZD();

    const update = () => {
      const randomTime = Math.floor(Math.random() * 5000) + 100;
      setTimeout(() => {
        let vehicleNumber = this.randomVehicle();
        if (vehicleNumber <= 50) {
          this.currentTrafficDataKZD.PKW.anzahl++;
          this.currentTrafficDataKZD.PKW.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataKZD.PKW.durchschnittsgeschwindigkeit,
            this.currentTrafficDataKZD.PKW.anzahl
          );
          this.currentTrafficDataLZD.PKW.anzahl++;
          this.currentTrafficDataLZD.PKW.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataLZD.PKW.durchschnittsgeschwindigkeit,
            this.currentTrafficDataLZD.PKW.anzahl
          );
        } else if (vehicleNumber <= 60) {
          this.currentTrafficDataKZD.KRAD.anzahl++;
          this.currentTrafficDataKZD.KRAD.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataKZD.KRAD.durchschnittsgeschwindigkeit,
            this.currentTrafficDataKZD.KRAD.anzahl
          );
          this.currentTrafficDataLZD.KRAD.anzahl++;
          this.currentTrafficDataLZD.KRAD.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataLZD.KRAD.durchschnittsgeschwindigkeit,
            this.currentTrafficDataLZD.KRAD.anzahl
          );
        } else if (vehicleNumber <= 70) {
          this.currentTrafficDataKZD.LFW.anzahl++;
          this.currentTrafficDataKZD.LFW.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataKZD.LFW.durchschnittsgeschwindigkeit,
            this.currentTrafficDataKZD.LFW.anzahl
          );
          this.currentTrafficDataLZD.LFW.anzahl++;
          this.currentTrafficDataLZD.LFW.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataLZD.LFW.durchschnittsgeschwindigkeit,
            this.currentTrafficDataLZD.LFW.anzahl
          );
        } else if (vehicleNumber <= 80) {
          this.currentTrafficDataKZD.PKWA.anzahl++;
          this.currentTrafficDataKZD.PKWA.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataKZD.PKWA.durchschnittsgeschwindigkeit,
            this.currentTrafficDataKZD.PKWA.anzahl
          );
          this.currentTrafficDataLZD.PKWA.anzahl++;
          this.currentTrafficDataLZD.PKWA.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataLZD.PKWA.durchschnittsgeschwindigkeit,
            this.currentTrafficDataLZD.PKWA.anzahl
          );
        } else if (vehicleNumber <= 85) {
          this.currentTrafficDataKZD.LKWA.anzahl++;
          this.currentTrafficDataKZD.LKWA.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataKZD.LKWA.durchschnittsgeschwindigkeit,
            this.currentTrafficDataKZD.LKWA.anzahl
          );
          this.currentTrafficDataLZD.LKWA.anzahl++;
          this.currentTrafficDataLZD.LKWA.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataLZD.LKWA.durchschnittsgeschwindigkeit,
            this.currentTrafficDataLZD.LKWA.anzahl
          );
        } else if (vehicleNumber <= 90) {
          this.currentTrafficDataKZD.LKW.anzahl++;
          this.currentTrafficDataKZD.LKW.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataKZD.LKW.durchschnittsgeschwindigkeit,
            this.currentTrafficDataKZD.LKW.anzahl
          );
          this.currentTrafficDataLZD.LKW.anzahl++;
          this.currentTrafficDataLZD.LKW.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataLZD.LKW.durchschnittsgeschwindigkeit,
            this.currentTrafficDataLZD.LKW.anzahl
          );
        } else if (vehicleNumber <= 95) {
          this.currentTrafficDataKZD.SATTEL.anzahl++;
          this.currentTrafficDataKZD.SATTEL.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataKZD.SATTEL.durchschnittsgeschwindigkeit,
            this.currentTrafficDataKZD.SATTEL.anzahl
          );
          this.currentTrafficDataLZD.SATTEL.anzahl++;
          this.currentTrafficDataLZD.SATTEL.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataLZD.SATTEL.durchschnittsgeschwindigkeit,
            this.currentTrafficDataLZD.SATTEL.anzahl
          );
        } else if (vehicleNumber <= 98) {
          this.currentTrafficDataKZD.BUS.anzahl++;
          this.currentTrafficDataKZD.BUS.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataKZD.BUS.durchschnittsgeschwindigkeit,
            this.currentTrafficDataKZD.BUS.anzahl
          );
          this.currentTrafficDataLZD.BUS.anzahl++;
          this.currentTrafficDataLZD.BUS.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataLZD.BUS.durchschnittsgeschwindigkeit,
            this.currentTrafficDataLZD.BUS.anzahl
          );
        } else {
          this.currentTrafficDataKZD.SONST.anzahl++;
          this.currentTrafficDataKZD.SONST.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataKZD.SONST.durchschnittsgeschwindigkeit,
            this.currentTrafficDataKZD.SONST.anzahl
          );
          this.currentTrafficDataLZD.SONST.anzahl++;
          this.currentTrafficDataLZD.SONST.durchschnittsgeschwindigkeit = this.updateAverageSpeed(
            this.currentTrafficDataLZD.SONST.durchschnittsgeschwindigkeit,
            this.currentTrafficDataLZD.SONST.anzahl
          );
        }
        update();
      }, randomTime);
    };
    update();
  }

  private sendSingleTrafficData() {
    let trafficData: TrafficData = {
      timestamp: new Date().toISOString(),
      typ: 0,
      speed: Math.random() * (100 - 20) + 20,
      length: Math.random() * (100 - 20) + 20,
    };
    this.socketClient?.emit('traffic', trafficData);
  }

  public getSocketClient(): Socket | null {
    return this.socketClient;
  }
}
