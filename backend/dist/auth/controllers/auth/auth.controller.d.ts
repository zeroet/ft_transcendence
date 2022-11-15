import { AuthService } from 'src/auth/services/auth/auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(): void;
    redirect(req: any): Promise<string>;
    profile(): void;
    logout(): void;
}
