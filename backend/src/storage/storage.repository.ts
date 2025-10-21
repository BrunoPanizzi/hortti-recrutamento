import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageConfig } from './storage.config';

@Injectable()
export class StorageRepository implements OnModuleInit {
  private readonly logger = new Logger(StorageRepository.name);
  private s3Client: S3Client;
  private config: StorageConfig;

  constructor(private configService: ConfigService) {
    this.config = {
      endpoint: this.configService.get<string>('S3_ENDPOINT')!,
      region: this.configService.get<string>('S3_REGION')!,
      accessKeyId: this.configService.get<string>('S3_ACCESS_KEY_ID')!,
      secretAccessKey: this.configService.get<string>('S3_SECRET_ACCESS_KEY')!,
      bucketName: this.configService.get<string>('S3_BUCKET_NAME')!,
      forcePathStyle:
        this.configService.get<string>('S3_FORCE_PATH_STYLE') === 'true',
      publicUrl: this.configService.get<string>('S3_PUBLIC_URL'),
    };

    this.s3Client = new S3Client({
      endpoint: this.config.endpoint,
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
      forcePathStyle: this.config.forcePathStyle,
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
    await this.setBucketPolicy();
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      await this.s3Client.send(
        new HeadBucketCommand({ Bucket: this.config.bucketName }),
      );
      this.logger.log(`Bucket "${this.config.bucketName}" already exists`);
    } catch (error) {
      if (error.name === 'NotFound') {
        try {
          await this.s3Client.send(
            new CreateBucketCommand({ Bucket: this.config.bucketName }),
          );
          this.logger.log(
            `Bucket "${this.config.bucketName}" created successfully`,
          );
        } catch (createError) {
          this.logger.error(`Failed to create bucket: ${createError.message}`);
          throw createError;
        }
      } else {
        this.logger.error(`Failed to check bucket: ${error.message}`);
        throw error;
      }
    }
  }

  private async setBucketPolicy(): Promise<void> {
    try {
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.config.bucketName}/*`],
          },
        ],
      };

      await this.s3Client.send(
        new PutBucketPolicyCommand({
          Bucket: this.config.bucketName,
          Policy: JSON.stringify(policy),
        }),
      );

      this.logger.log(
        `Bucket policy set successfully for "${this.config.bucketName}"`,
      );
    } catch (error) {
      this.logger.error(`Failed to set bucket policy: ${error.message}`);
      // Don't throw - allow the app to continue even if policy fails
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = '',
  ): Promise<string> {
    const timestamp = Date.now();
    const filename = `${folder}${folder ? '/' : ''}${timestamp}-${file.originalname}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.config.bucketName,
          Key: filename,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      this.logger.log(`File uploaded successfully: ${filename}`);
      return filename;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.config.bucketName,
          Key: key,
        }),
      );

      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw error;
    }
  }

  getFileUrl(key: string): string {
    const endpoint = (this.config.publicUrl || this.config.endpoint).replace(/\/$/, '');
    return `${endpoint}/${this.config.bucketName}/${key}`;
  }

  async getFile(key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      const stream = response.Body as any;

      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
      });
    } catch (error) {
      this.logger.error(`Failed to get file: ${error.message}`);
      throw error;
    }
  }
}
