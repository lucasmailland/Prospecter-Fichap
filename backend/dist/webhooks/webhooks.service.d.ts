export declare class WebhooksService {
    handleHubspotWebhook(payload: any): Promise<{
        message: string;
        payload: any;
    }>;
    processWebhook(type: string, data: any): Promise<{
        message: string;
        type: string;
        data: any;
    }>;
}
