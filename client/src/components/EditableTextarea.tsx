import { useState } from "react";
import { Button } from "./ui/button";
import { useUpdateCardBodyMutation } from "@/features/api/board-api";
import { LoaderCircle } from "lucide-react";

export default function EditableTextarea({
  cardId,
  body,
}: {
  cardId: string;
  body: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [bodyValue, setBodyValue] = useState<string>(body);
  const [updateCardBody, { isLoading, isSuccess }] = useUpdateCardBodyMutation();

  const handleSave = () => {
    console.log("in handleSave")
    if (bodyValue === body) {
      console.log("please update before saving");
      return;
    }
    try {
      // try optimisitc update
      updateCardBody({
        cardId,
        bodyValue,
      }).unwrap();
      setIsFocused(false);
    } catch {
      return
    }
  };

  return (
    <div>
      <textarea
        name="text"
        defaultValue={body}
        onChange={(event) => {
          setBodyValue(event.target.value);
        }}
        className="resize-none w-full h-fit m-0"
        onClick={() => setIsFocused(true)}
        disabled={isLoading}
      />
      <div className="flex justify-start mt-1 gap-2">
        {isFocused && (
          <>
            <Button className="flex h-7 text-xs font-normal w-1/5" onClick={() => setIsFocused(false)}>X</Button>
            <Button
              className="flex flex-auto h-7 text-xs font-normal"
              variant="default"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading && <LoaderCircle className="animate-spin" />}
              {isSuccess ? "Saved" : "Save"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
