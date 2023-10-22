const { validationResult, check } = require("express-validator");

const validateInput = (validationChain) => {
  return async (req, res, next) => {
    await Promise.all(validationChain.map((field) => field.run(req)));

    const errors = validationResult(req);

    const error_values = errors
      .array()
      ?.map(({ msg, path }) => ({ msg, path }));

    if (!errors.isEmpty()) {
      return res.sendExpectationFailedResponse(
        error_values,
        "Validations failed"
      );
    }

    next();
  };
};

module.exports = validateInput;
