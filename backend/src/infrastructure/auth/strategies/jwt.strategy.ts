import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService, JwtPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      issuer: 'prospecter-fichap',
      audience: 'prospecter-fichap-users',
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    // Verificar que el payload tenga los campos requeridos
    if (!payload.sub || !payload.email || !payload.role) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Verificar que el token no haya expirado
    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new UnauthorizedException('Token has expired');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
} 