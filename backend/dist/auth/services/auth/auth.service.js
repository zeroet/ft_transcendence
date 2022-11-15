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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("../../../typeorm");
const typeorm_3 = require("typeorm");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    hashData(data) {
        return bcrypt.hash(data, 12);
    }
    async validateUser(userDetails) {
        const { intra_id } = userDetails;
        const user = await this.userRepository.findOneBy({ intra_id });
        if (user)
            return user;
        return this.createUser(userDetails);
    }
    createUser(userDetails) {
        console.log('creating a new user');
        const user = this.userRepository.create(userDetails);
        return this.userRepository.save(user);
    }
    async getTokens(id) {
        const [access, refresh] = await Promise.all([
            this.jwtService.signAsync({
                sub: id,
            }, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: Number.parseInt(process.env.JWT_ACCESS_EXPIRATION_TIME) * 1000,
            }),
            this.jwtService.signAsync({
                sub: id,
            }, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: Number.parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME) * 1000,
            }),
        ]);
        return { access_token: access, refresh_token: refresh };
    }
    getAccessToken(id) {
        const access = this.jwtService.sign({
            sub: id,
        }, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: Number.parseInt(process.env.JWT_ACCESS_EXPIRATION_TIME) * 1000,
        });
        return access;
    }
    getRefreshToken(id) {
        const refresh = this.jwtService.sign({
            sub: id,
        }, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: Number.parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME) * 1000,
        });
        return refresh;
    }
    async updateRefreshTokenHash(id, refreshToken) {
        const hash = await this.hashData(refreshToken);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(typeorm_2.User)),
    __metadata("design:paramtypes", [typeorm_3.Repository,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map