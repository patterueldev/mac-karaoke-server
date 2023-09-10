import { Socket } from "socket.io";
import { EventEmitter } from "stream";
import { Event } from "./Event";

export default interface EmitterManager {
  setupPlayerEmitter(emit: EventEmitter): void;
  disposePlayerEmitter(): void;
  addControllerEmitter(emit: EventEmitter): void;
  removeControllerEmitter(id: String): void;

  emitToAll(event: Event, ...args: any[]): string[];
  emitToPlayer(event: Event, ...args: any[]): string | undefined;
  emitToControllers(event: Event, ...args: any[]): string[];
  emitToController(id: String, event: Event, ...args: any[]): string | undefined;
}

export class SocketIOManager implements EmitterManager {
  private playerEmitter: EventEmitter | undefined;
  private controllerEmitters: Map<String, EventEmitter>;

  constructor() {
    this.controllerEmitters = new Map<String, EventEmitter>();
  }

  getAllEmitters(): EventEmitter[] {
    if (this.playerEmitter) {
      return [this.playerEmitter, ...this.controllerEmitters.values()];
    }
    return [...this.controllerEmitters.values()];
  }

  setupPlayerEmitter(emit: EventEmitter): void {
    this.playerEmitter = emit;
  }

  disposePlayerEmitter(): void {
    this.playerEmitter = new EventEmitter();
  }

  addControllerEmitter(emit: EventEmitter): void {
    let socket = emit as Socket;
    this.controllerEmitters.set(socket.id, socket);
  }

  removeControllerEmitter(id: String): void {
    this.controllerEmitters.delete(id);
  }

  emitToAll(event: Event, ...args: any[]) {
    var ids: string[] = [];
    this.getAllEmitters().forEach((emitter) => {
      emitter.emit(event, ...args);
      let socket = emitter as Socket;
      ids.push(socket.id);
    });
    return ids;
  }
  emitToPlayer(event: Event, ...args: any[]) {
    if (this.playerEmitter) {
      this.playerEmitter.emit(event, ...args);
      let socket = this.playerEmitter as Socket;
      return socket.id;
    }
  }
  emitToControllers(event: Event, ...args: any[]) {
    var ids: string[] = [];
    this.controllerEmitters.forEach((emitter) => {
      emitter.emit(event, ...args);
      let socket = emitter as Socket;
      ids.push(socket.id);
    });
    return ids;
  }
  emitToController(id: String, event: Event, ...args: any[]) {
    let emitter = this.controllerEmitters.get(id);
    if (emitter) {
      emitter.emit(event, ...args);
      let socket = emitter as Socket;
      return socket.id;
    }
  }
}