"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { useState, useEffect } from "react";

interface Props {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
}

export function RichTextEditor({ name, defaultValue = "", placeholder, label }: Props) {
  const [isHtml, setIsHtml] = useState(false);
  const [rawHtml, setRawHtml] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: defaultValue,
    onUpdate({ editor }) {
      setRawHtml(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (!isHtml) {
      editor.commands.setContent(rawHtml);
    }
  }, [isHtml]);

  const toolbarBtn = (action: () => boolean, label: string, active?: boolean) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); action(); }}
      className={`px-2 py-1 text-xs rounded hover:bg-gray-200 ${active ? "bg-gray-300 font-semibold" : ""}`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <div className="border border-gray-300 rounded-md overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 px-2 py-1 bg-gray-50 border-b border-gray-200">
          {!isHtml && editor && (
            <>
              {toolbarBtn(() => editor.chain().focus().toggleBold().run(), "B", editor.isActive("bold"))}
              {toolbarBtn(() => editor.chain().focus().toggleItalic().run(), "I", editor.isActive("italic"))}
              {toolbarBtn(() => editor.chain().focus().toggleUnderline().run(), "U", editor.isActive("underline"))}
              <span className="text-gray-300">|</span>
              {toolbarBtn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), "H2", editor.isActive("heading", { level: 2 }))}
              {toolbarBtn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), "H3", editor.isActive("heading", { level: 3 }))}
              <span className="text-gray-300">|</span>
              {toolbarBtn(() => editor.chain().focus().toggleBulletList().run(), "• List", editor.isActive("bulletList"))}
              {toolbarBtn(() => editor.chain().focus().toggleOrderedList().run(), "1. List", editor.isActive("orderedList"))}
              <span className="text-gray-300">|</span>
              {toolbarBtn(() => editor.chain().focus().setTextAlign("left").run(), "←")}
              {toolbarBtn(() => editor.chain().focus().setTextAlign("center").run(), "↔")}
              {toolbarBtn(() => editor.chain().focus().setTextAlign("right").run(), "→")}
            </>
          )}
          <div className="ml-auto">
            <button
              type="button"
              onClick={() => setIsHtml((v) => !v)}
              className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100"
            >
              {isHtml ? "Rich text" : "<HTML>"}
            </button>
          </div>
        </div>

        {/* Editor / HTML textarea */}
        {isHtml ? (
          <textarea
            className="w-full min-h-[200px] p-3 font-mono text-sm text-gray-800 focus:outline-none resize-y"
            value={rawHtml}
            onChange={(e) => setRawHtml(e.target.value)}
            placeholder={placeholder ?? "Paste HTML here…"}
          />
        ) : (
          <div className="min-h-[200px] p-3 prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[180px]">
            <EditorContent editor={editor} />
          </div>
        )}
      </div>

      {/* Hidden input carries the value on form submit */}
      <input type="hidden" name={name} value={rawHtml} />
    </div>
  );
}
