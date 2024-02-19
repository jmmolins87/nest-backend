import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  UnauthorizedException
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';

import { User } from './entities/user.entity';

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

    console.log({ loginDto });

    // const { email, password } = loginDto;
    // const user = await this.userModel.findOne({ email });

    // // * Verificamos el correo
    // if( !user ) {
    //   throw new UnauthorizedException( 'Not valid credentials - email' );
    // }
    // // * Verificamos el password
    // if( !bcryptjs.compareSync( password, user.password )) {
    //   throw new UnauthorizedException( 'Not valid credentials - password');
    // }

    // return '¡¡Todo bien!!';
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
