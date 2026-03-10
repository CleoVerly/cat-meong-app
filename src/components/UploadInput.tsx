import { Upload } from 'lucide-react';

interface UploadInputProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadInput({ file, onFileChange }: UploadInputProps) {
  return (
    <>
      <div className="relative flex py-2 items-center mb-4">
        <div className="grow border-t border-gray-200"></div>
        <span className="shrink-0 mx-4 text-gray-300 text-[10px] uppercase tracking-widest">Opsi Lain</span>
        <div className="grow border-t border-gray-200"></div>
      </div>

      <div className="text-center">
        <label className="cursor-pointer inline-flex items-center justify-center w-full py-3 px-4 rounded-xl text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 transition-all border border-dashed border-indigo-200 hover:border-indigo-400">
          <Upload className="text-lg mr-2" size={18}/>
          <span className="text-sm font-medium">{file ? `File: ${file.name}` : "Upload file .wav manual"}</span>
          <input 
            type="file" 
            accept=".wav" 
            onChange={onFileChange} 
            className="hidden" 
          />
        </label>
      </div>
    </>
  );
}