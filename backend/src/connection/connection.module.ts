import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ConnectionGateway } from './connection.gateway';
import { ConnectionService } from './connection.service';

@Module({
    imports: [UsersModule, AuthModule],
    providers: [ConnectionGateway, ConnectionService],
})

export class ConnectionModule { }