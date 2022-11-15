import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/CreateUser.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getUsers(): Promise<void>;
    createUser(CreateUserDTO: CreateUserDTO): void;
}
