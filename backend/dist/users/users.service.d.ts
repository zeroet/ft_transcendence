import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDTO } from './dto/CreateUser.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findUsers(): Promise<User[]>;
    createUser(userDetails: CreateUserDTO): void;
}
