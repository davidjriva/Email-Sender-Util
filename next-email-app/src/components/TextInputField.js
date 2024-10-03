// Import React dependencies.
import React, { useState } from "react";
// Import the Slate editor factory.
import { createEditor } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

const TextInputField = () => {
  const [editor] = useState(() => withReact(createEditor()));
  return (
    // Add the editable component inside the context.
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        style={{
          height: "200px", // Increase the height
          padding: "10px", // Add padding for better spacing
          border: "1px solid #ccc", // Optional: Add border to the text area
          borderRadius: "4px", // Optional: Round the corners
          fontSize: "16px", // Optional: Increase font size for better readability
        }}
        // Define a new handler which prints the key that was pressed.
        onKeyDown={(event) => {
          if (event.key === "&") {
            // Prevent the ampersand character from being inserted.
            event.preventDefault();
            // Execute the `insertText` method when the event occurs.
            editor.insertText("and");
          }
        }}
      />
    </Slate>
  );
};

export default TextInputField;
