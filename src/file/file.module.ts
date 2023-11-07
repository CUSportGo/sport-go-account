import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { FileService } from './file.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'FILE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'file',
          protoPath: join(__dirname, '../proto/file.proto'),
          url: process.env.FILE_GRPC_URL,
        },
      },
    ]),
  ],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
