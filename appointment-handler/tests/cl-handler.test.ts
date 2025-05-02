import { SQSEvent } from "aws-lambda";
import { main } from "../handlers/cl-handler";
import * as db from "../shared/db";
import * as eventbridge from "../shared/eventbridge";

jest.mock("../shared/db");
jest.mock("../shared/eventbridge");

describe("handleAppointmentCL", () => {
  it("should insert appointment and publish confirmation", async () => {
    const mockAppointment = {
      insuredId: "12345",
      scheduleId: 1,
      countryISO: "CL",
    };

    const mockEvent: SQSEvent = {
      Records: [
        {
          messageId: "1",
          receiptHandle: "abc",
          body: JSON.stringify(mockAppointment),
          attributes: {
            ApproximateReceiveCount: "1",
            SentTimestamp: "1234567890",
            SenderId: "sender",
            ApproximateFirstReceiveTimestamp: "1234567891",
          },
          messageAttributes: {},
          md5OfBody: "",
          eventSource: "aws:sqs",
          eventSourceARN: "arn:aws:sqs:region:account-id:queue-cl",
          awsRegion: "region",
        },
      ],
    };

    await expect(main(mockEvent)).resolves.toBeUndefined();

    expect(db.insertAppointment).toHaveBeenCalledWith(mockAppointment);
    expect(eventbridge.publishConfirmation).toHaveBeenCalledWith({
      source: "appointment.cl",
      detailType: "AppointmentConfirmed",
      detail: mockAppointment,
    });
  });
});
