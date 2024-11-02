export const errorHandler = (err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = error;
    res.status(status).json({
        status,
        message,
    });
};