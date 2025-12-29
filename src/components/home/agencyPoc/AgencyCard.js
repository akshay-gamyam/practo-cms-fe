import React from 'react'
import { EDIT_BUTTON_CONFIG } from '../../../utils/helper';

const AgencyCard = ({ project, onViewProject, onEditProject, viewTextButton, editTextButton }) => {

const config = EDIT_BUTTON_CONFIG[editTextButton] || {};
const editTextButtonClasses = config.classes || "bg-gray-100 text-gray-600";
const EditIcon = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
          {project?.assignedDoctor?.firstName?.[0] || ""}
          {project?.assignedDoctor?.lastName?.[0] || ""}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">
            {project?.assignedDoctor?.firstName} {project?.assignedDoctor?.lastName} 
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {project?.title}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {project?.assignedDoctor?.specialty && (
              <span className="px-4 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {project.assignedDoctor.specialty}
              </span>
            )}
          </div>

          {project?.description && (
            <div 
              className="mt-3 text-sm text-gray-600 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col justify-between">
              <button
                onClick={() => onViewProject(project?.id)}
                className="mt-4 w-full text-sm py-2 rounded-xl hover:text-white border border-gray-300 text-gray-900 font-medium hover:bg-teal-500 transition"
              >
                {viewTextButton || "View Details"}
              </button>
            </div>

            <div className="flex flex-col justify-between items-start">
              <button 
                onClick={() => onEditProject(project?.id)} 
                className={` mt-4 w-full flex items-center justify-center gap-2 text-sm py-2 rounded-xl border border-gray-300 font-medium text-white transition ${editTextButtonClasses}`}
              >
                {EditIcon}
                <span>{editTextButton || ""}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AgencyCard