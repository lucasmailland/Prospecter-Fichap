import { HubspotService } from './hubspot.service';
export declare class HubspotController {
    private readonly hubspotService;
    constructor(hubspotService: HubspotService);
    getContacts(): Promise<any>;
    syncContacts(): Promise<{
        message: string;
    }>;
}
