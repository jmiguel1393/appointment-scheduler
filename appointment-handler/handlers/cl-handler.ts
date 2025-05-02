import { SQSEvent } from "aws-lambda";
import { insertAppointment } from "../shared/db";
import { publishConfirmation } from "../shared/eventbridge";

export const main = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const appointment = JSON.parse(record.body);
    await insertAppointment(appointment);
    await publishConfirmation({
      source: "appointment.cl",
      detailType: "AppointmentConfirmed",
      detail: appointment,
    });
  }
};
