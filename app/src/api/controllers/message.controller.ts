import multer from 'multer';
import { Router } from 'express';
import { Segments, Joi, celebrate } from 'celebrate'

import { ContentType, SenderOrRecipient } from '../../models/message.model';
import { MessageMiddleware } from '../middlewares/message.middleware';
import { MessageService } from '../../services/message.service';
import { Utils } from '../../utils';


export class MessageController {
  private messageRouter: Router
  private messageService: MessageService
  private upload: multer.Multer

  constructor() {
    this.messageRouter = Router()
    this.messageService = new MessageService()
    this.upload = multer({ dest: Utils.getConfig('settings.temp') })
    this.setup();
  }

  get router() {
    return this.messageRouter
  }

  private setup() {
    this.send()
    this.getSome()
  }

  /**
   * User can send message. 3 types of messages are supported (text, image, video).
   * Also handles direct upload using form-data. To enable feature, "upload" key should be set to true
   */
  private send() {
    this.messageRouter.post('/', this.upload.any(), celebrate({
      [Segments.BODY]: Joi.object().keys({
        sender: Joi.number().integer().required(),
        recipient: Joi.number().integer().required(),
        upload: Joi.boolean().description('Set true if want to upload file using form-data'),
        content: Joi.object({
          type: Joi.string().required().valid(ContentType.IMAGE, ContentType.VIDEO, ContentType.TEXT),
          text: Joi.string().required().when('type', {not: ContentType.TEXT, then: Joi.string().uri().required()})
        }).when('upload', { is: true, then: Joi.object(), otherwise: Joi.object().required() })
      })
    }),
      MessageMiddleware.isUserAuthenticInRequest(Segments.BODY, SenderOrRecipient.SENDER),
      async (req, res, next) => {
        try {
          const message = await this.messageService.createMessage(req.body, req.files ? req.files[0] : null)
          res.status(201).send({ id: message.id, timestamp: message.created_at })
        } catch (err) {
          next(err)
        }
      })
  }


  /**
   * Fetches all existing messages to a given recipient, within a range of message IDs.
   * @returns messages - in asccending order
   */
  private getSome() {
    this.messageRouter.get('/', celebrate({
      [Segments.QUERY]: Joi.object().keys({
        recipient: Joi.number().integer().required(),
        start: Joi.number().integer().required(),
        limit: Joi.number().integer().default(100)
      }).required()
    }),
      MessageMiddleware.isUserAuthenticInRequest(Segments.QUERY, SenderOrRecipient.RECIPIENT),
      async (req, res, next) => {
        try {
          const messages = await this.messageService.retrieveMessages(req.query.recipient as unknown as number, SenderOrRecipient.RECIPIENT, req.query.start as unknown as number, req.query.limit as unknown as number)
          res.status(200).send({ messages })
        } catch (err) {
          next(err)
        }
      })
  }
}