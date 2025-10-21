import { Injectable } from '@nestjs/common';
import { StorageRepository } from './storage.repository';

@Injectable()
export class StorageService {
  constructor(private storageRepository: StorageRepository) {}

  uploadFile(file: Express.Multer.File, folder: string = ''): Promise<string> {
    return this.storageRepository.uploadFile(file, folder);
  }

  deleteFile(key: string): Promise<void> {
    return this.storageRepository.deleteFile(key);
  }

  getFileUrl(key: string): string {
    return this.storageRepository.getFileUrl(key);
  }

  getFile(key: string): Promise<Buffer> {
    return this.storageRepository.getFile(key);
  }
}
