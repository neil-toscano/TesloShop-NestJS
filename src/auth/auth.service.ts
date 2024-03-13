import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    try {
      const user = this.usersRepository.create(createUserDto);
      await this.usersRepository.save(user);
      delete user.password;
      return {
        ...user,
        token: this.getJWToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
      select: {
        email: true,
        password: true,
        id: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('email/password incorrect');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('email/password incorrect');
    return {
      ...user,
      token: this.getJWToken({ id: user.id }),
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('please check server logs');
  }

  private getJWToken(payload: JwtPayload) {
    const access_token = this.jwtService.sign(payload);
    return access_token;
  }
}
