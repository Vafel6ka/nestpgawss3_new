import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { recoverMessageAddress, Signature } from 'viem';
import { requiredEnvs } from '../../required-envs';
import { ConfigService } from '@nestjs/config';
import { SignJWT, jwtVerify } from 'jose';

const nonces = new Map<string, string>();
const refreshTokens = new Map<string, string>();

@Injectable()
export class AuthService {
  private expirationAccToken: string;
  private expirationRefToken: string;
  private jwtSecret: string;

  constructor(private configService: ConfigService) {
    // Перевірка всіх обов'язкових env
    requiredEnvs.forEach((key) => {
      if (!this.configService.get<string>(key)) {
        throw new InternalServerErrorException(`Environment variable ${key} is required but not set`);
      }
    });

    this.expirationAccToken = this.configService.get<string>('REACT_APP_JWT_ACCESS_EXP')!;
    this.expirationRefToken = this.configService.get<string>('REACT_APP_JWT_REFRESH_EXP')!;
    this.jwtSecret = this.configService.get<string>('REACT_APP_JWT_SECRET_KEY')!;
  }

  generateNonce(address: string) {
    const nonce = Math.floor(Math.random() * 1000000).toString();
    nonces.set(address.toLowerCase(), nonce);
    return { nonce };
  }

  async verifySignature(address: string, signature: Signature): Promise<boolean> {
    const nonce = nonces.get(address.toLowerCase());
    if (!nonce) return false;

    const message = `Login to MyApp with address: ${nonce}`;
    const recovered = recoverMessageAddress({ message, signature });

    return (await recovered).toLowerCase() === address.toLowerCase();
  }

  async issueJwt(address: string) {
    const payload = { address };

    const accessToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(this.expirationAccToken)
      .sign(new TextEncoder().encode(this.jwtSecret));

    const refreshToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(this.expirationRefToken)
      .sign(new TextEncoder().encode(this.jwtSecret));

    refreshTokens.set(address.toLowerCase(), refreshToken);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async verifyRefreshToken(token: string): Promise<string | null> {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(this.jwtSecret));
      const storedToken = refreshTokens.get((payload as any).address.toLowerCase());
      if (storedToken !== token) return null;
      return (payload as any).address;
    } catch {
      return null;
    }
  }

  async refreshAccessToken(refreshToken: string) {
    const address = await this.verifyRefreshToken(refreshToken);
    if (!address) throw new UnauthorizedException('Invalid refresh token');

    const accessToken = await new SignJWT({ address })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(this.expirationAccToken)
      .sign(new TextEncoder().encode(this.jwtSecret));

    return { access_token: accessToken };
  }
}
