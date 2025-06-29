import { CreateProspectDto } from '../dto/prospect.dto';
import { IProspectRepository } from '../../domain/repositories/prospect.repository.interface';
export declare class CreateProspectHandler {
    private readonly prospectRepository;
    constructor(prospectRepository: IProspectRepository);
    execute(createProspectDto: CreateProspectDto): Promise<import("../../domain/entities").Prospect>;
}
