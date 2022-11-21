import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

  async getOtp(userID: number) {
    const user = await this.userRepository.findOneBy({ id: userID });
    return user;
  }

  async setOtp(id: number, two_factor: boolean) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      await this.userRepository.save({ ...user, two_factor });
    }
  }
}
