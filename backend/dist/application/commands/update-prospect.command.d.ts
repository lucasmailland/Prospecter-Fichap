import { UpdateProspectDto } from '../dto/prospect.dto';
export declare class UpdateProspectCommand {
    readonly id: number;
    readonly data: UpdateProspectDto;
    readonly userId: number;
    constructor(id: number, data: UpdateProspectDto, userId: number);
}
