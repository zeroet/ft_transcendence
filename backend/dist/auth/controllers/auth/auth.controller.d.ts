import { AuthService } from 'src/auth/services/auth/auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(): string;
    redirect(): Promise<string>;
    profile(): void;
    logout(): void;
}
