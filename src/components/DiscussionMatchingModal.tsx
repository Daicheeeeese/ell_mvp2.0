import { useState } from 'react';

interface MatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedTime: string) => void;
  articleTitle: string;
}

export default function DiscussionMatchingModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  articleTitle 
}: MatchingModalProps) {
  const [selectedTime, setSelectedTime] = useState('');

  // 0時から23時までの選択肢を生成
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedTime);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">本日のディスカッション時間を選択</h2>

        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2">時間</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">時間を選択</option>
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={timeOptions.length === 0}
            >
              マッチングを申し込む
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 