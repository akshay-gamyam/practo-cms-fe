import React, { useRef, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiMaximize2, FiVolume2, FiVolumeX } from 'react-icons/fi';

const ContentPreviewModal = ({ isOpen, onClose, video }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = React.useState(false);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Error auto-playing video:', error);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  if (!isOpen || !video) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  const videoUrl = video.videoUrl || video.url || video.fileUrl || video.video_url;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {video.topic?.title || 'Video Preview'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {video.uploadedBy?.firstName} {video.uploadedBy?.lastName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoClose className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="relative bg-black">
          {videoUrl ? (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full max-h-[70vh] object-contain"
                controls
                controlsList="nodownload"
                onError={(e) => {
                  console.error('Video error:', e);
                  console.error('Video URL that failed:', videoUrl);
                }}
              >
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} type="video/webm" />
                <source src={videoUrl} type="video/ogg" />
                Your browser does not support the video tag.
              </video>

              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors backdrop-blur-sm"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <FiVolumeX className="w-5 h-5" /> : <FiVolume2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors backdrop-blur-sm"
                  title="Fullscreen"
                >
                  <FiMaximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-white">
              <div className="text-center">
                <FiVolume2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Video URL not available</p>
                <p className="text-sm text-gray-400 mt-2">
                  Please check the video source
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Version {video.version}</span>
            <span className="flex items-center gap-4">
              {video.duration && (
                <span>Duration: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
              )}
              {video.fileSize && (
                <span>Size: {(video.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPreviewModal;