import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repository/user.repository';
import { SportAreaListRepository } from '../repository/sportAreaList.repository';
import { FileService } from '../file/file.service';

describe('UserService', () => {
  let service: UserService;
  const mockUserRepository = {
    findUserById: jest.fn(),
    update: jest.fn(),
    exclude: jest.fn(),

  };
  const mockFileService = {

  }

  const mockSportAreaListRepo = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: SportAreaListRepository,
          useValue: mockSportAreaListRepo,
        },
        {
          provide: FileService,
          useValue: mockFileService,

        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
