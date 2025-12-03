import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Signature } from 'viem';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('test-token')
  getTestToken() {
    if (process.env.REACT_APP_NODE_ENV !== "dev") {
      throw new UnauthorizedException('Available only in development mode');
    }
    return this.authService.issueJwt('0xTEST_ADDRESS');
  }

  @Post('request-nonce')
  getNonce(@Body('address') address: string) {
    return this.authService.generateNonce(address);
  }

  @Post('login')
  async login(@Body() body: { address: string; signature: Signature }) {
    const isValid = await this.authService.verifySignature(body.address, body.signature);
    if (!isValid) throw new UnauthorizedException('Invalid signature');
    return this.authService.issueJwt(body.address);
  }

  @Post('refresh-token')
  refresh(@Body('refresh_token') refreshToken: string) {
  return this.authService.refreshAccessToken(refreshToken);
}
}