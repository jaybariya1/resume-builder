import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Bold, Italic, Underline, List, Link, Undo, Redo } from "lucide-react";

function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const [active, setActive] = useState({});
  const [isFocused, setIsFocused] = useState(false);

  const formatText = (command) => {
    editorRef.current.focus();
    document.execCommand(command, false, null);
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      ul: document.queryCommandState("insertUnorderedList"),
    });
  };

  const insertLink = () => {
    const url = prompt("Enter the URL");
    if (url) {
      formatText("createLink");
      document.execCommand("createLink", false, url);
    }
  };

  const handleInput = () => {
    onChange(editorRef.current.innerHTML);
    updateActiveFormats();
  };

  useEffect(() => {
    const editor = editorRef.current;

    editor.addEventListener("keyup", updateActiveFormats);
    editor.addEventListener("mouseup", updateActiveFormats);

    return () => {
      editor.removeEventListener("keyup", updateActiveFormats);
      editor.removeEventListener("mouseup", updateActiveFormats);
    };
  }, []);

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!editorRef.current) return;

    // Load content only when value comes from outside
    if (!isInitialized.current || editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
      isInitialized.current = true;
    }
  }, [value]);

  return (
    <div className="editor-container">
      {/* <div className="toolbar">
        <button onClick={() => formatText("bold")}>B</button>
        <button onClick={() => formatText("italic")}>I</button>
        <button onClick={() => formatText("underline")}>U</button>
        <button onClick={() => formatText("insertUnorderedList")}>• List</button>
      </div> */}

      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border border-gray-300 rounded-t-lg">
        <button
          onClick={() => formatText("bold")}
          className={`p-2 hover:bg-gray-200 rounded transition-colors ${
            active.bold ? "bg-gray-300" : ""
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => formatText("italic")}
          className={`p-2 hover:bg-gray-200 rounded transition-colors ${
            active.italic ? "bg-gray-300" : ""
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => formatText("underline")}
          className={`p-2 hover:bg-gray-200 rounded transition-colors ${
            active.underline ? "bg-gray-300" : ""
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button
          onClick={() => formatText("insertUnorderedList")}
          className={`p-2 hover:bg-gray-200 rounded transition-colors ${
            active.ul ? "bg-gray-300" : ""
          }`}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => insertLink()}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Insert Link"
        >
          <Link size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button
          onClick={() => formatText("undo")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={() => formatText("redo")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo size={18} />
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className={`editor border text-justify border-gray-300 rounded-b-lg p-3 min-h-[100px] ${
          isFocused
            ? "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            : ""
        }`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onInput={handleInput}
        suppressContentEditableWarning
      ></div>
    </div>
  );
}
export default RichTextEditor;
