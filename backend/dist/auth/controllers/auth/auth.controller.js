"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const ft_auth_guard_1 = require("../../guards/ft-auth.guard");
const auth_service_1 = require("../../services/auth/auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    login() { }
    async redirect(req, res) {
        console.log('sucess, req.user:', req.user);
        res.cookie('Authentication', req.user.accessToken, {
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            maxAge: 360 * 1000,
        });
        res.cookie('Refresh', req.user.refreshToken, {
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            maxAge: 360 * 1000,
        });
    }
    profile() { }
    logout() { }
};
__decorate([
    (0, common_1.UseGuards)(ft_auth_guard_1.FtAuthGurad),
    (0, common_1.Get)('login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(ft_auth_guard_1.FtAuthGurad),
    (0, common_1.Redirect)('http://localhost:8000/Home', 301),
    (0, common_1.Get)('redirect'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "redirect", null);
__decorate([
    (0, common_1.Get)('profile'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "profile", null);
__decorate([
    (0, common_1.Get)('logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(0, (0, common_1.Inject)('AUTH_SERVICE')),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map