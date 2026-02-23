// import React from "react";
// import {
//     Bold,
//     Italic,
//     Underline,
//     List,
//     Link,
//     Undo,
//     Redo
// } from "lucide-react";

// function Toolbar({ editorRef }) {
//   const applyFormat = (command) => {
//     const editor = editorRef.current;
//     if (editor) {
//       editor.focus();
//       document.execCommand(command, false, null);
//     }
//   };

//     const insertLink = () => {
//     const url = prompt("Enter the URL");
//     if (url) {
//       const editor = editorRef.current;
//       if (editor) {
//         editor.focus();
//         document.execCommand("createLink", false, url);
//       }
//     }
//   };

//   return (
//     <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border border-gray-300 rounded-t-lg">
//       <button
//         onClick={() => applyFormat("bold")}
//         className="p-2 hover:bg-gray-200 rounded transition-colors"
//         title="Bold (Ctrl+B)"
//       >
//         <Bold size={18} />
//       </button>
//       <button
//         onClick={() => applyFormat("italic")}
//         className="p-2 hover:bg-gray-200 rounded transition-colors"
//         title="Italic (Ctrl+I)"
//       >
//         <Italic size={18} />
//       </button>
//       <button
//         onClick={() => applyFormat("underline")}
//         className="p-2 hover:bg-gray-200 rounded transition-colors"
//         title="Underline (Ctrl+U)"
//       >
//         <Underline size={18} />
//       </button>
//       <div className="w-px bg-gray-300 mx-1"></div>
//       <button
//         onClick={() => applyFormat("insertUnorderedList")}
//         className="p-2 hover:bg-gray-200 rounded transition-colors"
//         title="Bullet List"
//       >
//         <List size={18} />
//       </button>
//       <button
//         onClick={() => insertLink()}
//         className="p-2 hover:bg-gray-200 rounded transition-colors"
//         title="Insert Link"
//       >
//         <Link size={18} />
//       </button>
//       <div className="w-px bg-gray-300 mx-1"></div>
//       <button
//         onClick={() => applyFormat("undo")}
//         className="p-2 hover:bg-gray-200 rounded transition-colors"
//         title="Undo (Ctrl+Z)"
//       >
//         <Undo size={18} />
//       </button>
//       <button
//         onClick={() => applyFormat("redo")}
//         className="p-2 hover:bg-gray-200 rounded transition-colors"
//         title="Redo (Ctrl+Y)"
//       >
//         <Redo size={18} />
//       </button>
//     </div>
//   );
// }
// export default Toolbar;

import React, { useRef } from "react";

export function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  const formatText = (command) => {
    editorRef.current.focus();
    document.execCommand(command, false, null);
  };

  const handleInput = () => {
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="editor-container">
      <div className="toolbar">
        <button onClick={() => formatText("bold")}>B</button>
        <button onClick={() => formatText("italic")}>I</button>
        <button onClick={() => formatText("underline")}>U</button>
        <button onClick={() => formatText("insertUnorderedList")}>• List</button>
      </div>
      

      <div
        ref={editorRef}
        contentEditable
        className="editor"
        onInput={handleInput}
        suppressContentEditableWarning
      ></div>
    </div>
  );
}
