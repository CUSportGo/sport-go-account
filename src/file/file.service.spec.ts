import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;

  const mockFileClient = {
    uploadFile: jest.fn(),
    getSignedUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: 'FILE_PACKAGE',
          useValue: mockFileClient,
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
