import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CustomModal from "../../../common/Modal/CustomModal";
import TipTopRichTextEditor from "../../../common/richTextEditor/TipTopRichTextEditor";
import {
  createScript,
  updateScript,
  fetchScriptById,
} from "../../../../redux/action/agencyPocAction/AgencyPocAction";
import { clearSelectedScript } from "../../../../redux/reducer/agencyPocReducer/AgencyPocReducer";

const EditScriptModal = ({ open, onClose, topic, mode = "create" }) => {
  const dispatch = useDispatch();

  const {
    selectedScript,
    isScriptLoading,
    isCreateScriptLoading,
    isUpdateScriptLoading,
  } = useSelector((state) => state.agencyPoc);

  const [formData, setFormData] = useState({
    content: "",
  });

  // Determine the mode based on topic's script status
  const getModalConfig = () => {
    if (!topic?.scripts || topic.scripts.length === 0) {
      return {
        mode: "create",
        title: "Write Script",
        submitText: "Create Script",
        isReadOnly: false,
      };
    }

    const script = topic.scripts[0];
    const status = script?.status;

    switch (status) {
      case "DRAFT":
        return {
          mode: "update",
          title: "Continue Draft",
          submitText: "Update Script",
          isReadOnly: false,
          scriptId: script.id,
        };
      case "REJECTED":
        return {
          mode: "update",
          title: "Fix Script",
          submitText: "Submit Fixed Script",
          isReadOnly: false,
          scriptId: script.id,
        };
      case "IN_REVIEW":
      case "LOCKED":
        return {
          mode: "view",
          title: "View Script",
          submitText: null,
          isReadOnly: true,
          scriptId: script.id,
        };
      default:
        return {
          mode: "create",
          title: "Write Script",
          submitText: "Create Script",
          isReadOnly: false,
        };
    }
  };

  const modalConfig = getModalConfig();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: modalConfig.isReadOnly
          ? ""
          : "Write your script content here...",
      }),
    ],
    content: "",
    editable: !modalConfig.isReadOnly,
    onUpdate: ({ editor }) => {
      if (!modalConfig.isReadOnly) {
        setFormData((prev) => ({
          ...prev,
          content: editor.getHTML(),
        }));
      }
    },
  });

  // Load existing script if in update or view mode
  useEffect(() => {
    if (open && modalConfig.scriptId) {
      dispatch(fetchScriptById(modalConfig.scriptId));
    }
  }, [open, modalConfig.scriptId, dispatch]);

  // Set editor content when script is loaded
  useEffect(() => {
    if (selectedScript?.content && editor) {
      editor.commands.setContent(selectedScript.content);
      setFormData({ content: selectedScript.content });
    }
  }, [selectedScript, editor]);

  const resetForm = () => {
    setFormData({ content: "" });
    editor?.commands.clearContent(true);
    dispatch(clearSelectedScript());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      toast.error("Please write some content for the script");
      return;
    }

    let response;

    if (modalConfig.mode === "create") {
      // Create new script
      response = await dispatch(createScript(topic.id, formData.content));
    } else if (modalConfig.mode === "update") {
      // Update existing script (continue draft or fix script)
      response = await dispatch(updateScript(modalConfig.scriptId, formData.content));
    }

    if (response?.success) {
      const successMessage =
        modalConfig.mode === "create"
          ? "Script Created Successfully"
          : modalConfig.title === "Fix Script"
          ? "Script Fixed and Resubmitted Successfully"
          : "Script Updated Successfully";
      toast.success(successMessage);
      handleClose();
    } else {
      toast.error(response?.error || "Failed to save script");
    }
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const isLoading =
    isScriptLoading || isCreateScriptLoading || isUpdateScriptLoading;

  return (
    <CustomModal
      isOpen={open}
      onClose={handleClose}
      title={modalConfig.title}
      maxWidth="max-w-5xl"
    >
      <div className="space-y-4">
        <div>
          {/* <h2 className="text-2xl font-semibold mb-2">{modalConfig.title}</h2> */}
          <p className="text-gray-600 text-2xl font-semibold">{topic?.title}</p>
          <p className="text-gray-600 text-md">{topic?.description}</p>
        </div>

        {/* Show rejection reason if script was rejected */}
        {modalConfig.mode === "update" &&
          topic?.scripts?.[0]?.status === "REJECTED" &&
          topic?.scripts?.[0]?.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-1">
                Rejection Reason:
              </h4>
              <p className="text-red-700">{topic.scripts[0].rejectionReason}</p>
            </div>
          )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Script Content {!modalConfig.isReadOnly && "*"}
            </label>
            <div className="border rounded-lg overflow-hidden">
              {!modalConfig.isReadOnly && (
                <TipTopRichTextEditor editor={editor} />
              )}
              <EditorContent
                className={`p-4 ${
                  modalConfig.isReadOnly ? "min-h-[400px]" : "min-h-[300px]"
                } ${isScriptLoading ? "opacity-50" : ""}`}
                editor={editor}
              />
            </div>
            {isScriptLoading && (
              <p className="text-sm text-gray-500 mt-2">Loading script...</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              {modalConfig.isReadOnly ? "Close" : "Cancel"}
            </button>
            {modalConfig.submitText && (
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-400 text-white hover:from-blue-700 hover:to-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? modalConfig.mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : modalConfig.submitText}
              </button>
            )}
          </div>
        </form>
      </div>
    </CustomModal>
  );
};

export default EditScriptModal;