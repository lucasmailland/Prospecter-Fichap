import { CreateProspectDto } from '../dto/prospect.dto';
export declare class CreateProspectCommand {
    readonly data: CreateProspectDto;
    readonly userId: number;
    constructor(data: CreateProspectDto, userId: number);
}
