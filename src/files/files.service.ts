import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../static/uploads', imageName);
    if (!existsSync(path)) {
      throw new BadRequestException(`No product found with Image ${imageName}`);
    }

    return path;
  }
}
