import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageRepository } from './storage.repository';

@Module({
  providers: [StorageService, StorageRepository],
  exports: [StorageService],
})
export class StorageModule {}
