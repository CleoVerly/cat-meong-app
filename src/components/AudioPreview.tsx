import { RotateCcw } from 'lucide-react';

interface AudioPreviewProps {
  mediaBlobUrl: string;
  onRetake: () => void;
}

export default function AudioPreview({ mediaBlobUrl, onRetake }: AudioPreviewProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200 animate-fade-in-up">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-500 uppercase">Preview Suara</span>
        <button onClick={onRetake} className="text-xs text-red-500 flex items-center hover:underline font-bold">
          <RotateCcw className="mr-1" size={12} /> Rekam Ulang
        </button>
      </div>
      <audio src={mediaBlobUrl} controls className="w-full h-8" />
    </div>
  );
}