import { Strategy } from 'passport-jwt';
import { UserService } from 'src/users/services/user/user.service';
declare const JwtAccessStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtAccessStrategy extends JwtAccessStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(payload: any): Promise<void>;
}
export {};
