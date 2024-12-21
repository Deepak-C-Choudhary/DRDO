
// src/components/ProcessingCards.jsx
import { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';

const ProcessingCards = ({ uploadedFiles, processedFiles, onProcess, onRemoveFile }) => {
  const [videoUrls, setVideoUrls] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  // Create and cleanup URLs when files change
  useEffect(() => {
    // Create URLs for videos
    const newVideoUrls = uploadedFiles.videos?.map(video => URL.createObjectURL(video)) || [];
    setVideoUrls(newVideoUrls);

    // Create URLs for images
    const newImageUrls = uploadedFiles.images?.map(image => URL.createObjectURL(image)) || [];
    setImageUrls(newImageUrls);

    // Cleanup function to revoke URLs
    return () => {
      newVideoUrls.forEach(url => URL.revokeObjectURL(url));
      newImageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [uploadedFiles.videos, uploadedFiles.images]);

  // Handle file removal
  const handleRemove = (type, index) => {
    if (type === 'videos') {
      URL.revokeObjectURL(videoUrls[index]);
    } else {
      URL.revokeObjectURL(imageUrls[index]);
    }
    onRemoveFile(type, index);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md h-[calc(100vh-320px)] overflow-y-auto">
          <div className="space-y-4">
            {uploadedFiles.videos?.map((video, index) => (
              <div key={`video-${index}`} className="relative">
                <button
                  onClick={() => handleRemove('videos', index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center z-10"
                >
                  ×
                </button>
                <VideoPlayer src={videoUrls[index]} />
              </div>
            ))}
            {uploadedFiles.images?.map((image, index) => (
              <div key={`image-${index}`} className="relative">
                <button
                  onClick={() => handleRemove('images', index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center z-10"
                >
                  ×
                </button>
                <img
                  src={imageUrls[index]}
                  alt={`Preview ${index + 1}`}
                  className="max-w-full h-auto"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md h-[calc(100vh-320px)] overflow-y-auto">
          <div className="space-y-4">
            {processedFiles.videos?.map((video, index) => (
              <VideoPlayer 
                key={`processed-video-${index}`} 
                src={URL.createObjectURL(video)} 
              />
            ))}
            {processedFiles.images?.map((image, index) => (
              <img
                key={`processed-image-${index}`}
                src={URL.createObjectURL(image)}
                alt={`Processed ${index + 1}`}
                className="max-w-full h-auto"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onProcess}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Process
        </button>
      </div>
    </div>
  );
};

export default ProcessingCards;


