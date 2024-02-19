import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,
  ) {}

  create(CreateUserDto: CreateUserDto): Promise<User> {
    
    try {
      const newUser = new this.userModel( CreateUserDto );
      return newUser.save();
    } catch (error) {
      console.log( error.code );
    }

    // 1-Encriptar contraseña
    // 2-Guardar usuario
    // 3-Generar JsonWebToken

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
