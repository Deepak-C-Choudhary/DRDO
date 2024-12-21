
// src/App.jsx
import { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import UploadSection from './components/UploadSection';
import ProcessingCards from './components/ProcessingCards';

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({ images: [], videos: [] });
  const [processedFiles, setProcessedFiles] = useState({ images: [], videos: [] });
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleStartStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const file = new File([blob], 'recorded-video.webm', { type: 'video/webm' });
        setUploadedFiles(prev => ({
          ...prev,
          videos: [...prev.videos, file]
        }));
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const handleStopStreaming = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsRecording(false);
    }
  };

  const handleRemoveFile = (type, index) => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleProcess = async () => {
    // Add processing logic here
    console.log('Processing files...');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar 
          onStartStreaming={handleStartStreaming}
          onStopStreaming={handleStopStreaming}
          isRecording={isRecording}
        />
        <main className="flex-1 p-6">
          <UploadSection 
            onUpload={setUploadedFiles}
            isRecording={isRecording}
            videoRef={videoRef}
          />
          <h2 className="text-xl font-semibold mb-4 flex justify-between">
            <span>Preview</span>
            <span className="mr-auto ml-[calc(50%+2rem)]">Processed Output</span>
          </h2>
          <ProcessingCards
            uploadedFiles={uploadedFiles}
            processedFiles={processedFiles}
            onProcess={handleProcess}
            onRemoveFile={handleRemoveFile}
            isRecording={isRecording}
            videoRef={videoRef}
          />
        </main>
      </div>
    </div>
  );
};

export default App;