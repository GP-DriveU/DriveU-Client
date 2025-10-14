import emptyImage from "@/assets/favicon/favicon_driveu.png";

interface EmptyTrashSectionProps {
  title: string;
  subtitle: string;
}

function EmptySection({title, subtitle}: EmptyTrashSectionProps) {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center gap-4">
      <img className="w-32 h-32" src={emptyImage} alt="휴지통 비어있음" />
      <div className="h-12 text-center justify-center text-black text-3xl font-bold">
        {title}
      </div>
      <div className="h-12 text-center justify-center text-black text-xl font-normal">
        {subtitle}
      </div>
    </div>
  );
}

export default EmptySection;
