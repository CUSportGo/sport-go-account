import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const authGrpcOptions: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(__dirname, 'proto/auth.proto'),
      url: 'localhost:8081',
    },
  };

  app.connectMicroservice(authGrpcOptions);

  await app.startAllMicroservices();
  await app.listen(8082);
}
bootstrap();
