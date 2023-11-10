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
      url: `0.0.0.0:${
        process.env.AUTH_GRPC_PORT ? parseInt(process.env.AUTH_GRPC_PORT) : 8081
      }`,
    },
  };

  const userGrpcOptions: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, 'proto/user.proto'),
      url: `0.0.0.0:${
        process.env.USER_GRPC_PORT ? parseInt(process.env.USER_GRPC_PORT) : 8087
      }`,
    },
  };

  app.connectMicroservice(authGrpcOptions);
  app.connectMicroservice(userGrpcOptions);
  await app.startAllMicroservices();
  await app.listen(
    process.env.USER_REST_PORT ? parseInt(process.env.USER_REST_PORT) : 8082,
  );
}
bootstrap();
