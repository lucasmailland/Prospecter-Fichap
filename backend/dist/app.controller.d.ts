export declare class AppController {
    healthCheck(): {
        status: string;
        timestamp: string;
        uptime: number;
    };
    getInfo(): {
        name: string;
        version: string;
        description: string;
        docs: string;
    };
}
