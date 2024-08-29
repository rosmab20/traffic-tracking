const mqtt = require('mqtt');

const mqttHost = process.env.MQTT_HOST || '192.168.1.201';
const protocol = 'mqtt';
const port = process.env.MQTT_PORT || 1883;

class MQTTService {
  mqttClient: any;
  host: string;
  messageCallback?: any;
  constructor(host: string, messageCallback: any) {
    this.mqttClient = null;
    this.host = host;
    this.messageCallback = messageCallback;
  }

  connectToBroker() {
    this.mqttClient = mqtt.connect(this.host);

    this.mqttClient.on('error', (err: any) => {
      console.log(err);
      this.mqttClient.end();
    });

    this.mqttClient.on('connect', () => {
      console.log(`MQTT client connected`);
    });

    this.mqttClient.on('message', (topic: any, message: any) => {
      console.log(message.toString());
      if (this.messageCallback) this.messageCallback(topic, message);
    });

    this.mqttClient.on('close', () => {
      console.log(`MQTT client disconnected`);
    });
  }

  subscribe(topic: any, options: any) {
    console.log(`Subscribing to Topic: ${topic}`);
    this.mqttClient.subscribe(topic, options);
  }

  publish(topic: any, message: any, options: any) {
    console.log(`Sending Topic: ${topic}, Message: ${message}`);
    this.mqttClient.publish(topic, message, options);
  }
}

module.exports = MQTTService;
