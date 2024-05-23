import { Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3 } from 'aws-sdk';

@Injectable()
export class FilesService {
  public constructor(private readonly configService: ConfigService) {}

  private readonly s3 = new S3({
    region: this.configService.getOrThrow<string>('AWS_BUCKET_REGION'),
    accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.getOrThrow<string>(
      'AWS_SECRET_ACCESS_KEY',
    ),
  });

  private readonly bucket =
    this.configService.getOrThrow<string>('AWS_BUCKET_NAME');

  private defaultUserImage: string | null = null;
  private dateExpiresDefaultUserImage: Date = new Date();

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow<string>('AWS_BUCKET_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow<string>(
        'AWS_SECRET_ACCESS_KEY',
      ),
    },
  });

  public async upload(
    buffer: Buffer,
    name: string,
    folder: string,
    id: number,
    format: string,
  ): Promise<void> {
    const command: PutObjectCommand = new PutObjectCommand({
      Bucket: this.configService.getOrThrow<string>('AWS_BUCKET_NAME'),
      Key: `${this.configService.getOrThrow<string>(
        'AWS_MAIN_FOLDER',
      )}/${folder}/${id}-${name}.${format}`,
      Body: buffer,
    });
    await this.s3Client.send(command);
  }

  public async uploadFile(buffer: Buffer, folder: string): Promise<void> {
    const command: PutObjectCommand = new PutObjectCommand({
      Bucket: this.configService.getOrThrow<string>('AWS_BUCKET_NAME'),
      Key: `${this.configService.getOrThrow<string>(
        'AWS_MAIN_FOLDER',
      )}/${folder}`,
      Body: buffer,
    });
    await this.s3Client.send(command);
  }

  public async getPreSignedURL(
    folder: string,
    filename: string,
    id: number,
  ): Promise<string> {
    try {
      const key = `${this.configService.getOrThrow<string>('AWS_MAIN_FOLDER')}/${folder}/${id}-${filename}`;

      const params = {
        Bucket: this.bucket,
        Key: key,
      };

      // check if object exists
      await this.s3.headObject(params).promise();

      params['Expires'] = 3600;
      return await this.s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      if (folder === 'users') {
        if (
          !this.defaultUserImage ||
          new Date() >= this.dateExpiresDefaultUserImage
        ) {
          this.defaultUserImage = await this.getDefaultUserimage();
        }

        return this.defaultUserImage;
      }

      return '';
    }
  }

  public async getPreSignedNewsURL(
    folder: string,
    filename: string,
  ): Promise<string> {
    try {
      const key = `${this.configService.getOrThrow<string>('AWS_MAIN_FOLDER')}/${folder}/${filename}`;

      const params = {
        Bucket: this.bucket,
        Key: key,
      };
      await this.s3.headObject(params).promise();
      params['Expires'] = 3600;
      return this.s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      return '';
    }
  }

  public async ___getPresignedUrl(
    folder: string,
    filename: string,
    id: number,
  ): Promise<string> {
    const key = `${this.configService.getOrThrow<string>(
      'AWS_MAIN_FOLDER',
    )}/${folder}/${id}-${filename}`;

    try {
      await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.configService.getOrThrow<string>('AWS_BUCKET_NAME'),
          Key: key,
        }),
      );
    } catch (error) {
      if (folder === 'img_users') {
        return this.getDefaultUserimage();
      }
      return '';
    }

    const command = new GetObjectCommand({
      Bucket: this.configService.getOrThrow<string>('AWS_BUCKET_NAME'),
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });
  }

  public async deleteFile(
    folder: string,
    filename: string,
    id: number,
  ): Promise<void> {
    const key = `${this.configService.getOrThrow<string>(
      'AWS_MAIN_FOLDER',
    )}/${folder}/${id}-${filename}`;

    const command = new DeleteObjectCommand({
      Bucket: this.configService.getOrThrow<string>('AWS_BUCKET_NAME'),
      Key: key,
    });

    await this.s3Client.send(command);
  }

  public async getDefaultUserimage(): Promise<string> {
    const date = new Date();
    this.dateExpiresDefaultUserImage = new Date(
      date.setHours(date.getHours() + 1),
    );

    const url = await this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.bucket,
      Key: `${this.configService.getOrThrow<string>(
        'AWS_MAIN_FOLDER',
      )}/users/default_user.png`,
      Expires: 3600,
    });

    return url;
  }
}
