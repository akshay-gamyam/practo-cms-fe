import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const RichTextEditor = ({ value, onChange }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor(
    mounted
      ? {
          extensions: [StarterKit],
          content: value,
          onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
          },
          editorProps: {
            attributes: {
              class:
                "min-h-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
            },
          },
        }
      : null
  );

  if (!mounted || !editor) return null;

  return <EditorContent editor={editor} />;
};

export default RichTextEditor;