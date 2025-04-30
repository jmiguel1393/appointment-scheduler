import * as AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

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
