
import { useRef, useState } from "react";

const UploadSection = ({ onUpload, videoRef }) => {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    onUpload((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...files],
    }));
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    onUpload((prev) => ({
      ...prev,
      videos: [...(prev.videos || []), ...files],
    }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      videoRef.current.srcObject = stream;
      videoRef.current.classList.remove("hidden");

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const file = new File([blob], `recorded-video-${Date.now()}.webm`, {
          type: "video/webm",
        });
        onUpload((prev) => ({
          ...prev,
          videos: [...(prev.videos || []), file],
        }));

        // Clean up
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        videoRef.current.classList.add("hidden");
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert(
        "Failed to access camera. Please ensure you have granted camera permissions."
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRecordingClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex space-x-4 mb-4">
        <input
          type="file"
          ref={imageInputRef}
          onChange={handleImageUpload}
          className="hidden"
          multiple
          accept="image/*"
        />
        <input
          type="file"
          ref={videoInputRef}
          onChange={handleVideoUpload}
          className="hidden"
          multiple
          accept="video/*"
        />
        <button
          onClick={() => imageInputRef.current.click()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Upload Images
        </button>
        <button
          onClick={() => videoInputRef.current.click()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Upload Videos
        </button>
        <button
          onClick={handleRecordingClick}
          className={`px-4 py-2 text-white rounded-md hover:bg-red-700 ${
            isRecording ? "bg-red-600" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
      <video
        ref={videoRef}
        className="hidden w-full max-h-[400px] rounded-lg mb-4"
        autoPlay
        muted
        playsInline
      />
    </div>
  );
};

export default UploadSection;