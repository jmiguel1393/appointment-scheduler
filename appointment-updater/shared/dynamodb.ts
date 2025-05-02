import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

export async function updateAppointmentStatus(
  insuredId: string,
  scheduleId: string,
  newStatus: string
) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      insuredId,
      scheduleId,
    },
    UpdateExpression: "set #s = :s",
    ExpressionAttributeNames: {
      "#s": "status",
    },
    ExpressionAttributeValues: {
      ":s": newStatus,
    },
  };

  await ddb.send(new UpdateCommand(params));
}
