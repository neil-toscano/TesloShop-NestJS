import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { validRoles } from 'src/auth/interfaces/valid-roles.interface';
import { Auth } from 'src/auth/decorator/auth.decorator';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth(validRoles.user)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
