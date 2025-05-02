import { AppointmentService } from "../src/services/appointmentService";

jest.mock("aws-sdk", () => {
  const publishMock = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({}),
  });

  const putMock = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({}),
  });

  const queryMock = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Items: [{ insuredId: "12345" }],
    }),
  });

  return {
    SNS: jest.fn().mockImplementation(() => ({ publish: publishMock })),
    DynamoDB: {
      DocumentClient: jest.fn().mockImplementation(() => ({
        put: putMock,
        query: queryMock,
      })),
    },
  };
});

describe("AppointmentService", () => {
  let appointmentService: AppointmentService;

  beforeAll(() => {
    appointmentService = new AppointmentService();
  });

  it("should successfully create an appointment", async () => {
    const appointmentData = {
      insuredId: "12345",
      scheduleId: 100,
      countryISO: "PE",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const response = await appointmentService.createAppointment(
      appointmentData
    );

    expect(response.message).toBe("Appointment scheduled in process");
  });

  it("should throw an error if required fields are missing when creating an appointment", async () => {
    const invalidAppointmentData = {
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await expect(
      appointmentService.createAppointment(invalidAppointmentData as any)
    ).rejects.toThrow(
      "Missing required fields: insuredId, scheduleId, or countryISO"
    );
  });

  it("should handle failure when creating appointment", async () => {
    const errorMock = new Error("Failed to write to DB");

    jest.resetModules();

    jest.doMock("aws-sdk", () => ({
      SNS: jest.fn().mockImplementation(() => ({ publish: jest.fn() })),
      DynamoDB: {
        DocumentClient: jest.fn().mockImplementation(() => ({
          put: jest.fn().mockReturnValue({
            promise: jest.fn().mockRejectedValue(errorMock),
          }),
          query: jest.fn(),
        })),
      },
    }));

    const {
      AppointmentService,
    } = require("../src/services/appointmentService");
    const appointmentService = new AppointmentService();

    const appointmentData = {
      insuredId: "99999",
      scheduleId: 200,
      countryISO: "CL",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await expect(
      appointmentService.createAppointment(appointmentData)
    ).rejects.toThrow("Failed to write to DB");
  });

  it("should successfully retrieve appointments by insuredId", async () => {
    const appointments = await appointmentService.getAppointmentsByInsuredId(
      "12345"
    );

    expect(appointments?.length).toBeGreaterThan(0);
    expect(appointments?.[0]?.insuredId).toBe("12345");
  });

  it("should return an empty array when no appointments found", async () => {
    const mockQuery = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: [] }),
    });

    jest.resetModules();
    jest.doMock("aws-sdk", () => ({
      SNS: jest.fn().mockImplementation(() => ({ publish: jest.fn() })),
      DynamoDB: {
        DocumentClient: jest.fn().mockImplementation(() => ({
          query: mockQuery,
          put: jest.fn(),
        })),
      },
    }));

    const {
      AppointmentService,
    } = require("../src/services/appointmentService");
    const appointmentService = new AppointmentService();

    const appointments = await appointmentService.getAppointmentsByInsuredId(
      "not-found"
    );

    expect(appointments).toEqual([]);
  });

  it("should throw an error if insuredId is not provided", async () => {
    await expect(
      appointmentService.getAppointmentsByInsuredId("")
    ).rejects.toThrow("Insured ID is required");
  });

  it("should handle error if DynamoDB query fails", async () => {
    const mockQuery = jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error("Query failed")),
    });

    jest.resetModules();
    jest.doMock("aws-sdk", () => ({
      SNS: jest.fn().mockImplementation(() => ({ publish: jest.fn() })),
      DynamoDB: {
        DocumentClient: jest.fn().mockImplementation(() => ({
          query: mockQuery,
          put: jest.fn(),
        })),
      },
    }));

    const {
      AppointmentService,
    } = require("../src/services/appointmentService");
    const appointmentService = new AppointmentService();

    await expect(
      appointmentService.getAppointmentsByInsuredId("12345")
    ).rejects.toThrow("Query failed");
  });
});
