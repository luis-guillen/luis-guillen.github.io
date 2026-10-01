import { describe, expect, it } from "vitest";
import { cvFor } from "@/lib/cv";

describe("cvFor", () => {
  it("serves the Spanish CV for Spanish", () => {
    expect(cvFor("es")).toEqual({ href: "/cv-es.pdf", file: "Luis_Guillen_Servera_CV_ES.pdf" });
    expect(cvFor("es-ES").href).toBe("/cv-es.pdf");
  });

  it("serves the English CV for English and anything else", () => {
    expect(cvFor("en").href).toBe("/cv.pdf");
    expect(cvFor("fr").href).toBe("/cv.pdf");
    expect(cvFor(undefined).href).toBe("/cv.pdf");
  });
});
