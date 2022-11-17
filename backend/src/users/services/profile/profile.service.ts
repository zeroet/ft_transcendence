import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/typeorm";

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}
    async updateUserName(userID: number, newUserName:string){
        await this.userRepository.update(userID, {
            username: newUserName
        });
        const user = this.userRepository.findOneBy({id:1});
        console.log("in the username");
        console.log((await user).username);
    }
}