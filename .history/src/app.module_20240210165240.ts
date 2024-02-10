import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ 
    ConfigModule.forRoot(),
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017')
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  constructor() {
    console.log( process.env );
  }

}
