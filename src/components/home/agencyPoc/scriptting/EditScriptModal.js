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
  submitScriptForReview,
} from "../../../../redux/action/agencyPocAction/AgencyPocAction";
import { clearSelectedScript } from "../../../../redux/reducer/agencyPocReducer/AgencyPocReducer";

const EditScriptModal = ({ open, onClose, topic, mode = "create" }) => {
  const dispatch = useDispatch();

  const {
    selectedScript,
    isScriptLoading,
    isCreateScriptLoading,
    isUpdateScriptLoading,
    isSubmitScriptLoading,
  } = useSelector((state) => state.agencyPoc);

  const [formData, setFormData] = useState({ content: "" });
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState("");

  const getModalConfig = () => {
    if (!topic?.scripts || topic.scripts.length === 0) {
      return {
        mode: "create",
        title: "Write Script",
        submitText: "Save as Draft",
        showSubmitForReview: true,
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
          submitText: "Update Draft",
          showSubmitForReview: true,
          isReadOnly: false,
          scriptId: script.id,
        };
      case "REJECTED":
        return {
          mode: "update",
          title: "Fix Script",
          submitText: "Update Script",
          showSubmitForReview: true,
          isReadOnly: false,
          scriptId: script.id,
        };
      case "IN_REVIEW":
        return {
          mode: "view",
          title: "View Script",
          submitText: null,
          showSubmitForReview: false,
          isReadOnly: true,
          scriptId: script.id,
        };
      case "MEDICAL_REVIEW":
        return {
          mode: "view",
          title: "View Script",
          submitText: null,
          showSubmitForReview: false,
          isReadOnly: true,
          scriptId: script.id,
        };
      case "BRAND_REVIEW":
        return {
          mode: "view",
          title: "View Script",
          submitText: null,
          showSubmitForReview: false,
          isReadOnly: true,
          scriptId: script.id,
        };
      case "DOCTOR_REVIEW":
        return {
          mode: "view",
          title: "View Script",
          submitText: null,
          showSubmitForReview: false,
          isReadOnly: true,
          scriptId: script.id,
        };
      case "LOCKED":
        return {
          mode: "view",
          title: "View Script",
          submitText: null,
          showSubmitForReview: false,
          isReadOnly: true,
          scriptId: script.id,
        };
      default:
        return {
          mode: "create",
          title: "Write Script",
          submitText: "Save as Draft",
          showSubmitForReview: true,
          isReadOnly: false,
        };
    }
  };

  const modalConfig = getModalConfig();
  const isDraftMode =
    modalConfig.mode === "update" && topic?.scripts?.[0]?.status === "DRAFT";

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
      const html = editor.getHTML();
      if (!modalConfig.isReadOnly) {
        setFormData((prev) => ({
          ...prev,
          content: html,
        }));
      }
      if (isDraftMode) {
        setHasUnsavedChanges(html !== lastSavedContent);
      }
    },
  });

  useEffect(() => {
    if (open && modalConfig.scriptId) {
      dispatch(fetchScriptById(modalConfig.scriptId));
      if (modalConfig.mode === "update") {
        setHasSavedDraft(true);
      }
    }
  }, [open, modalConfig.scriptId, modalConfig.mode, dispatch]);

  useEffect(() => {
    if (selectedScript?.content && editor) {
      editor.commands.setContent(selectedScript.content);
      setFormData({ content: selectedScript.content });
      setLastSavedContent(selectedScript.content);
      setHasUnsavedChanges(false);
    }
  }, [selectedScript, editor]);

  const resetForm = () => {
    setFormData({ content: "" });
    setHasSavedDraft(false);
    setHasUnsavedChanges(false);
    setLastSavedContent("");
    editor?.commands.clearContent(true);
    dispatch(clearSelectedScript());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      toast.error("Please write some content for the script");
      return;
    }

    let response;

    if (modalConfig.mode === "create") {
      response = await dispatch(createScript(topic.id, formData.content));
    } else if (modalConfig.mode === "update") {
      response = await dispatch(
        updateScript(modalConfig.scriptId, formData.content)
      );
    }

    if (response?.success) {
      const successMessage =
        modalConfig.mode === "create"
          ? "Script Saved as Draft Successfully"
          : "Script Updated Successfully";
      toast.success(successMessage);
      setHasSavedDraft(true);
      setLastSavedContent(formData.content);
      setHasUnsavedChanges(false);

      if (modalConfig.mode === "create" && response.data?.script) {
        modalConfig.scriptId = response.data.script.id;
        modalConfig.mode = "update";
      }
    } else {
      toast.error(response?.error || "Failed to save script");
    }
  };

  const handleSubmitForReview = async () => {
    const scriptId = modalConfig.scriptId || selectedScript?.id;

    if (!scriptId) {
      toast.error("Please save the draft first before submitting for review");
      return;
    }

    const response = await dispatch(submitScriptForReview(scriptId));

    if (response?.success) {
      toast.success("Script Submitted for Review Successfully");
      handleClose();
    } else {
      toast.error(response?.error || "Failed to submit script for review");
    }
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const isLoading =
    isScriptLoading ||
    isCreateScriptLoading ||
    isUpdateScriptLoading ||
    isSubmitScriptLoading;


  const showUpdateButton = isDraftMode ? hasUnsavedChanges : !!modalConfig.submitText;
  const canSubmitForReview = isDraftMode
    ? !hasUnsavedChanges && hasSavedDraft
    : hasSavedDraft && (modalConfig.mode === "update" || (modalConfig.mode === "create" && selectedScript?.id));

  return (
    <CustomModal
      isOpen={open}
      onClose={handleClose}
      title={modalConfig.title}
      maxWidth="max-w-5xl"
    >
      <div className="space-y-4">
        <div>
          <p className="text-gray-600 text-2xl font-semibold">{topic?.title}</p>
          <p className="text-gray-600 text-md"  dangerouslySetInnerHTML={{ __html: topic?.description }}/>
        </div>

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

        <form onSubmit={handleSaveDraft} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Script Content {!modalConfig.isReadOnly && "*"}
            </label>
            {/* <div
              className="border rounded-lg overflow-hidden"
              onClick={() => editor?.chain().focus().run()}
            > */}
             <div
              className={`border-2 rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-200 ${
                modalConfig.isReadOnly 
                  ? "border-purple-200 bg-gradient-to-br from-purple-50/30 to-white pointer-events-none" 
                  : "border-gray-200 hover:border-blue-300 cursor-text"
              }`}
              onClick={() => !modalConfig.isReadOnly && editor?.chain().focus().run()}
            >
              {!modalConfig.isReadOnly && (
                <TipTopRichTextEditor editor={editor} />
              )}
              <EditorContent
                className={`tiptap-editor ${
                  modalConfig.isReadOnly ? "read-only" : ""
                } ${isScriptLoading ? "opacity-50" : ""}`}
                editor={editor}
              />
            </div>
            {isScriptLoading && (
              <p className="text-sm text-gray-500 mt-2">Loading script...</p>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              {isDraftMode && hasUnsavedChanges && (
                <p className="text-sm text-amber-600 italic">
                  You have unsaved changes. Update draft to enable "Submit for Review"
                </p>
              )}
              {!isDraftMode && !canSubmitForReview && !modalConfig.isReadOnly && (
                  <p className="text-sm text-gray-500 italic">
                    Save as draft first to enable "Submit for Review"
                  </p>
                )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                {modalConfig.isReadOnly ? "Close" : "Cancel"}
              </button>

              {showUpdateButton && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-400 text-white hover:from-blue-700 hover:to-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreateScriptLoading || isUpdateScriptLoading
                    ? "Saving..."
                    : modalConfig.submitText}
                </button>
              )}

              {modalConfig.showSubmitForReview && (
                <button
                  type="button"
                  onClick={handleSubmitForReview}
                  disabled={!canSubmitForReview || isLoading}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:from-green-700 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitScriptLoading
                    ? "Submitting..."
                    : "Submit for Review"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </CustomModal>
  );
};

export default EditScriptModal;
