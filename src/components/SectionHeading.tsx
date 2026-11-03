import { motion } from "framer-motion";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  index?: string;
};

export function SectionHeading({ eyebrow, title, description, index }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.55 }}
      className="mx-auto mb-12 max-w-3xl text-center"
    >
      <span className="section-eyebrow">
        {index ? <span className="text-muted">{index}</span> : null}
        <span className="text-muted">//</span> {eyebrow}
      </span>
      <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-base leading-7 text-soft md:text-lg md:leading-8">{description}</p> : null}
    </motion.div>
  );
}
