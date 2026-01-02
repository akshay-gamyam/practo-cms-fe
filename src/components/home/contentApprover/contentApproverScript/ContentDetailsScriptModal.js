import React from "react";
import CustomModal from "../../../common/Modal/CustomModal";
import { FiCheckCircle } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import {
  formatDate,
  getContentPreview,
  getStatusBadge,
  getWordCount,
} from "../../../../utils/helper";

const ContentDetailsModal = ({ isOpen, onClose, content, type = "script" }) => {
  if (!content) return null;

  console.log("content", content);

  const title = content.topic?.title || content.title || "Untitled";
  const authorName = content.uploadedBy
    ? `${content.uploadedBy.firstName} ${content.uploadedBy.lastName}`
    : content.author || "Unknown Author";

  const department = content.topic?.department || content.department || "N/A";

  const wordCount = content.wordCount || getWordCount(content.content);

  const submittedDate = formatDate(content.createdAt || content.submittedDate);
  const updatedDate = formatDate(content.updatedAt);

  const contentPreview = getContentPreview(content.content);
   const contentPreviewRejected = getContentPreview(content.reviewComments);

  const statusBadge = getStatusBadge(content.status);

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${type === "script" ? "Script" : "Video"} Details`}
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-500">Title</label>
          <p className="text-gray-900 mt-1 text-lg font-semibold">{title}</p>
        </div>

        {content.topic?.description && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              Description
            </label>
            <div
              className="text-gray-700 mt-1 text-sm"
              dangerouslySetInnerHTML={{ __html: content.topic.description }}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Author</label>
            <p className="text-gray-900 mt-1">{authorName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              {type === "script" ? "Department" : "Category"}
            </label>
            <p className="text-gray-900 mt-1">{department}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">
              {type === "script" ? "Submitted" : "Duration"}
            </label>
            <p className="text-gray-900 mt-1">
              {type === "script" ? submittedDate : content.duration}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              {type === "script" ? "Word Count" : "File Size"}
            </label>
            <p className="text-gray-900 mt-1">
              {type === "script" ? `${wordCount} words` : content.fileSize}
            </p>
          </div>
        </div>

        {type === "video" && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Submitted
              </label>
              <p className="text-gray-900 mt-1">{content.submittedDate}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Priority
              </label>
              <p className="text-gray-900 mt-1 capitalize">
                {content.priority}
              </p>
            </div>
          </div>
        )}

        {type === "script" && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Version
              </label>
              <p className="text-gray-900 mt-1">
                Version {content.version || 1}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Last Updated
              </label>
              <p className="text-gray-900 mt-1">{updatedDate}</p>
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-500">Status</label>
          <div className="mt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md ${statusBadge.class}`}
            >
              {statusBadge.icon}
              {statusBadge.text}
            </span>
          </div>
        </div>

        {content.lockedById && content.status?.toLowerCase() === "approved" && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <FiCheckCircle className="w-4 h-4" />
              <span className="font-medium">Approved</span>
            </div>
            {content.lockedAt && (
              <p className="text-xs text-green-600 mt-1">
                {formatDate(content.lockedAt)}
              </p>
            )}
          </div>
        )}

        {content.lockedById && content.status?.toLowerCase() === "rejected" && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-red-700 mb-2">
              <IoClose className="w-4 h-4" />
              <span className="font-medium">Rejected</span>
            </div>
            {content.reason && (
              <p className="text-sm text-red-600">
                <span className="font-medium">Reason:</span> {content.reason}
              </p>
            )}
            {content.lockedAt && (
              <p className="text-xs text-red-600 mt-1">
                {formatDate(content.lockedAt)}
              </p>
            )}
          </div>
        )}

        {type === "script" && content.content && (
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-2">
              Content Preview
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-60 overflow-y-auto">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {contentPreview}
              </p>
            </div>
          </div>
        )}

        {type === "script" && content.reviewComments && (
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-2">
              Content comment
            </label>

            <div
              className={`rounded-lg p-4 border max-h-60 overflow-y-auto
        ${
          content?.decision === "REJECTED"
            ? "bg-red-50 border-red-200"
            : content?.decision === "APPROVED"
            ? "bg-green-50 border-green-200"
            : "bg-gray-50 border-gray-200"
        }
      `}
            >
              <p
                className={`text-sm whitespace-pre-wrap
          ${
            content?.decision === "REJECTED"
              ? "text-red-700"
              : content?.decision === "APPROVED"
              ? "text-green-700"
              : "text-gray-700"
          }
        `}
              >
                {contentPreviewRejected}
              </p>
            </div>
          </div>
        )}

        {content.comments && content.comments.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-2">
              Comments ({content.comments.length})
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {content.comments.map((comment, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-900 flex-1">
                      {comment.text}
                    </p>
                    {comment.type && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ml-2 ${
                          comment.type === "approve"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {comment.type}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.date).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.tags && content.tags.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default ContentDetailsModal;
