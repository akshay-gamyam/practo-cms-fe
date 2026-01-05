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
                "prosemirror-editor focus:outline-none",
            },
          },
        }
      : null
  );

  if (!mounted || !editor) return null;

  return <EditorContent editor={editor} />;
};

export default RichTextEditor;