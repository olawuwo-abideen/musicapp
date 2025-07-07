import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class Validate2faTokenDTO {

@ApiProperty({
required: true,
description: 'Validate 2FA token',
example: '972238',
})
@IsNotEmpty()
@IsString()
token: string;
}
