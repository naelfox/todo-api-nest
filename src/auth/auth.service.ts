import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, private jwtService: JwtService) { }


    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas')
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const { password: _, ...result } = user;

        return result;
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);


        const payload = { sub: user.id, email: user.email, role: user.role };


        return {
            access_token: this.jwtService.sign(payload),
            user
        }

    }
}
