class GenericResponse {
    data: any;
    message: string;
    status: number;

    constructor(data: any, message: string, status: number) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    static success(data: any) {
        return new GenericResponse(data, 'OK', 200);
    }

    static error(message: string) {
        return new GenericResponse(null, message, 500);
    }
}

export default GenericResponse;