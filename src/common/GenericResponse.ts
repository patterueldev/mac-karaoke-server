import { Response } from "express";

class GenericResponse {
    data: any;
    message: string;
    status: number;

    constructor(data: any, message: string, status: number) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    private static success(data: any, message: string = 'OK') {
        return new GenericResponse(data, message, 200);
    }

    private static failure(error: any, code?: number) {
        const message = error.message || error;
        var status = code || 500;
        return new GenericResponse(null, message, status);
    }

    private static async execute(func: () => Promise<any>): Promise<GenericResponse> {
        try {
            var result = await func();
            // check if result is not void
            if (result) {
                return GenericResponse.success(result);
            } else {
                return GenericResponse.failure('No data');
            }
        } catch (error) {
            return GenericResponse.failure(error);
        }
    }

    static async send(res: Response, func: () => Promise<any>) {
        var response = await GenericResponse.execute(func);
        res.status(response.status).send(response);
    }
}

export default GenericResponse;