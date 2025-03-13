import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';

@Injectable()
export class IsValidUUIDPipe extends ParseUUIDPipe {
  constructor() {
    super({ errorHttpStatusCode: 400 });
  }

  async transform(value: any, metadata: ArgumentMetadata): Promise<string> {
    try {
      return await super.transform(value, metadata);
    } catch (error) {
      // Custom error message
      throw new BadRequestException(
        'Invalid UUID format. Please provide a valid UUID.',
      );
    }
  }
}
