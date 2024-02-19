import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as bcryptjs from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { LoginDto } from '../../.history/src/auth/dto/login.dto_20240219162915';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,
  ) {}

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    
    try {
      const { password, ...userData } = CreateUserDto;

      // TODO 1-Encriptar contraseña
      const newUser = new this.userModel({
        password: bcryptjs.hashSync( password, 10 ),
        ...userData
      });
      await newUser.save();
      // * Borramos el campo password del objeto
      const { password:_, ...user } = newUser.toJSON();
      return user;
      
      // TODO 2-Guardar usuario
      
      // TODO 3-Generar JWT
      
    } catch (error) {
      if( error.code === 11000 ) {
        throw new BadRequestException(`${ CreateUserDto.email } already exists!`)
      }
      throw new InternalServerErrorException('Something terrible happen!!');
    }

  }

  login( loginDto: LoginDto ) {
    console.log({ loginDto: loginDto });
    /**
     * User { _id, name, email, roles }
     * Token -> ADSSAD.ADADSAS.DASDAD
     */
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
}
