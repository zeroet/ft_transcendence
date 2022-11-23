import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { IAuthService } from '../services/auth/auth.interface';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'ft') {
  constructor(
    private httpService: HttpService,
    @Inject('AUTH_SERVICE') private readonly authService: IAuthService,
  ) {
    super({
      authorizationURL: process.env.FT_AUTHORIZATION_URL,
      tokenURL: process.env.FT_TOKEN_URL,
      clientID: process.env.FT_CLIENT_ID,
      clientSecret: process.env.FT_CLIENT_SECRET,
      callbackURL: process.env.FT_CALLBACK_URL,
      // scope: ['public'],
    });
  }

  async validate(accessToken: string, refreshToken: string) {
    // console.log('validate() ');
    const req = this.httpService.get(`https://api.intra.42.fr/v2/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    try {
      console.log('af get request to 42');
      const { data } = await lastValueFrom(req);
      if (!data) throw new UnauthorizedException();
      // console.log('data:', data);
      // console.log('data.image_url:', data.image_url);
      const { login: intra_id, email, image, displayname: username } = data;
      const image_url = image.versions.small;
      console.log('intra_id: ', intra_id);
      console.log('email: ', email);
      console.log('image_url: ', image_url);
      console.log('username: ', username);
      const userDetails = { intra_id, email, image_url, username };
      return this.authService.validateUser(userDetails);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
  }
}
