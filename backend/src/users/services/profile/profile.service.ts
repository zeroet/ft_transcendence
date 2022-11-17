import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsUtils, Repository } from "typeorm";
import { User } from "src/typeorm";

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    changname(id: number, user: string) {
        this.userRepository.findOneBy({id})
        .then(() => console.log({id}));
    }
}