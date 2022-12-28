import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async updateUserName(userId: number, newUserName: string) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:userId', { userId })
      .getOne();
    if (!user) {
      throw new NotFoundException(`User of id:${userId} not found`);
    }
    const userWithSameUsername = await this.userRepository
      .createQueryBuilder('users')
      .where('users.username=:newUserName', { newUserName })
      .getOne();
    if (userWithSameUsername) {
      throw new BadRequestException(`User name:${newUserName} already exists`);
    }
    user.username = newUserName;
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }

  async updateUserImage(userId: number, newUserImage: string) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.user_id=:userId', { userId })
      .getOne();
    if (!user) {
      throw new NotFoundException(`User of id:${userId} not found`);
    }
    user.image_url = newUserImage;
    return await this.userRepository.save(user);
  }
}
