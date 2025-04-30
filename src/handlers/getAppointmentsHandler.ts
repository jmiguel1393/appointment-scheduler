import { APIGatewayEvent, Context } from "aws-lambda";
import { AppointmentService } from "../services/appointmentService";

export const getAppointments = async (
  event: APIGatewayEvent,
  context: Context
) => {
  try {
    const { insuredId } = event.pathParameters || {};

    const appointmentService = new AppointmentService();
    const appointments = await appointmentService.getAppointmentsByInsuredId(
      insuredId
    );

    return {
      statusCode: 200,
      body: JSON.stringify(appointments),
    };
  } catch (error) {
    console.error("Error getting appointments", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error getting appointments",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
