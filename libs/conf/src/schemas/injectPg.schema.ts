import { IsOptional, IsString, ValidationSchema } from 'class-validator';
import { PoolConfig } from 'pg';

export class InjectPgSchema implements PoolConfig {
  @IsString()
  user!: string;

  @IsString()
  password!: string;
}
