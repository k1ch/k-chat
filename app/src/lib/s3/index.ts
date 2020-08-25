import * as AWS from 'aws-sdk';
import { Utils } from '../../utils';

export class S3Repository {
  private config: AWS.S3.ClientConfiguration
  private S3: AWS.S3;
  private bucket: string;

  constructor() {
    this.bucket = Utils.getConfig('services.aws.s3.bucket');
    this.config = {
      s3ForcePathStyle: true,
      credentials: new AWS.Credentials(Utils.getConfig('services.aws.access_key'), Utils.getConfig('services.aws.secret_key')),
      endpoint: new AWS.Endpoint(Utils.getConfig('services.aws.s3.endpoint')) as unknown as string,
      signatureVersion: 'v4'
    };
    this.S3 = new AWS.S3(this.config);
  }

  public async upload(key: string, fileBuffer: Buffer, mimetype: string): Promise<AWS.S3.ManagedUpload.SendData> {
    return new Promise<AWS.S3.ManagedUpload.SendData>((resolve, reject) => {
      let params = {
        Bucket: this.bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimetype
      };
      this.S3.upload(params, (err, s3Data: AWS.S3.ManagedUpload.SendData) => {
        if (err) {
          return reject({ code: 'S3_01', stack: err });
        }
        return resolve(s3Data);
      });
    });
  }

  public async download(key: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      this.S3.getObject({
        Bucket: this.bucket,
        Key: key,
      }, (err, data) => {
        if (err) {
          return reject({ code: 'S3_02', stack: err });

        }
        let fileBuffer = new Buffer(data.Body as string);
        return resolve(fileBuffer);
      });
    });
  }

  public delete(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.S3.deleteObject({
        Bucket: this.bucket,
        Key: key
      }, (err, data) => {
        if (err) {
          return reject({ code: 'S3_03', stack: err });
        } else {
          return resolve(true);
        }
      });
    });
  }
}
