import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { IAuthService } from '../services/auth.interface';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'ft') {
  constructor(
    private httpService: HttpService,
    @Inject('AUTH_SERVICE') private readonly authService: IAuthService,
  ) {
    super({
      authorizationURL: process.env.AUTHORIZATION_URL,
      tokenURL: process.env.TOKEN_URL,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ['public'],
    });
  }

  async validate(accessToken: string, refreshToken: string) {
    console.log('access token:', accessToken);
    console.log('refresh token:', refreshToken);
    const req = this.httpService.get(`https://api.intra.42.fr/v2/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    try {
      const { data } = await lastValueFrom(req);
      if (!data) throw new UnauthorizedException();
      const { login: intra_id, email, image_url, displayname: username } = data;
      const userDetails = { intra_id, email, image_url, username };
      console.log('intra_id: ', intra_id);
      console.log('email: ', email);
      console.log('image_url: ', image_url);
      console.log('displayname: ', username);
      return this.authService.validateUser(userDetails);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
  }
}
