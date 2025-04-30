import { IAppointment } from "../models/Appointment";
import { DynamoDb } from "../utils/dynamoDb";
import * as AWS from "aws-sdk";

const sns = new AWS.SNS();
const TABLE_NAME = process.env.TABLE_NAME || "appointments";
const SNS_TOPIC_PE = process.env.SNS_TOPIC_PE;
const SNS_TOPIC_CL = process.env.SNS_TOPIC_CL;

export class AppointmentService {
  async getAppointmentsByInsuredId(insuredId: string) {
    const result = await DynamoDb.queryItems(
      TABLE_NAME,
      "insuredId",
      insuredId
    );
    return result.Items;
  }

  async createAppointment(appointment: IAppointment) {
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
