export interface IError {
  code: string;
  message: string;
  http_status: number;
  stack?: any;
}

export const errors: IError[] = [
  {
    code: 'USER01',
    http_status: 500, 
    message: 'Failed to create user!'
  }, 
  {
    code: 'USER02',
    http_status: 409, 
    message: 'User already exist!'
  }, 
  {
    code: 'USER03',
    http_status: 404, 
    message: 'User not found!'
  },   
  {
    code: 'USER04',
    http_status: 500, 
    message: 'Failed to get user by username!'
  }, 
  {
    code: 'AUTH01', 
    http_status: 401, 
    message: 'User is not autorized!'
  }, 
  {
    code: 'AUTH02', 
    http_status: 401, 
    message: 'Access token is missing!'
  }, 
  {
    code: 'AUTH03', 
    http_status: 401, 
    message: 'Access token is invalid!'
  }, 
  {
    code: 'AUTH04', 
    http_status: 400, 
    message: 'Password is wrong!'
  },
  {
    code: 'AUTH05', 
    http_status: 500, 
    message: 'Faild to generate access token!'
  },
  {
    code: 'AUTH06', 
    http_status: 403, 
    message: 'You do not have access to this resource!'
  },
  {
    code: 'MSG01', 
    http_status: 400, 
    message: 'Failed to send the message!'
  },
  {
    code: 'MSG02', 
    http_status: 401, 
    message: 'Should I call the police?! Sender id does not match with your accessToken!'
  }, 
  {
    code: 'MSG03', 
    http_status: 400, 
    message: 'Failed to retrieve messages!'
  },  
  {
    code: 'MSG04', 
    http_status: 500, 
    message: 'Failed to get message id or the next lowest'
  },
  {
    code:'File01', 
    http_status: 400, 
    message: 'Failed to save the file!'
  }, 
  {
    code:'File02', 
    http_status: 400, 
    message: 'Failed to download and save the file!'
  },
  {
    code: 'S3_01', 
    http_status: 500, 
    message: 'Failed to upload the file to S3!'
  },
  {
    code: 'S3_02', 
    http_status: 500, 
    message: 'Failed to download the file from S3!'
  },
  {
    code: 'S3_03', 
    http_status: 500, 
    message: 'Failed to delete the file from S3!'
  }
]