import * as AWS from "aws-sdk";

const isOffline = process.env.IS_OFFLINE;

const options: AWS.DynamoDB.DocumentClient.DocumentClientOptions &
  AWS.DynamoDB.Types.ClientConfiguration = {
  region: process.env.AWS_REGION || "us-east-2",
  ...(isOffline && { endpoint: "http://localhost:8000" }),
};

const dynamoDb = new AWS.DynamoDB.DocumentClient(options);

export class DynamoDb {
  static async queryItems(tableName: string, key: string, value: string) {
    const params = {
      TableName: tableName,
      KeyConditionExpression: `${key} = :value`,
      ExpressionAttributeValues: {
        ":value": value,
      },
    };
    return await dynamoDb.query(params).promise();
  }

  static async putItem(tableName: string, item: any) {
    const params = {
      TableName: tableName,
      Item: item,
    };
    await dynamoDb.put(params).promise();
  }
}
