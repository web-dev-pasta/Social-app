import "react-advanced-cropper/dist/style.css";
import { useRef } from "react";
import {
  CircleStencil,
  Cropper,
  type CropperRef,
} from "react-advanced-cropper";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
interface CropImageDialogProps {
  src: string;
  cropAspectRatio: number;
  onCropped: (blob: Blob | null) => void;
  onClose: () => void;
}

export default function CropImageDialog({
  src,
  cropAspectRatio,
  onCropped,
  onClose,
}: CropImageDialogProps) {
  const cropperRef = useRef<CropperRef>(null);

  function crop() {
    const cropper = cropperRef.current;
    if (!cropper) return;

    const canvas = cropper.getCanvas();
    if (!canvas) return;

    canvas.toBlob((blob: Blob | null) => {
      onCropped(blob);
    }, "image/webp");

    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop image</DialogTitle>
        </DialogHeader>

        <Cropper
          src={src}
          stencilProps={{
            aspectRatio: cropAspectRatio,
          }}
          stencilComponent={CircleStencil}
          ref={cropperRef}
          className="w-full"
        />

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={crop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
