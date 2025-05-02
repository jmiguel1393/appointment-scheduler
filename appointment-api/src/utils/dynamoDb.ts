import * as AWS from "aws-sdk";

const isOffline = process.env.IS_OFFLINE;

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
  endpoint: isOffline ? "http://localhost:8000" : undefined,
});

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
