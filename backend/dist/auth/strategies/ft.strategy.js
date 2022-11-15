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
exports.FtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_oauth2_1 = require("passport-oauth2");
const rxjs_1 = require("rxjs");
const axios_1 = require("@nestjs/axios");
let FtStrategy = class FtStrategy extends (0, passport_1.PassportStrategy)(passport_oauth2_1.Strategy, 'ft') {
    constructor(httpService, authService) {
        super({
            authorizationURL: process.env.AUTHORIZATION_URL,
            tokenURL: process.env.TOKEN_URL,
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
            scope: ['public'],
        });
        this.httpService = httpService;
        this.authService = authService;
    }
    async validate(accessToken, refreshToken) {
        console.log('access token:', accessToken);
        console.log('refresh token:', refreshToken);
        const req = this.httpService.get(`https://api.intra.42.fr/v2/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        try {
            const { data } = await (0, rxjs_1.lastValueFrom)(req);
            if (!data)
                throw new common_1.UnauthorizedException();
            const { login: intra_id, email, image_url, displayname: username } = data;
            const userDetails = { intra_id, email, image_url, username };
            console.log('intra_id: ', intra_id);
            console.log('email: ', email);
            console.log('image_url: ', image_url);
            console.log('displayname: ', username);
            const user = this.authService.validateUser(userDetails);
            return Object.assign(Object.assign({}, user), { accessToken, refreshToken });
        }
        catch (error) {
            console.error(error);
            throw new common_1.UnauthorizedException();
        }
    }
};
FtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('AUTH_SERVICE')),
    __metadata("design:paramtypes", [axios_1.HttpService, Object])
], FtStrategy);
exports.FtStrategy = FtStrategy;
//# sourceMappingURL=ft.strategy.js.map