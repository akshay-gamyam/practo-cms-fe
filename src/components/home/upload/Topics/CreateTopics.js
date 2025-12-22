import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDoctorsList,
  createTopics,
  fetchUplodedTopcsList,
} from "../../../../redux/action/topicAction/TopicAction";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../../routes/RouterConstant";
import { createDoctorPointers } from "../../../../redux/action/doctorAction/DoctorAction";
import { ROLE_VARIABLES_MAP } from "../../../../utils/helper";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TipTopRichTextEditor from "../../../common/richTextEditor/TipTopRichTextEditor";

const CreateTopics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: topicId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    doctorId: "",
    description: "",
  });

  const { user } = useSelector((state) => state.auth);
  const { doctors, topics, isCreateLoading } = useSelector(
    (state) => state.topics
  );

  const isDoctorCreator = user?.role === ROLE_VARIABLES_MAP?.DOCTOR_CREATOR;
  const isMedicalReviewerCreator =
    user?.role === ROLE_VARIABLES_MAP?.MEDICAL_REVIEWER;

  const selectedTopic = useMemo(() => {
    return topics?.find((topic) => topic?.id === topicId);
  }, [topics, topicId]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: isDoctorCreator
          ? "Write doctor notes..."
          : "Write detailed medical content...",
      }),
    ],
    content: formData.description,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData((prev) => ({ ...prev, description: html }));
    },
  });

  useEffect(() => {
    dispatch(fetchUplodedTopcsList());
  }, [dispatch]);

  useEffect(() => {
    if (isMedicalReviewerCreator) {
      dispatch(fetchDoctorsList());
    }
  }, [dispatch, isMedicalReviewerCreator]);

  // const doctorFirstName = selectedTopic?.assignedDoctor?.firstName;
  // const doctorLastName = selectedTopic?.assignedDoctor?.lastName;
  const selectedDoctorId = selectedTopic?.assignedDoctor?.id;

  useEffect(() => {
    if (isDoctorCreator && selectedTopic) {
      setFormData((prev) => ({
        ...prev,
        title: selectedTopic.title || "",
      }));
    }
  }, [isDoctorCreator, selectedTopic]);

  useEffect(() => {
    if (isMedicalReviewerCreator && selectedDoctorId) {
      setFormData((prev) => ({
        ...prev,
        doctorId: selectedDoctorId,
      }));
    }
  }, [isMedicalReviewerCreator, selectedDoctorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      doctorId: "",
      description: "",
    });
    if (editor) {
      editor.commands.setContent("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (isDoctorCreator) {
        response = await dispatch(
          createDoctorPointers({
            topicId,
            notes: formData.description,
          })
        );
        console.log("reposning ", response);
      } else {
        response = await dispatch(
          createTopics({
            title: formData.title,
            assignedDoctorId: formData.doctorId,
            description: formData.description,
          })
        );
      }

      if (response?.success) {
        toast.success("Created Successfully" || response.message);
        const routingTopic = isDoctorCreator
          ? ROUTES.MY_TOPICS
          : ROUTES.MEDICAL_TOPICS;
        resetForm();
        navigate(routingTopic);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create", {
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-full mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">
            {isDoctorCreator ? "Add Doctor Notes" : "Create Topic"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isDoctorCreator
              ? "Review topic details and add your medical notes"
              : "Add new topic content"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            {isDoctorCreator ? "Add Doctor Notes" : "Topic Details"}
          </h2>
          <p className="text-gray-500 mb-6">
            Provide title, description and doctor details
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              {/* {!isDoctorCreator && ( */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isDoctorCreator}
                    placeholder="Enter content title"
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      isDoctorCreator
                        ? "bg-gray-100 cursor-not-allowed text-gray-700"
                        : ""
                    }`}
                  />
                </div>
                {!isDoctorCreator && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Doctor Name *
                    </label>
                    {/* {isMedicalReviewerCreator ? (
                      <input
                        type="text"
                        value={`${doctorFirstName} ${doctorLastName}`}
                        disabled
                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                      />
                    ) : ( */}
                    <select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Doctor</option>
                      {doctors?.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.firstName} {doctor?.lastName}
                        </option>
                      ))}
                    </select>
                    {/* )} */}
                  </div>
                )}
              </div>

              {isDoctorCreator && selectedTopic?.description && (
                <div className="py-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic Description
                  </label>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                    {selectedTopic.description}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isDoctorCreator ? "Doctor Notes *" : "Description *"}
                </label>
                {/* <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  placeholder={
                    isDoctorCreator
                      ? "Write doctor notes..."
                      : "Write detailed medical content..."
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                /> */}
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <TipTopRichTextEditor editor={editor} />
                  <EditorContent
                    editor={editor}
                    className="prose max-w-none p-4 min-h-[200px] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(ROUTES.MY_TOPICS)}
                className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreateLoading}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-teal-400 text-white hover:shadow-xl disabled:opacity-50"
              >
                {isCreateLoading ? "Publishing..." : "Publish Topic"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTopics;
