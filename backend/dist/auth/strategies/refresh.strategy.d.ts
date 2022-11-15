import { Strategy } from 'passport-jwt';
import { Request } from 'express';
declare const RefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class RefreshStrategy extends RefreshStrategy_base {
    constructor();
    validate(req: Request, payload: any): Promise<any>;
}
export {};
