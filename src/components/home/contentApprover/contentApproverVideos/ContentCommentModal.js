import React, { useState } from "react";
import CustomModal from "../../../common/Modal/CustomModal";

const ContentCommentModal = ({
  isOpen,
  onClose,
  video,
  onSubmit,
  commentType = "comment",
}) => {
  const [comment, setComment] = useState("");

  if (!isOpen || !video) return null;

    const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
      setComment("");
    }
  };

  if (!isOpen || !video) return null;

  const getModalTitle = () => {
    switch (commentType) {
      case 'approve':
        return 'Approve Comment';
      case 'reject':
        return 'Reject Comment';
      default:
        return 'Add Comment';
    }
  };

  const getSubmitButtonText = () => {
    switch (commentType) {
      case 'approve':
        return 'Approve Comment';
      case 'reject':
        return 'Reject Comment';
      default:
        return 'Submit Comment';
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={getModalTitle()}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Comment for:{" "}
            <span className="font-semibold text-gray-900">{video.title}</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment or feedback..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows="6"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              onClose();
              setComment("");
            }}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!comment.trim()}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {getSubmitButtonText()}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ContentCommentModal;
