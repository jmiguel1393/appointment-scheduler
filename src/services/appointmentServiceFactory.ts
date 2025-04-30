import { AppointmentService } from "./appointmentService";

export class AppointmentServiceFactory {
  static getService(countryISO: string): AppointmentService {
    // Here you can add logic to return different implementations of AppointmentService
    // based on the countryISO or any other criteria.
    console.log(countryISO);
    return new AppointmentService();
  }
}
