import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  UnauthorizedException
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { 
  CreateUserDto, 
  UpdateAuthDto, 
  LoginDto, 
  RegisterUserDto 
} from './dto';

import { User } from './entities/user.entity';

import { JWTpayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';


@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    
    try {
      const { password, ...userData } = CreateUserDto;

      // * 1- Encriptar contraseña
      const newUser = new this.userModel({
        password: bcryptjs.hashSync( password, 10 ),
        ...userData
      });
      await newUser.save();
      // * Borramos el campo password del objeto
      const { password:_, ...user } = newUser.toJSON();
      return user;
      
    } catch (error) {
      if( error.code === 11000 ) {
        throw new BadRequestException(`${ CreateUserDto.email } already exists!`)
      }
      throw new InternalServerErrorException('Something terrible happen!!');
    }
    
  }
  
  // * 2- Guardar usuario
  async register( registerUserDto: RegisterUserDto ): Promise<LoginResponse> {

    const user = await this.create( registerUserDto );

    return {
      user,
      token: this.getJWToken({ id: user._id })
    }
  }

  async login( loginDto: LoginDto ): Promise<LoginResponse> {
    
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    
    // * Verificamos el correo
    if( !user ) {
      throw new UnauthorizedException( 'Not valid credentials - email' );
    }
    // * Verificamos el password
    if( !bcryptjs.compareSync( password, user.password )) {
      throw new UnauthorizedException( 'Not valid credentials - password' );
    }

    const { password:_, ...rest } = user.toJSON();
    
    return {
      user: rest,
      token: this.getJWToken({ id: user.id }),
    }
  }

  // * 3- Generar JWT (Json Web Token)
  getJWToken( payload: JWTpayload ) {
    const token = this.jwtService.sign( payload );
    return token;
  }
  
  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById( id: string ) {
    const user = await this.userModel.findById( id );
    const { password, ...rest } = user.toJSON();

    return rest;
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
