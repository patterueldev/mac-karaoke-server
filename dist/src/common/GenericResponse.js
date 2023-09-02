"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GenericResponse {
    constructor(data, message, status) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
    static success(data) {
        return new GenericResponse(data, 'OK', 200);
    }
    static error(message) {
        return new GenericResponse(null, message, 500);
    }
}
exports.default = GenericResponse;
