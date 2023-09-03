import qrcode from 'qrcode';
import { serverPort } from '../../dependencies';
import os from 'os';

export default interface GenerateServerQRUseCase {
  execute(): Promise<string>; // not sure about the return type yet; but can be a string for either url or base64 image
}

export class DefaultGenerateServerQRUseCase implements GenerateServerQRUseCase {

  async execute(): Promise<string> {
    const networkInterfaces = os.networkInterfaces();
    var lanIpAddress: string | undefined;

    Object.keys(networkInterfaces).forEach((interfaceName) => {
      const interfaces = networkInterfaces[interfaceName];
      if (interfaces === undefined) return;
      
      interfaces.forEach((iface) => {
        // Filter out non-IPv4 and internal addresses
        if (iface.family === 'IPv4' && !iface.internal) {
          lanIpAddress = iface.address;
        }
      });
    });

    if (lanIpAddress === undefined) { throw new Error('Unable to find LAN IP address'); }

    var port = serverPort;
    var url = `http://${lanIpAddress}:${port}`;
    var object = new ServerQRJson('baseURL', url, 'Base URL for the Karaoke Server', 'Scan this QR code to connect to the server');
    var json = JSON.stringify(object);
    const qr = await qrcode.toDataURL(json, { errorCorrectionLevel: 'H', scale: 7});
    return qr;
  }
}

class ServerQRJson {
  type: string;
  data: any;
  title: string;
  description: string;
  metadata: object | undefined;

  constructor(type: string, data: any, title: string, description: string, metadata?: object) {
    this.type = type;
    this.data = data;
    this.title = title;
    this.description = description;
    this.metadata = metadata;
  }
}