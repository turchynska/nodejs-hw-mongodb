import { HttpError } from 'http-errors';

export const errorHandler = (error, req, res, next) => {
  console.error('Caught error:', error);
  if (error instanceof HttpError) {
    console.log('This is an HTTP error');
    return res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message,
      data: null,
    });
  }

  console.log('This is a non-HTTP error');

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: null,
  });
};
