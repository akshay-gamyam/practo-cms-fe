import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CustomModal from "../../common/Modal/CustomModal";
import {
  createTopics,
  fetchDoctorsList,
} from "../../../redux/action/topicAction/TopicAction";
import { ROLE_VARIABLES_MAP } from "../../../utils/helper";
import TipTopRichTextEditor from "../../common/richTextEditor/TipTopRichTextEditor";

const AddMedicalTopicModal = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { doctors, isCreateLoading } = useSelector((state) => state.topics);

  const isMedicalReviewer = user?.role === ROLE_VARIABLES_MAP?.MEDICAL_AFFAIRS;

  const [formData, setFormData] = useState({
    title: "",
    doctorId: "",
    description: "",
  });

  useEffect(() => {
    if (isMedicalReviewer) {
      dispatch(fetchDoctorsList());
    }
  }, [dispatch, isMedicalReviewer]);

  const resetForm = () => {
    setFormData({
      title: "",
      doctorId: "",
      description: "",
    });

    editor?.commands.clearContent(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Write detailed medical content...",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({
        ...prev,
        description: editor.getHTML(),
      }));
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await dispatch(
      createTopics({
        title: formData.title,
        assignedDoctorId: formData.doctorId,
        description: formData.description,
      })
    );

    if (response?.success) {
      toast.success("Topic Created Successfully");
      handleClose();
    }
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  if (!isMedicalReviewer) return null;

  return (
    <CustomModal
      isOpen={open}
      onClose={handleClose}
      title="Create Topic"
      maxWidth="max-w-4xl"
    >
      <h2 className="text-2xl font-semibold mb-4">Create Topic</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Doctor *</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Doctor</option>
              {doctors?.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.firstName} {doc.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description *
          </label>
          <div className="border rounded-lg">
            <TipTopRichTextEditor editor={editor} />
            <EditorContent className="p-4 min-h-[200px]" editor={editor} />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreateLoading}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-400 text-white"
          >
            {isCreateLoading ? "Creating..." : "Create Topic"}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddMedicalTopicModal;
