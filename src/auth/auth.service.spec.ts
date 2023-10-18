import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../repository/user.repository';
import { BlacklistRepository } from '../repository/blacklist.repository';
describe('AuthService', () => {
  let service: AuthService;
  const mockJwtService = {
    sign: jest.fn(),
  };
  const mockBlacklistService = {
    insertToken: jest.fn(),
    check: jest.fn(),
  };
  const mockUserRepository = {
    getUserByEmail: jest.fn(),
    updateRefreshToken: jest.fn()
  }

  const mockConfigService = {
    get: jest.fn(),
  }
  const mockBlacklistRepository = {
    addOutdatedToken: jest.fn(),
  }

  const mockEmailService = {
    emit: jest.fn(),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },

        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },

        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: BlacklistRepository,
          useValue: mockBlacklistRepository,
        },
        {
          provide: 'EMAIL_SERVICE',
          useValue: mockEmailService,
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
