
// src/components/Navbar.jsx
import { useState, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

const Navbar = ({ onStartStreaming, onStopStreaming, isRecording, onUpload }) => {
  const [ipAddress, setIpAddress] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleRefresh = () => {
    setIpAddress('');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: true 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const file = new File([blob], `recorded-video-${Date.now()}.webm`, { 
          type: 'video/webm' 
        });
        
        if (onUpload) {
          onUpload(prev => ({ 
            ...prev, 
            videos: [...(prev.videos || []), file] 
          }));
        }

        // Clean up
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      onStartStreaming(stream); // Pass the stream to parent component
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Failed to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      onStopStreaming();
    }
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative flex items-center">
          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="Enter IP address here..."
            className="w-64 px-4 py-2 border rounded-md"
          />
          <button
            onClick={handleRefresh}
            className="absolute right-2 text-gray-500 hover:text-blue-600"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={startRecording}
          className={`px-4 py-2 rounded-md ${
            isRecording
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          } text-white`}
          disabled={isRecording}
        >
          Start Streaming
        </button>
        <button
          onClick={stopRecording}
          className={`px-4 py-2 rounded-md ${
            !isRecording
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600'
          } text-white`}
          disabled={!isRecording}
        >
          Stop Streaming
        </button>
      </div>
    </nav>
  );
};

export default Navbar;