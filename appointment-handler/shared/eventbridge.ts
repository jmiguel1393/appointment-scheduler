import { EventBridge } from "aws-sdk";

const eventBridge = new EventBridge();

export async function publishConfirmation({ source, detailType, detail }: any) {
  await eventBridge
    .putEvents({
      Entries: [
        {
          Source: source,
          DetailType: detailType,
          Detail: JSON.stringify(detail),
          EventBusName: process.env.EVENT_BUS_NAME,
        },
      ],
    })
    .promise();
}
