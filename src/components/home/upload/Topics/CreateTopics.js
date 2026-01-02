import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { fetchUplodedTopcsList } from "../../../../redux/action/topicAction/TopicAction";
import { createDoctorPointers } from "../../../../redux/action/doctorAction/DoctorAction";
import { ROLE_VARIABLES_MAP } from "../../../../utils/helper";
import { ROUTES } from "../../../../routes/RouterConstant";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

import TipTopRichTextEditor from "../../../common/richTextEditor/TipTopRichTextEditor";
import "../../../common/richTextEditor/richTextEditor.css";

const CreateTopics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: topicId } = useParams();
  const location = useLocation();
  const topicFromState = location.state;

  const { user } = useSelector((state) => state.auth);
  const { topics, isCreateLoading } = useSelector((state) => state.topics);
  const isDoctorCreator =
    user?.role === ROLE_VARIABLES_MAP?.DOCTOR_CREATOR ||
    user?.role === ROLE_VARIABLES_MAP?.SUPER_ADMIN;

  const [formData, setFormData] = useState({
    title: "",
    doctorId: "",
    description: "",
  });

  const selectedTopic = useMemo(() => {
    const topicFromRedux = topics?.find((topic) => topic?.id === topicId);
    return topicFromRedux || topicFromState;
  }, [topics, topicId, topicFromState]);

  const selectedDoctorId = selectedTopic?.assignedDoctor?.id;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
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
    if (isDoctorCreator && selectedTopic) {
      setFormData((prev) => ({
        ...prev,
        title: selectedTopic.title || "",
      }));
    }
  }, [isDoctorCreator, selectedTopic]);

  useEffect(() => {
    if (selectedDoctorId) {
      setFormData((prev) => ({
        ...prev,
        doctorId: selectedDoctorId,
      }));
    }
  }, [selectedDoctorId]);

  const resetForm = () => {
    setFormData({ title: "", doctorId: "", description: "" });
    editor?.commands.setContent("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(
        createDoctorPointers({
          topicId,
          notes: formData.description,
        })
      );

      if (response?.success) {
        toast.success("Created Successfully");
        resetForm();
        navigate(ROUTES.MY_TOPICS);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-full mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">
            Add Doctor Notes
          </h1>
          <p className="text-gray-500 mt-1">
            Review topic details and add your medical notes
          </p>
        </header>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                name="title"
                value={formData.title}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            {selectedTopic?.description && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Topic Description
                </label>
                <div
                  className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-700 richtext-content"
                  dangerouslySetInnerHTML={{
                    __html: selectedTopic.description,
                  }}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Doctor Notes *
              </label>
              <div className="border rounded-lg overflow-hidden">
                <TipTopRichTextEditor editor={editor} />
                <EditorContent
                  editor={editor}
                  className="tiptap-editor p-4 min-h-[200px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(ROUTES.MY_TOPICS)}
                className="px-5 py-2 border rounded-lg text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreateLoading}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-teal-400 text-white disabled:opacity-50"
              >
                {isCreateLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTopics;
