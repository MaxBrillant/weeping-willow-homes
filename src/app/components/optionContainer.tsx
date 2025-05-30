import { Dispatch, ReactNode, SetStateAction, useState } from "react";

type containerProps = {
  options: Array<string> | Array<number> | Array<ReactNode>;
  multipleSelectionEnabled: boolean;
  selectedOptions: Array<number>;
  setSelectedOptions: Dispatch<SetStateAction<number[]>>;
  minSelections?: number;
};
export default function OptionContainer(container: containerProps) {
  const [selectedOptions, setSelectedOptions] = useState(
    container.selectedOptions
  );
  return (
    <div className="flex flex-row flex-wrap gap-2 py-3">
      {container.options.map((option, index) =>
        selectedOptions.includes(index) ? (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              if (
                (container.minSelections != undefined &&
                  selectedOptions.length > container.minSelections) ||
                container.minSelections == undefined
              ) {
                setSelectedOptions((currentlySelectedOptions) =>
                  currentlySelectedOptions.filter(
                    (selectedOption) => selectedOption !== index
                  )
                );
                container.setSelectedOptions((currentlySelectedOptions) =>
                  currentlySelectedOptions.filter(
                    (selectedOption) => selectedOption !== index
                  )
                );
              }
            }}
            className="py-1 px-2 min-w-10 min-h-10 h-fit bg-gray-300 font-medium border border-black rounded-lg"
          >
            <p>{option}</p>
          </button>
        ) : (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault(); //don't touch, it's very useful in forms
              if (!container.multipleSelectionEnabled) {
                setSelectedOptions([]);
                container.setSelectedOptions([]);
              }
              setSelectedOptions((currentlySelectedOptions) =>
                [...currentlySelectedOptions, index].sort((a, b) => a - b)
              );
              container.setSelectedOptions((currentlySelectedOptions) =>
                [...currentlySelectedOptions, index].sort((a, b) => a - b)
              );
            }}
            className="py-1 px-2 min-w-10 min-h-10 h-fit border border-slate-400 rounded-lg"
          >
            <p>{option}</p>
          </button>
        )
      )}
    </div>
  );
}
