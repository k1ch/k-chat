import { Repository, getRepository } from 'typeorm';
import got from 'got'
import FileType from 'file-type'
import { v4 as uuid_v4 } from 'uuid'
import fs from 'fs'

import { File } from '../models/file.model';
import { ContentType } from '../models/message.model';
import { S3Repository } from '../lib/s3';



export class FileService {
  private fileRepository: Repository<File>
  private s3: S3Repository

  constructor() {
    this.fileRepository = getRepository(File)
    this.s3 = new S3Repository()
  }

  public async save(buffer: Buffer | null, filePath: string | null, mimetype: string, sizeInBytes: number, fileName): Promise<File> {
    try {
      const uuid = uuid_v4() as string
      if (!this.isTypeSupported(mimetype)) throw { message: `File type ${mimetype} is not supported!` }
      const fileBuffer = buffer || fs.readFileSync(filePath as string)
      const uploadedFile = await this.s3.upload(uuid, fileBuffer, mimetype)
      const file = await this.fileRepository.create({
        id: uuid,
        mimetype: mimetype,
        url: uploadedFile.Location,
        size: sizeInBytes, 
        name: fileName
      } as unknown as File).save()
      return file;
    } catch (err) {
      throw {
        code: 'File01',
        stack: err
      }
    }
  }

  public async fetchAndSave(url): Promise<File> {
    try {
      const fileBuffer = await got(url).buffer()
      const fileType = await FileType.fromBuffer(fileBuffer)
      if (!fileType) throw { message: 'Could not detect the file type!' }
      const file = await this.save(fileBuffer, null, fileType.mime, Buffer.byteLength(fileBuffer), url.split('/').pop())
      return file
    } catch (err) {
      throw {
        code: 'File02',
        stack: err
      }
    }
  }

  public getContentType(mimetype): ContentType {
    return [ContentType.VIDEO, ContentType.IMAGE].filter(v => RegExp(v, 'ig').test(mimetype)).join('') as ContentType
  }

  private isTypeSupported(mimetype) {
    return [ContentType.VIDEO, ContentType.IMAGE].some(v => RegExp(v, 'ig').test(mimetype))
  }
}