import { healthCheck } from "../src/handlers/healthHandler";
describe("healthCheck", () => {
  it("should return a 200 status and a message", async () => {
    const result = await healthCheck();
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body.message).toBe("API is running");
  });
});
