export const apiResponse = (success, message, data = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  return response;
};
