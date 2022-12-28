import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { IUserService } from 'src/users/services/user/user.interface';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'ft') {
  constructor(
    private httpService: HttpService,
    @Inject('USER_SERVICE') private readonly userService: IUserService,
  ) {
    super({
      authorizationURL: process.env.FT_AUTHORIZATION_URL,
      tokenURL: process.env.FT_TOKEN_URL,
      clientID: process.env.FT_CLIENT_ID,
      clientSecret: process.env.FT_CLIENT_SECRET,
      callbackURL: process.env.FT_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string) {
    const req = this.httpService.get(`https://api.intra.42.fr/v2/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    try {
      const { data } = await lastValueFrom(req);
      if (!data) throw new UnauthorizedException();
      const { login: intra_id, email, image, displayname: username } = data;
      let image_url = image.versions.small;
      if (image_url === undefined || null) {
        image_url = process.env.DEFAULT_IMAGE_URL;
      }
      const userDetails = { intra_id, email, image_url, username };
      return this.userService.validateUser(userDetails);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Failed to authenticate by 42API');
    }
  }
}
