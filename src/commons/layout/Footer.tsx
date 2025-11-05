function Footer() {
  return (
    <footer className="w-full md:px-24 px-12 py-8 bg-primary flex md:flex-row flex-col md:gap-0 gap-12 justify-between items-center text-white text-xs font-sans">
      <div className="w-full flex flex-col items-start gap-1">
        <div className="text-xl font-semibold">DriveU</div>
        <div className="text-[10px] leading-snug">
          <p>Copyright © 2025 Konkuk University Graduation Project</p>
          <p>All rights reserved</p>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2 md:text-right text-[11px] leading-[1.5]">
        <div className="text-base font-bold">
          <span className="text-[#4caf4f]">Konkuk </span>
          <span className="text-white">바로가기</span>
        </div>
        <a
          href="https://www.konkuk.ac.kr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          건국대학교
        </a>
        <a
          href="https://ecampus.konkuk.ac.kr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          건국대학교 e-Campus
        </a>
        <a
          href="https://wein.konkuk.ac.kr/common/user/login.do?rtnUrl=8f4d222b9b8edea9acd345835aea594efbe2fd91b58f38dc7634e924e73e51ad"
          target="_blank"
          rel="noopener noreferrer"
        >
          건국대학교 위인전
        </a>
      </div>
    </footer>
  );
}

export default Footer;
