interface LocalModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function LocalModal({
  onClose,
  title,
  children,
}: LocalModalProps) {
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocalModal;
