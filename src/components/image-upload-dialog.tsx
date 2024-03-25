import React, { ChangeEvent, useEffect, useState } from "react";
import Cropper, { Area, CropperProps } from "react-easy-crop";

import { getOrientation } from "get-orientation/browser";
import { getCroppedImg, getRotatedImage } from "@/lib/canvasUtils";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

const ORIENTATION_TO_ANGLE: Record<string, number> = {
  "3": 180,
  "6": 90,
  "8": -90,
};

interface IProps extends Partial<CropperProps> {
  open: boolean;
  setOpen: any;
  oldAvatarUrl: string;
  onSaveImage: any;
}

const ImageUploadDialog = ({
  open,
  onSaveImage,
  oldAvatarUrl,
  setOpen,
  ...props
}: IProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  useEffect(() => {
    setImageSrc(oldAvatarUrl);
  }, [oldAvatarUrl]);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      setIsLoading(true);
      const croppedImage = await getCroppedImg(
        imageSrc as string,
        croppedAreaPixels as HTMLImageElement,
        rotation
      );

      onSaveImage(croppedImage).then(() => {
        setIsLoading(false);
      });
    } catch (e) {
      console.error(e);
    }
  };

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (file) {
        if (file.size / 1024 / 1024 > 2) {
          setError("File size too big (max 2MB)");
          return;
        } else if (file.type !== "image/png" && file.type !== "image/jpeg") {
          setError("File type not supported (.png or .jpg only)");
          return;
        }
      }

      let imageDataUrl: string = (await readFile(file)) as string;

      try {
        // apply rotation if needed
        const orientation = await getOrientation(file);
        const rotation = ORIENTATION_TO_ANGLE[orientation];
        if (rotation) {
          imageDataUrl = (await getRotatedImage(
            imageDataUrl,
            rotation
          )) as string;
        }
      } catch (e) {
        console.warn("failed to detect the orientation");
      }

      setImageSrc(imageDataUrl);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Update Image
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Select or Update Image
            </DialogDescription>
          </DialogHeader>

          {imageSrc ? (
            <>
              <div className="h-[400px]">
                <div className="h-2/3">
                  <Cropper
                    classes={{
                      containerClassName: "!relative h-full",
                    }}
                    image={imageSrc}
                    crop={crop}
                    rotation={rotation}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    {...props}
                  />
                </div>
                <div className="space-y-4 mt-4 h-1/3">
                  <div className="mx-auto w-[60%] space-y-2">
                    <h1>Zoom</h1>
                    <Slider
                      defaultValue={[1]}
                      min={1}
                      max={10}
                      step={0.1}
                      className={cn("w-full")}
                      onValueChange={(value) => {
                        setZoom(value[0]);
                      }}
                    />
                  </div>
                  <div className="mx-auto w-[60%] space-y-2">
                    <h1>Rotation</h1>
                    <Slider
                      defaultValue={[0]}
                      max={360}
                      step={0.5}
                      className={cn("w-full")}
                      onValueChange={(value) => setRotation(value[0])}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="sm:justify-start mt-6">
                <Button
                  onClick={showCroppedImage}
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Update
                </Button>
                <Button
                  onClick={() => setImageSrc(null)}
                  variant="outline"
                  color="primary"
                >
                  Delete
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div>
              <Input
                type="file"
                onChange={onFileChange}
                accept="image/*"
                className="cursor-pointer"
              />

              <h2 className="text-red-600 text-sm ml-2 mt-2">{error}</h2>
            </div>
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
};

function readFile(file: File) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export default ImageUploadDialog;
