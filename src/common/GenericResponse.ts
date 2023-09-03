class GenericResponse {
    data: any;
    message: string;
    status: number;

    constructor(data: any, message: string, status: number) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    static success(data: any, message: string = 'OK') {
        return new GenericResponse(data, message, 200);
    }

    static failure(error: any, code?: number) {
        const message = error.message || error;
        var status = code || 500;
        return new GenericResponse(null, message, status);
    }
}

export default GenericResponse;