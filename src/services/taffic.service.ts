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
  private useLZD = true;
  private useKZD = true;

  private currentTrafficDataKZD: TrafficDatas = {
    type: 0,
    queryInterval: this.KZD,
    queryStartTime: '',
    queryEndTime: '',
    KRAD: {
      amount: 0,
      averageSpeed: 0,
    },
    PKW: {
      amount: 0,
      averageSpeed: 0,
    },
    LFW: {
      amount: 0,
      averageSpeed: 0,
    },
    PKWA: {
      amount: 0,
      averageSpeed: 0,
    },
    LKWA: {
      amount: 0,
      averageSpeed: 0,
    },
    LKW: {
      amount: 0,
      averageSpeed: 0,
    },
    SATTEL: {
      amount: 0,
      averageSpeed: 0,
    },
    BUS: {
      amount: 0,
      averageSpeed: 0,
    },
    SONST: {
      amount: 0,
      averageSpeed: 0,
    },
  };

  private currentTrafficDataLZD: TrafficDatas = {
    type: 1,
    queryInterval: this.LZD,
    queryStartTime: '',
    queryEndTime: '',
    KRAD: {
      amount: 0,
      averageSpeed: 0,
    },
    PKW: {
      amount: 0,
      averageSpeed: 0,
    },
    LFW: {
      amount: 0,
      averageSpeed: 0,
    },
    PKWA: {
      amount: 0,
      averageSpeed: 0,
    },
    LKWA: {
      amount: 0,
      averageSpeed: 0,
    },
    LKW: {
      amount: 0,
      averageSpeed: 0,
    },
    SATTEL: {
      amount: 0,
      averageSpeed: 0,
    },
    BUS: {
      amount: 0,
      averageSpeed: 0,
    },
    SONST: {
      amount: 0,
      averageSpeed: 0,
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
    this.currentTrafficDataKZD.queryStartTime = new Date().toISOString();
    this.currentTrafficDataKZD.type = 0;
    this.currentTrafficDataKZD.PKW.amount = 0;
    this.currentTrafficDataKZD.KRAD.amount = 0;
    this.currentTrafficDataKZD.LFW.amount = 0;
    this.currentTrafficDataKZD.PKWA.amount = 0;
    this.currentTrafficDataKZD.LKWA.amount = 0;
    this.currentTrafficDataKZD.LKW.amount = 0;
    this.currentTrafficDataKZD.SATTEL.amount = 0;
    this.currentTrafficDataKZD.BUS.amount = 0;
    this.currentTrafficDataKZD.SONST.amount = 0;
    this.currentTrafficDataKZD.PKW.averageSpeed = 0;
    this.currentTrafficDataKZD.KRAD.averageSpeed = 0;
    this.currentTrafficDataKZD.LFW.averageSpeed = 0;
    this.currentTrafficDataKZD.PKWA.averageSpeed = 0;
    this.currentTrafficDataKZD.LKWA.averageSpeed = 0;
    this.currentTrafficDataKZD.LKW.averageSpeed = 0;
    this.currentTrafficDataKZD.SATTEL.averageSpeed = 0;
    this.currentTrafficDataKZD.BUS.averageSpeed = 0;
    this.currentTrafficDataKZD.SONST.averageSpeed = 0;
  }

  private initTrafficDataLZD() {
    this.currentTrafficDataLZD.queryStartTime = new Date().toISOString();
    this.currentTrafficDataLZD.type = 1;
    this.currentTrafficDataLZD.PKW.amount = 0;
    this.currentTrafficDataLZD.KRAD.amount = 0;
    this.currentTrafficDataLZD.LFW.amount = 0;
    this.currentTrafficDataLZD.PKWA.amount = 0;
    this.currentTrafficDataLZD.LKWA.amount = 0;
    this.currentTrafficDataLZD.LKW.amount = 0;
    this.currentTrafficDataLZD.SATTEL.amount = 0;
    this.currentTrafficDataLZD.BUS.amount = 0;
    this.currentTrafficDataLZD.SONST.amount = 0;
    this.currentTrafficDataLZD.PKW.averageSpeed = 0;
    this.currentTrafficDataLZD.KRAD.averageSpeed = 0;
    this.currentTrafficDataLZD.LFW.averageSpeed = 0;
    this.currentTrafficDataLZD.PKWA.averageSpeed = 0;
    this.currentTrafficDataLZD.LKWA.averageSpeed = 0;
    this.currentTrafficDataLZD.LKW.averageSpeed = 0;
    this.currentTrafficDataLZD.SATTEL.averageSpeed = 0;
    this.currentTrafficDataLZD.BUS.averageSpeed = 0;
    this.currentTrafficDataLZD.SONST.averageSpeed = 0;
  }

  private applyTrafficDataCommand(command: {
    useKZD: boolean;
    useLZD: boolean;
    kzdInterval: number | null;
    lzdInterval: number | null;
  }) {
    if (command.useKZD && command.kzdInterval !== null) {
      this.KZD = command.kzdInterval;
      this.useKZD = command.useKZD;
      console.log(`KZD-Intervall auf ${this.KZD} ms gesetzt`);
    }

    if (command.useLZD && command.lzdInterval !== null) {
      this.LZD = command.lzdInterval;
      this.useLZD = command.useLZD;
      console.log(`LZD-Intervall auf ${this.LZD} ms gesetzt`);
    }

    this.trafficUpdate();
  }

  private connectToSocketIO() {
    if (!this.socketClient) {
      this.socketClient = io('http://36835.hostserv.eu:3004', {
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

      this.socketClient.on('trafficDataCommand', (command) => {
        console.log('Command empfangen:', command);
        this.applyTrafficDataCommand(command); // Befehle anwenden
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

  private stopFault() {
    this.socketClient?.emit('fault', 0);
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
        this.currentTrafficDataKZD.queryEndTime = new Date().toISOString();
        console.log('Traffic:', this.currentTrafficDataKZD);
        if (this.useKZD) {
          this.socketClient?.emit('traffic', this.currentTrafficDataKZD);
        }
        this.initTrafficDataKZD();
        intervallKZD();
      }, this.KZD);
    };
    intervallKZD();

    const intervallLZD = () => {
      setTimeout(() => {
        this.currentTrafficDataLZD.queryEndTime = new Date().toISOString();
        console.log('Traffic:', this.currentTrafficDataLZD);
        if (this.useLZD) {
          this.socketClient?.emit('traffic', this.currentTrafficDataLZD);
        }
        this.initTrafficDataLZD();
        intervallLZD();
      }, this.LZD);
    };
    intervallLZD();

    const update = () => {
      const randomTime = Math.floor(Math.random() * 5000) + 100;
      const randomEvent = Math.floor(Math.random() * 100) + 1;

      if (randomEvent <= 20) {
        this.trafficJam();
      } else if (randomEvent <= 35) {
        this.ghostDriver();
      } else if (randomEvent <= 50) {
        this.fault();
      } else if (randomEvent > 50) {
        this.stopGhostDriver();
        this.stopTrafficJam();
        this.stopFault();
      }
      setTimeout(() => {
        let vehicleNumber = this.randomVehicle();
        this.sendSingleTrafficData();
        if (vehicleNumber <= 50) {
          this.currentTrafficDataKZD.PKW.amount++;
          this.currentTrafficDataKZD.PKW.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataKZD.PKW.averageSpeed,
            this.currentTrafficDataKZD.PKW.amount
          );
          this.currentTrafficDataLZD.PKW.amount++;
          this.currentTrafficDataLZD.PKW.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataLZD.PKW.averageSpeed,
            this.currentTrafficDataLZD.PKW.amount
          );
        } else if (vehicleNumber <= 60) {
          this.currentTrafficDataKZD.KRAD.amount++;
          this.currentTrafficDataKZD.KRAD.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataKZD.KRAD.averageSpeed,
            this.currentTrafficDataKZD.KRAD.amount
          );
          this.currentTrafficDataLZD.KRAD.amount++;
          this.currentTrafficDataLZD.KRAD.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataLZD.KRAD.averageSpeed,
            this.currentTrafficDataLZD.KRAD.amount
          );
        } else if (vehicleNumber <= 70) {
          this.currentTrafficDataKZD.LFW.amount++;
          this.currentTrafficDataKZD.LFW.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataKZD.LFW.averageSpeed,
            this.currentTrafficDataKZD.LFW.amount
          );
          this.currentTrafficDataLZD.LFW.amount++;
          this.currentTrafficDataLZD.LFW.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataLZD.LFW.averageSpeed,
            this.currentTrafficDataLZD.LFW.amount
          );
        } else if (vehicleNumber <= 80) {
          this.currentTrafficDataKZD.PKWA.amount++;
          this.currentTrafficDataKZD.PKWA.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataKZD.PKWA.averageSpeed,
            this.currentTrafficDataKZD.PKWA.amount
          );
          this.currentTrafficDataLZD.PKWA.amount++;
          this.currentTrafficDataLZD.PKWA.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataLZD.PKWA.averageSpeed,
            this.currentTrafficDataLZD.PKWA.amount
          );
        } else if (vehicleNumber <= 85) {
          this.currentTrafficDataKZD.LKWA.amount++;
          this.currentTrafficDataKZD.LKWA.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataKZD.LKWA.averageSpeed,
            this.currentTrafficDataKZD.LKWA.amount
          );
          this.currentTrafficDataLZD.LKWA.amount++;
          this.currentTrafficDataLZD.LKWA.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataLZD.LKWA.averageSpeed,
            this.currentTrafficDataLZD.LKWA.amount
          );
        } else if (vehicleNumber <= 90) {
          this.currentTrafficDataKZD.LKW.amount++;
          this.currentTrafficDataKZD.LKW.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataKZD.LKW.averageSpeed,
            this.currentTrafficDataKZD.LKW.amount
          );
          this.currentTrafficDataLZD.LKW.amount++;
          this.currentTrafficDataLZD.LKW.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataLZD.LKW.averageSpeed,
            this.currentTrafficDataLZD.LKW.amount
          );
        } else if (vehicleNumber <= 95) {
          this.currentTrafficDataKZD.SATTEL.amount++;
          this.currentTrafficDataKZD.SATTEL.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataKZD.SATTEL.averageSpeed,
            this.currentTrafficDataKZD.SATTEL.amount
          );
          this.currentTrafficDataLZD.SATTEL.amount++;
          this.currentTrafficDataLZD.SATTEL.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataLZD.SATTEL.averageSpeed,
            this.currentTrafficDataLZD.SATTEL.amount
          );
        } else if (vehicleNumber <= 98) {
          this.currentTrafficDataKZD.BUS.amount++;
          this.currentTrafficDataKZD.BUS.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataKZD.BUS.averageSpeed,
            this.currentTrafficDataKZD.BUS.amount
          );
          this.currentTrafficDataLZD.BUS.amount++;
          this.currentTrafficDataLZD.BUS.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataLZD.BUS.averageSpeed,
            this.currentTrafficDataLZD.BUS.amount
          );
        } else {
          this.currentTrafficDataKZD.SONST.amount++;
          this.currentTrafficDataKZD.SONST.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataKZD.SONST.averageSpeed,
            this.currentTrafficDataKZD.SONST.amount
          );
          this.currentTrafficDataLZD.SONST.amount++;
          this.currentTrafficDataLZD.SONST.averageSpeed = this.updateAverageSpeed(
            this.currentTrafficDataLZD.SONST.averageSpeed,
            this.currentTrafficDataLZD.SONST.amount
          );
        }
        update();
      }, randomTime);
    };
    update();
  }

  private sendSingleTrafficData() {
    let trafficData: TrafficData = {
      timestamp: new Date(),
      type: Math.floor(Math.random() * 10) + 1,
      speed: Math.random() * (100 - 20) + 20,
      length: Math.random() * (100 - 20) + 20,
    };
    this.socketClient?.emit('singleTrafficData', trafficData);
  }

  public getSocketClient(): Socket | null {
    return this.socketClient;
  }
}
