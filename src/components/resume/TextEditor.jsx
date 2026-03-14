import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Bold, Italic, Underline, List, Link, Undo, Redo } from "lucide-react";
import { Button } from "@/components/ui/button";

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

      <div className="flex flex-wrap gap-0.5 p-1.5 bg-[#fff7ed] border border-[#fde3c8] border-b-0 rounded-t-[var(--radius)]">
        <Button type="button" variant={active.bold ? "secondary" : "ghost"} size="icon-sm" onClick={() => formatText("bold")} title="Bold (Ctrl+B)">
          <Bold size={14} />
        </Button>
        <Button type="button" variant={active.italic ? "secondary" : "ghost"} size="icon-sm" onClick={() => formatText("italic")} title="Italic (Ctrl+I)">
          <Italic size={14} />
        </Button>
        <Button type="button" variant={active.underline ? "secondary" : "ghost"} size="icon-sm" onClick={() => formatText("underline")} title="Underline (Ctrl+U)">
          <Underline size={14} />
        </Button>
        <div className="w-px bg-[#fde3c8] mx-0.5 self-stretch"></div>
        <Button type="button" variant={active.ul ? "secondary" : "ghost"} size="icon-sm" onClick={() => formatText("insertUnorderedList")} title="Bullet List">
          <List size={14} />
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" onClick={() => insertLink()} title="Insert Link">
          <Link size={14} />
        </Button>
        <div className="w-px bg-[#fde3c8] mx-0.5 self-stretch"></div>
        <Button type="button" variant="ghost" size="icon-sm" onClick={() => formatText("undo")} title="Undo (Ctrl+Z)">
          <Undo size={14} />
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" onClick={() => formatText("redo")} title="Redo (Ctrl+Y)">
          <Redo size={14} />
        </Button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className={`editor border text-justify border-[#fde3c8] rounded-b-[var(--radius)] p-3 min-h-[100px] outline-none transition-[border-color,box-shadow] ${isFocused ? "border-[#f97316] ring-2 ring-[#f97316]/20" : ""}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onInput={handleInput}
        suppressContentEditableWarning
      ></div>
    </div>
  );
}
export default RichTextEditor;
