import { APIGatewayEvent, Context } from "aws-lambda";
import { AppointmentServiceFactory } from "../services/appointmentServiceFactory";
import { IAppointment } from "../models/Appointment";

export const createAppointment = async (
  event: APIGatewayEvent,
  context: Context
) => {
  try {
    const { insuredId, scheduleId, countryISO } = JSON.parse(
      event.body || "{}"
    );

    const appointment: IAppointment = {
      insuredId,
      scheduleId,
      countryISO,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const appointmentService = AppointmentServiceFactory.getService(countryISO);
    const response = await appointmentService.createAppointment(appointment);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error creating appointment", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating appointment",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
