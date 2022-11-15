import { AuthService } from 'src/auth/services/auth/auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<string>;
    redirect(): string;
    profile(): void;
    logout(): void;
}
