import React, { useRef, useEffect } from 'react';

interface CameraViewProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
        onClose();
      }
    };
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onClose]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const video = videoRef.current;
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        canvasRef.current.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-apple-card-dark rounded-2xl shadow-2xl relative w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10 dark:border-white/10">
          <h3 className="text-lg font-semibold text-apple-text dark:text-apple-text-dark">카메라</h3>
          <button onClick={onClose} aria-label="닫기" className="text-apple-gray hover:text-apple-text dark:hover:text-apple-text-dark transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <video ref={videoRef} autoPlay playsInline className="w-full aspect-video object-cover bg-black" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex justify-center py-5">
          <button
            onClick={handleCapture}
            aria-label="사진 촬영"
            className="w-16 h-16 rounded-full border-4 border-apple-blue dark:border-apple-blue-dark flex items-center justify-center transition hover:scale-105"
          >
            <div className="w-12 h-12 bg-apple-blue dark:bg-apple-blue-dark rounded-full" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraView;
