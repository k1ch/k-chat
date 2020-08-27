import { Repository, getRepository } from 'typeorm';
import { Message, MessageCreationRequest, ContentType, SenderOrRecipient } from '../models/message.model';
import { FileService } from './file.service';


export class MessageService {
  private messageRepository: Repository<Message>
  private fileService: FileService;

  constructor() {
    this.messageRepository = getRepository(Message)
    this.fileService = new FileService();
  }


  public async createMessage(messageRequest: MessageCreationRequest, fileObject?: Express.Multer.File) {
    try {
      let file, contentType;

      /**
       * First saves the file if:
       *  1) File is uploaded or
       *  2) URL of file is provided
       */
      if (fileObject) file = await this.fileService.save(null, fileObject.path, fileObject.mimetype, fileObject.size, fileObject.originalname)
      else if (messageRequest.content.type !== ContentType.TEXT) file = await this.fileService.fetchAndSave(messageRequest.content.text)

      if (file) contentType = this.fileService.getContentType(file.mimetype) as string

      let messagePayload = {
        sender: messageRequest.sender,
        recipient: messageRequest.recipient,
        content_type: contentType || messageRequest.content.type,
        file_id: file ? file.id : null,
        text: file ? null : messageRequest.content.text
      } as Message
      const message = await this.messageRepository.create(messagePayload).save()
      return message
    } catch (err) {
      throw {
        code: 'MSG01',
        stack: err
      }
    }
  }

  /**
   * Retrieve messages bsed on the provided arguments
   * @param {number} userId - User id of sender or recipient
   * @param {SenderOrRecipient} senderOrRecipient - who are we collecting messages for
   * @param {number} startMessageId - Can provide a message id as strat point. If message does not exist it uses the next lowest value stored in the database
   * @param {number} limit - Number of messages to be retrieved - Default is 100
   * @param {boolean}isDescendig - Set true if want the messages is descending order
   */
  public async retrieveMessages(userId: number, senderOrRecipient: SenderOrRecipient, startMessageId: number, limit?: number, isDescendig?: boolean): Promise<Message[]> {
    try {
      startMessageId = await this.getMessegeIdOrNextLowest(userId, senderOrRecipient, startMessageId)
      const messages = await this.messageRepository
        .createQueryBuilder('m')
        .where(`m.${senderOrRecipient} =  ${userId} AND m.id >= ${startMessageId}`)
        .orderBy('m.id', isDescendig ? 'DESC' : 'ASC')
        .limit(limit || 100)
        .getMany();
      return messages
    } catch (err) {
      throw {
        code: 'MSG03',
        stack: err
      }
    }
  }

  private async getMessegeIdOrNextLowest(userId: number, senderOrRecipient: SenderOrRecipient, startMessageId: number): Promise<number> {
    try {
      const message = await this.messageRepository
        .createQueryBuilder('m')
        .where(`m.${senderOrRecipient} = ${userId} AND m.id <= ${startMessageId}`)
        .orderBy('m.id', 'DESC')
        .limit(1)
        .getOne();
      const messageId = message ? message.id : startMessageId
      return messageId as number
    } catch (err) {
      throw {
        code: 'MSG04',
        stack: err
      }
    }
  }
}