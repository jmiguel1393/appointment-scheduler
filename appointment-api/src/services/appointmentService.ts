import { IAppointment } from "../models/Appointment";
import { DynamoDb } from "../utils/dynamoDb";
import * as AWS from "aws-sdk";

const sns = new AWS.SNS({
  region: process.env.AWS_REGION || "us-east-2",
});

const TABLE_NAME = process.env.TABLE_NAME || "appointments";
const SNS_TOPIC_PE = process.env.SNS_TOPIC_PE;
const SNS_TOPIC_CL = process.env.SNS_TOPIC_CL;

export class AppointmentService {
  async getAppointmentsByInsuredId(insuredId: string | undefined) {
    if (!insuredId) {
      throw new Error("Insured ID is required");
    }

    const result = await DynamoDb.queryItems(
      TABLE_NAME,
      "insuredId",
      insuredId
    );
    return result.Items;
  }

  async createAppointment(appointment: IAppointment) {
    const { insuredId, scheduleId, countryISO } = appointment;

    if (!insuredId || !scheduleId || !countryISO) {
      throw new Error(
        "Missing required fields: insuredId, scheduleId, or countryISO"
      );
    }

    await DynamoDb.putItem(TABLE_NAME, appointment);

    const snsTopic =
      appointment.countryISO === "PE" ? SNS_TOPIC_PE : SNS_TOPIC_CL;

    await sns
      .publish({
        Message: JSON.stringify(appointment),
        TopicArn: snsTopic,
      })
      .promise();

    return { message: "Appointment scheduled in process", data: appointment };
  }
}
