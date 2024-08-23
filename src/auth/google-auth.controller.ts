import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleOAuthGuard } from './google-auth.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class GoogleAuthController {
  constructor(private readonly authService: GoogleAuthService) {}

  @Public()
  @Get('signin-google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Public()
  @Get('signin-google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res) {
    const access_token = await this.authService.signInGoogle(req);
    const toUrl = '/signin-google-redirect?access_token=' + access_token;
    res.status(302).redirect(toUrl);
  }
}
