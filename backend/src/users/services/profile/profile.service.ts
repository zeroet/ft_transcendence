import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/typeorm";
import { serialize } from "v8";

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}
    async updateUserName(userID: number, newUserName:string){
        await this.userRepository.update(userID, {
            username: newUserName
        });
        const user = this.userRepository.findOneBy({id: userID});
        console.log("in the username");
        console.log((await user).username);
    }

    async updateUserImage(userID: number, newUserImage:string){
        await this.userRepository.update(userID, {
            image_url: newUserImage
        });
    }

    async getOtp(userID: number) {
        const user = await this.userRepository.findOneBy({ id: userID });
        return user;
    }

    async setOtp(id: number, set: boolean) {
        if (set === true)
            await this.userRepository.update(id, { two_factor: true });
        else (set === false)
            await this.userRepository.update(id, { two_factor: false });
    }
}