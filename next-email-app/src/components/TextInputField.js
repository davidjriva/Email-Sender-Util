// Import React dependencies.
import React, { useState, useCallback } from "react";
// Import the Slate editor factory.
import { createEditor, Editor, Transforms, Element } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

const TextInputField = ({ text, setText }) => {
  const [editor] = useState(() => withReact(createEditor()));

  console.log(text);
  return (
    // Add the editable component inside the context.
    <Slate
      editor={editor}
      initialValue={initialValue}
      value={text}
      onChange={(value) => {
        setText(value);
      }}
    >
      <Editable
        style={{
          height: "200px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "16px",
          color: "black",
        }}
      />
    </Slate>
  );
};

export default TextInputField;
