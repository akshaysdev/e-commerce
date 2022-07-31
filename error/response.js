/**
 * It returns an object with a status and message property
 * @param error - The error object that was thrown.
 * @returns The response function is returning an object with a status and message property.
 */
const response = (error) => {
  if (error.status === 500) {
    return {
      status: 500,
      message: 'Internal Server Error',
    };
  }
  return {
    status: error.status,
    message: error.message
  };
};

module.exports = { response };
