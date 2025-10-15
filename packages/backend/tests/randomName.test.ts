import { describe, expect, it } from "vitest";
import { generateRandomName } from "../src/randomName";

describe("generateRandomName", () => {
  it("returns a non-empty string", () => {
    const name = generateRandomName();
    expect(typeof name).toBe("string");
    expect(name.length).toBeGreaterThan(0);
  });
});
