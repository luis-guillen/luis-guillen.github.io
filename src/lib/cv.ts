export interface CvLink {
  href: string;
  /** File name the browser saves the download as. */
  file: string;
}

/** The downloadable CV that matches the site language: Spanish for "es*", English otherwise. */
export function cvFor(language: string | undefined): CvLink {
  return language?.toLowerCase().startsWith("es")
    ? { href: "/cv-es.pdf", file: "Luis_Guillen_Servera_CV_ES.pdf" }
    : { href: "/cv.pdf", file: "Luis_Guillen_Servera_CV_EN.pdf" };
}
