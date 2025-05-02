export const healthCheck = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "API is running" }),
  };
};
