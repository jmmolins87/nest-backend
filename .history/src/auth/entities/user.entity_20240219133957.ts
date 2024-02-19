import { Schema } from "@nestjs/mongoose";


@Schema()
export class User {
    email: string;
    name: string;
    password: string;
    isActive: boolean;
    roles: string[];
}
