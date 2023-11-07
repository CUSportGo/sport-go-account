import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import {
  FileServiceClient,
  UploadFileRequest,
  UploadFileResponse,
} from './file.pb';

@Injectable()
export class FileService {
  private fileClient: FileServiceClient;
  private readonly logger = new Logger(FileService.name);

  constructor(@Inject('FILE_PACKAGE') private client: ClientGrpc) {
    this.fileClient = this.client.getService<FileServiceClient>('FileService');
  }

  async uploadFile(request: UploadFileRequest): Promise<UploadFileResponse> {
    return await firstValueFrom(
      this.fileClient.uploadFile(request).pipe(
        catchError((error) => {
          this.logger.error(error);
          throw error;
        }),
      ),
    );
  }
}
