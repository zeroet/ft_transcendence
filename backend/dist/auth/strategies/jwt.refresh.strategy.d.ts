import { Strategy } from 'passport-jwt';
import { Request } from 'express';
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    constructor();
    validate(req: Request, payload: any): Promise<any>;
}
export {};
