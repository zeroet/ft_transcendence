import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm';
import { IUserService } from '../user/user.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>, // private readonly mailerService: MailerService,
    @Inject('USER_SERVICE') private userService: IUserService,
  ) {}

  async updateUserName(userID: number, newUserName: string) {
    await this.userRepository.update(userID, {
      username: newUserName,
    });
    const user = this.userRepository.findOneBy({ id: userID });
    console.log('in the username');
    console.log((await user).username);
  }

  async updateUserImage(userID: number, newUserImage: string) {
    await this.userRepository.update(userID, {
      image_url: newUserImage,
    });
  }
}
