import { HttpService } from '@nestjs/axios';
import { IAuthService } from '../services/auth.interface';
declare const FtStrategy_base: new (...args: any[]) => import("passport-oauth2");
export declare class FtStrategy extends FtStrategy_base {
    private httpService;
    private readonly authService;
    constructor(httpService: HttpService, authService: IAuthService);
    validate(accessToken: string, refreshToken: string): Promise<any>;
}
export {};
