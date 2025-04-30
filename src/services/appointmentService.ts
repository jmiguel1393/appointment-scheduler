import { DynamoDb } from "../utils/dynamoDb";

const TABLE_NAME = process.env.TABLE_NAME || "appointments";

export class AppointmentService {
  async getAppointmentsByInsuredId(insuredId: string) {
    const result = await DynamoDb.queryItems(
      TABLE_NAME,
      "insuredId",
      insuredId
    );
    return result.Items;
  }
}
