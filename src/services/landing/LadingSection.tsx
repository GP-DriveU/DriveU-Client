import type { ReactNode } from "react";

interface LandingSectionProps {
  title: ReactNode;
  description: ReactNode;
  image: string;
  alt: string;
  width: number;
  height: number;
  loading?: "eager" | "lazy";
  imageLeft?: boolean;
  button?: ReactNode;
  align?: "left" | "center" | "right";
}

function LandingSection({
  title,
  description,
  image,
  alt,
  width,
  height,
  loading = "lazy",
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
          <img
            src={image}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
          />
          {content}
        </>
      ) : (
        <>
          {content}
          <img
            src={image}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
          />
        </>
      )}
    </section>
  );
}

export default LandingSection;
