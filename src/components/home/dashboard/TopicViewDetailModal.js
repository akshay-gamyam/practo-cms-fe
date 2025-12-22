import React from "react";
import CustomModal from "../../common/Modal/CustomModal";
import { statusStyles } from "../../../utils/helper";
import {
  HiOutlineUser,
  HiOutlineCalendar,
} from "react-icons/hi";
import SkeletonBlock from "../../common/skeletonBlock/SkeletonBlock";
import "../../common/richTextEditor/viewRichTextEditor.css"

const TopicDetailsModal = ({ isOpen, onClose, topic, isLoading }) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Topic Details">
      {isLoading && <SkeletonBlock />}

      {!isLoading && topic && (
        <div className="space-y-8">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-semibold text-gray-900 leading-snug">
              {topic.title}
            </h3>

            <span
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyles[topic.status]}`}
            >
              {topic.status.replace("_", " ")}
            </span>
          </div>

          <div className="bg-gray-50 border rounded-xl p-4">
            <p className="text-sm font-medium text-gray-800 mb-2">
              Overview
            </p>
            {/* <p className="text-sm text-gray-600 leading-relaxed">
              {topic.description}
            </p> */}
             <div 
              className="text-sm text-gray-600 leading-relaxed richtext-content"
              dangerouslySetInnerHTML={{ __html: topic.description }}
            />
          </div>

          <div className="border rounded-xl p-5 bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <HiOutlineUser size={20} />
              </div>
              <p className="text-sm font-semibold text-gray-900">
                Assigned Doctor
              </p>
            </div>

            <div className="space-y-1 text-sm text-gray-700">
              <p className="font-medium text-gray-900">
                {topic.assignedDoctor?.firstName}{" "}
                {topic.assignedDoctor?.lastName}
              </p>
              <p>{topic.assignedDoctor?.specialty}</p>
              {topic.assignedDoctor?.city && (
                <p className="text-gray-500">
                  {topic.assignedDoctor.city}
                </p>
              )}
              {topic.assignedDoctor?.email && (
                <p className="text-blue-600 text-sm">
                  {topic.assignedDoctor.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                <HiOutlineUser size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Created By</p>
                <p className="text-sm font-medium text-gray-800">
                  {topic.createdBy?.firstName}{" "}
                  {topic.createdBy?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {topic.createdBy?.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                <HiOutlineCalendar size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Created On</p>
                <p className="text-sm font-medium text-gray-800">
                  {new Date(topic.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !topic && (
        <p className="text-sm text-gray-500 text-center py-8">
          No topic details available
        </p>
      )}
    </CustomModal>
  );
};
export default TopicDetailsModal;