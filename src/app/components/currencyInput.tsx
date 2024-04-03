import React, { ForwardedRef, useCallback, useEffect, useRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const CurrencyInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref: ForwardedRef<HTMLInputElement>) => {
    // Create a local ref to store the actual input reference
    const localRef = useRef<HTMLInputElement | null>(null);

    // Combine the forwarded ref with the local ref
    const combinedRef = useCallback(
      (node: HTMLInputElement | null) => {
        localRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );
    const resizeInput = () => {
      const input = localRef?.current;
      if (!input) return;
      let textLength;
      if (input.value.length > 0) {
        textLength = input.value.length;
      } else {
        textLength = 0;
      }
      const minWidth = 1; // Minimum width in em

      // Calculate the width needed for the content
      const contentWidth = textLength * 0.7; // Adjust this value as needed

      // Set the input's width to the maximum of content width or minimum width
      input.style.width = `${Math.max(contentWidth, minWidth)}em`;
    };

    useEffect(() => {
      // Attach the event listener once the component mounts
      const inputElement = localRef.current;
      if (inputElement) {
        resizeInput();
        inputElement.addEventListener("input", resizeInput);
      }

      // Clean up the event listener on unmount
      return () => {
        if (inputElement) {
          inputElement.removeEventListener("input", resizeInput);
        }
      };
    }, []);
    return (
      <input
        ref={combinedRef}
        {...props}
        type="text"
        className="p-1 pl-2 pr-2 min-w-1 w-10 box-content text-4xl font-semibold outline-transparent focus:underline"
        placeholder="0"
        maxLength={6}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
export { CurrencyInput };
