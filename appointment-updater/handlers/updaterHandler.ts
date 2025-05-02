import { SQSEvent } from "aws-lambda";
import { updateAppointmentStatus } from "../shared/dynamodb";

export const main = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const eventBody = JSON.parse(record.body);

    const detail = eventBody.detail;
    const insuredId = detail.insuredId;
    const scheduleId = detail.scheduleId;

    await updateAppointmentStatus(insuredId, scheduleId, "completed");
  }
};
