import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { UserDetails } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IAuthService } from '../auth.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async validateUser(userDetails: UserDetails) {
    const { intra_id } = userDetails;
    const user = await this.userRepository.findOneBy({ intra_id });
    console.log(user);
    if (user) return user;
    return this.createUser(userDetails);
  }

  createUser(userDetails: UserDetails) {
    console.log('creating a new user');
    const user = this.userRepository.create(userDetails);
    return this.userRepository.save(user);
  }

  getUser() {}
}
