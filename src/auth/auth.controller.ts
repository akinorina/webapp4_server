import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { GoogleOAuthGuard } from './google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Request() req: any) {
    return this.authService.signIn(req.user);
  }

  @Public()
  @Post('signout')
  async signOut() {
    return this.authService.signOut();
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get('signin-google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Public()
  @Get('signin-google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res) {
    const access_token = await this.authService.googleSignIn(req);
    const toUrl = '/signin-google-redirect?access_token=' + access_token;
    res.status(302).redirect(toUrl);
  }
}
