import { JwtService } from '@nestjs/jwt';
import { User } from 'src/typeorm';
import { UserDetails } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IAuthService } from '../auth.interface';
import { CookieOptions } from 'express';
export declare class AuthService implements IAuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    defaultCookieOptions: CookieOptions;
    refreshTokenCookieOptions: CookieOptions;
    accessTokenCookieOptions: CookieOptions;
    hashData(data: string): any;
    validateUser(userDetails: UserDetails): Promise<User>;
    createUser(userDetails: UserDetails): Promise<User>;
    getTokens(id: number): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getAccessToken(id: number): string;
    getRefreshToken(id: number): string;
    setAccessToken(res: any, id: number): void;
    setRefreshToken(res: any, id: number): void;
    updateRefreshTokenHash(id: number, refreshToken: string): Promise<void>;
}
