import { AppointmentService } from "../src/services/appointmentService";

jest.mock("aws-sdk", () => ({
  SNS: jest.fn().mockImplementation(() => ({
    publish: jest
      .fn()
      .mockReturnValue({ promise: jest.fn().mockResolvedValue({}) }),
  })),
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({
      put: jest
        .fn()
        .mockReturnValue({ promise: jest.fn().mockResolvedValue({}) }),
      query: jest
        .fn()
        .mockReturnValue({
          promise: jest
            .fn()
            .mockResolvedValue({ Items: [{ insuredId: "12345" }] }),
        }),
    })),
  },
}));

describe("AppointmentService", () => {
  let appointmentService: AppointmentService;

  beforeAll(() => {
    appointmentService = new AppointmentService();
  });

  it("should successfully retrieve appointments by insuredId", async () => {
    const appointments = await appointmentService.getAppointmentsByInsuredId(
      "12345"
    );

    expect(appointments?.length).toBeGreaterThan(0);
    expect(appointments?.[0]?.insuredId).toBe("12345");
  });
});
