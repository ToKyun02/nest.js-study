import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrpyt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrpyt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        const users = await this.usersService.find(email);
        if (users.length) throw new BadRequestException('email in use');

        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        const result = salt + '.' + hash.toString('hex');

        const user = await this.usersService.create(email, result);

        return user;
    }

    async signin(email: string, passwrod: string) {
        const [user] = await this.usersService.find(email);
        if (!user) {
            throw new NotFoundException('not found user');
        }
        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(passwrod, salt, 32)) as Buffer;

        if (storedHash != hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }

        return user;
    }
}
