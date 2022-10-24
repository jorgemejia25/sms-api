import { IsOptional, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SMSDto {
  username?: string;
  password?: string;

  @ApiProperty({
    description:
      'Los números de teléfono a los que se enviará el mensaje, separados por comas.',
    example: '12345678,98765432',
  })
  @IsString()
  phonenumber: string;

  @ApiProperty({
    description: 'El mensaje que se enviará',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'El puerto GSM del mensaje',
    example: 'xxx-1',
  })
  @IsString()
  @IsOptional()
  port?: number;

  @ApiProperty({
    description: 'Si se retorna en JSON o String',
    example: 'JSON',
    enum: ['JSON', 'STRING'],
  })
  @IsString()
  @IsOptional()
  report?: string = 'JSON';

  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  timeout?: number = 20;
}
