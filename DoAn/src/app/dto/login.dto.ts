import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    userName :string ;
  
    @IsString()
    @IsNotEmpty()
    password :string ;

    constructor(userName: string, password: string) {
      this.userName = userName;
      this.password = password;
    }
}