const asyncHandler = (func) => {
  //  Higher order function->

  return async (req, res, next) => {
    try {
      await func(req, res, next);
      // here am executing the function!
    } catch (error) {
      // throws error and false success flag to client side
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export { asyncHandler };
