import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
constructor(private readonly configService: ConfigService) {}

createTypeOrmOptions(): TypeOrmModuleOptions {
const synchronize = true;

return {
type: 'postgres',
host: this.configService.get<string>('POSTGRES_HOST'),
port: this.configService.get<number>('POSTGRES_PORT'),
username: this.configService.get<string>('POSTGRES_USER'),
password: this.configService.get<string>('POSTGRES_PASSWORD'),
database: this.configService.get<string>('POSTGRES_DATABASE'),
ssl: {
rejectUnauthorized: false
},
autoLoadEntities: true,
synchronize,
};
}
}
