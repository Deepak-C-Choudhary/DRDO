// src/components/VideoPlayer.jsx
const VideoPlayer = ({ src }) => {
  return (
    <video className="w-full" controls src={src}>
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;





