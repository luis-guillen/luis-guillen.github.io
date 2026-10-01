import { ReactNode } from "react";
import SplitReveal from "./SplitReveal";

interface SectionProps {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Editorial section: a hairline that draws in on top, a numbered sticky label on
 * the left and the content on the right (9/12 columns on desktop). The content
 * column sits on a soft blur so the 3D layer never fights with the text.
 */
const Section = ({ id, index, title, children, className = "" }: SectionProps) => (
  <section id={id} className={`scroll-mt-20 py-20 md:py-28 ${className}`}>
    <div className="mx-auto max-w-page px-6 md:px-10">
      <div className="hairline-draw" data-reveal aria-hidden />
      <div className="pt-6 md:grid md:grid-cols-12 md:gap-8">
        <div className="mb-10 md:col-span-3 md:mb-0">
          <div className="md:sticky md:top-28">
            <span className="label-mono text-primary" data-reveal>
              {index}
            </span>
            <SplitReveal as="h2" lines={title} className="display mt-3 text-3xl md:text-4xl" />
          </div>
        </div>
        <div className="veil md:col-span-9">{children}</div>
      </div>
    </div>
  </section>
);

export default Section;
