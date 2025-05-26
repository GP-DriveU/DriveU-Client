import type { ReactNode } from "react";

interface LandingSectionProps {
  title: ReactNode;
  description: ReactNode;
  image: ReactNode;
  imageLeft?: boolean;
  button?: ReactNode;
  align?: "left" | "center" | "right";
}

function LandingSection({
  title,
  description,
  image,
  imageLeft = false,
  button,
  align = "center",
}: LandingSectionProps) {
  const textAlignClass =
    align === "left"
      ? "text-left"
      : align === "right"
      ? "text-right"
      : "text-center";

  const content = (
    <div className={`w-full max-w-lg space-y-4 ${textAlignClass}`}>
      <h2 className="text-primary text-5xl font-extrabold">{title}</h2>
      <h3 className="text-font text-3xl font-normal">{description}</h3>
      {button && <div className="w-[250px] mx-auto">{button}</div>}
    </div>
  );

  return (
    <section className="max-w-screen-xl bg-[#FFFFFF] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 py-10 px-6">
      {imageLeft ? (
        <>
          {image}
          {content}
        </>
      ) : (
        <>
          {content}
          {image}
        </>
      )}
    </section>
  );
}

export default LandingSection;
