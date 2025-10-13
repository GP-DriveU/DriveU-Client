interface TextSectionProps {
  title: string;
  rightElement?: React.ReactNode;
}

function TextSection({ title, rightElement }: TextSectionProps) {

  return (
    <div className="flex gap-6 w-full px-10 pb-6 items-start h-full">
      <div className="text-font text-2xl items-start font-semibold font-pretendard">
        {title}
      </div>
      {rightElement && <div className="flex-grow text-xl">{rightElement}</div>}
    </div>
  );
};

export default TextSection;
