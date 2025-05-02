import { main } from "../handlers/updaterHandler";
import * as db from "../shared/dynamodb";

jest.mock("../shared/dynamodb");

describe("Appointment Updater", () => {
  it("should update the appointment status to completed", async () => {
    const mockUpdate = db.updateAppointmentStatus as jest.Mock;
    mockUpdate.mockResolvedValueOnce(undefined);

    const mockEvent = {
      Records: [
        {
          body: JSON.stringify({
            detail: {
              insuredId: "123456",
              scheduleId: 1,
            },
          }),
        },
      ],
    };

    await main(mockEvent as any);

    expect(mockUpdate).toHaveBeenCalledWith("123456", 1, "completed");
  });
});
