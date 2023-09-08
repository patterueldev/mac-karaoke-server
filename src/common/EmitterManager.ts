import { Socket } from "socket.io";
import { EventEmitter } from "stream";
import { Event } from "./Event";

export default interface EmitterManager {
  setupPlayerEmitter(emit: EventEmitter): void;
  disposePlayerEmitter(): void;
  addControllerEmitter(emit: EventEmitter): void;
  removeControllerEmitter(id: String): void;

  emitToAll(event: Event, ...args: any[]): void;
  emitToPlayer(event: Event, ...args: any[]): void;
  emitToControllers(event: Event, ...args: any[]): void;
  emitToController(id: String, event: Event, ...args: any[]): void;
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
    let socket = emit as Socket;
    let current = this.playerEmitter as Socket;
    if (this.playerEmitter) {
      if (socket.id !== current.id) {
        throw new Error("Player client already exists");
      }
    }
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
    this.getAllEmitters().forEach((emitter) => {
      emitter.emit(event, ...args);
    });
  }
  emitToPlayer(event: Event, ...args: any[]) {
    if (this.playerEmitter) {
      this.playerEmitter.emit(event, ...args);
    }
  }
  emitToControllers(event: Event, ...args: any[]) {
    this.controllerEmitters.forEach((emitter) => {
      emitter.emit(event, ...args);
    });
  }
  emitToController(id: String, event: Event, ...args: any[]) {
    let emitter = this.controllerEmitters.get(id);
    if (emitter) {
      emitter.emit(event, ...args);
    }
  }
}