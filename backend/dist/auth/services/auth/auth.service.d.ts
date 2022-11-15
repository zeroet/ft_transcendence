import { JwtService } from '@nestjs/jwt';
import { User } from 'src/typeorm';
import { UserDetails } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IAuthService } from '../auth.interface';
export declare class AuthService implements IAuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    hashData(data: string): any;
    validateUser(userDetails: UserDetails): Promise<User>;
    createUser(userDetails: UserDetails): Promise<User>;
    getTokens(id: number): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getAccessToken(id: number): string;
    getRefreshToken(id: number): string;
    updateRefreshTokenHash(id: number, refreshToken: string): Promise<void>;
}
