import { APIGatewayEvent, Context } from "aws-lambda";
import * as path from "path";
import YAML from "yamljs";

export const getSwagger = async (event: APIGatewayEvent, context: Context) => {
  try {
    const swaggerPath = path.resolve(__dirname, "../docs/swagger.yaml");
    const swaggerDoc = YAML.load(swaggerPath);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(swaggerDoc),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error loading Swagger doc" }),
    };
  }
};
