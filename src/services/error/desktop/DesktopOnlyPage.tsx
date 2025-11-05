function DesktopOnlyPage() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-white p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-4 break-keep">
          PC/노트북 환경에서 접속해주세요
        </h1>
        <p className="text-lg text-font break-keep">
          DriveU는 데스크탑 환경에 최적화되어 있습니다.
          <br />
          더 나은 사용 경험을 위해 PC 또는 노트북으로 접속해주세요.
        </p>
      </div>
    </div>
  );
}

export default DesktopOnlyPage;
