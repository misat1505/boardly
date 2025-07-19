import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { useWhiteboardContext } from "@/context/WhiteboardContext";
import { Image as TImage } from "@/types/shapes";
import { copyToClipboard } from "@/utils/copyToClipboard";
import Image from "next/image";
import { ChangeEvent } from "react";
import { LuClipboardCopy } from "react-icons/lu";
import { toast } from "sonner";

const ImageSelection = ({ image }: { image: TImage }) => {
  const { setShapes } = useWhiteboardContext();

  const handleChange =
    (attr: "x" | "y" | "scale") => (e: ChangeEvent<HTMLInputElement>) => {
      const parsed = parseFloat(e.target.value);
      const value = isNaN(parsed) ? 0 : parsed;

      setShapes((prev) =>
        prev.map((s) => {
          if (s.id !== image.id || !(s instanceof TImage)) return s;
          return new TImage({
            ...s,
            [attr]: value,
          });
        })
      );
    };

  const handleCopyToClipboard = () => {
    copyToClipboard(image.imageUrl);
    toast("URL copied to clipboard!");
  };

  return (
    <div className="rounded-x p-4 w-full max-w-md space-y-4">
      <h2 className="text-lg font-semibold">Image Item</h2>

      <div className="text-sm">
        ID: <span className="font-mono text-muted-foreground">{image.id}</span>
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex items-center gap-x-4">
          <Image
            src={image.imageUrl}
            alt={image.id}
            width={250}
            height={250}
            className="mx-auto"
          />
          <div className="flex flex-col gap-y-2">
            <FloatingLabelInput
              id="x"
              label="X"
              value={image.x}
              type="number"
              onChange={handleChange("x")}
            />

            <FloatingLabelInput
              id="y"
              label="Y"
              value={image.y}
              type="number"
              onChange={handleChange("y")}
            />

            <FloatingLabelInput
              id="scale"
              label="Scale"
              value={image.scale}
              type="number"
              step={0.1}
              min={0.1}
              onChange={handleChange("scale")}
            />
          </div>
        </div>

        <div className="relative">
          <FloatingLabelInput
            id="url"
            label="URL"
            value={image.imageUrl}
            disabled
          />
          <Button
            variant="ghost"
            className="absolute top-1.75 bg-sidebar w-6 h-6 right-2 flex justify-center items-center hover:bg-sidebar dark:hover:bg-sidebar hover:cursor-pointer"
            title="Copy URL"
            onClick={handleCopyToClipboard}
          >
            <LuClipboardCopy />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageSelection;
