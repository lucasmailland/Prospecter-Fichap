import { WebhooksService } from './webhooks.service';
export declare class WebhooksController {
    private readonly webhooksService;
    constructor(webhooksService: WebhooksService);
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
