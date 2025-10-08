"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";
import { resizeImage } from "@/src/lib/resizeImage";
import { CroppedAreaPixels, getCroppedImg } from "@/src/lib/cropImage";
import Cropper from "react-easy-crop";

interface ChangeProfilePhotoDialogProps {
  currentPhoto: string | null;
  userId: string;
  onPhotoUpdated: (newUrl: string) => void;
}

export function ChangeProfilePhotoDialog({
  currentPhoto,
  onPhotoUpdated,
}: ChangeProfilePhotoDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);

  useEffect(() => {
    if (!selectedFile) return;
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    const resizedFile = await resizeImage(file, 512, 512, "image/png");

    setSelectedFile(resizedFile);
    setPreviewUrl(URL.createObjectURL(resizedFile));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      let fileToUpload: File = selectedFile;

      if (croppedAreaPixels && previewUrl) {
        const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);
        if (croppedBlob) {
          fileToUpload = new File([croppedBlob], "profile.png", {
            type: "image/png",
          });
        }
      }

      const formData = new FormData();
      formData.append("file", fileToUpload);

      const token = (await supabase.auth.getSession()).data.session
        ?.access_token;
      if (!token) return toast.error("Usuário não autenticado");

      const res = await fetch(
        "https://qjpnvzrmiibksdvxmzop.supabase.co/functions/v1/updateProfilePhoto",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro");

      const updatedUrl = `${data.url}?t=${Date.now()}`;
      onPhotoUpdated(updatedUrl);
      toast.success("Foto de perfil atualizada!");

      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar foto";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 text-white bg-[#010b62] dark:bg-[#01BAEF] rounded-md hover:bg-[#1C2CA3] dark:hover:bg-[#33C9F2] end-10 ml-auto cursor-pointer">
          Alterar foto
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Alterar foto de perfil</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div className="w-64 h-64 relative bg-gray-200 flex items-center justify-center">
            {selectedFile && previewUrl ? (
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedAreaPixels) =>
                  setCroppedAreaPixels(croppedAreaPixels)
                }
              />
            ) : currentPhoto ? (
              <Image
                src={currentPhoto}
                alt="Foto atual"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-500 text-sm">Sem foto</span>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="profile-photo-input"
          />

          <Button
            onClick={() =>
              document.getElementById("profile-photo-input")?.click()
            }
            disabled={uploading}
            className="bg-green-500 hover:bg-green-600"
          >
            Procurar...
          </Button>

          <DialogFooter>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-[#010b62] dark:bg-[#01BAEF] hover:bg-[#1C2CA3] dark:hover:bg-[#33C9F2]"
            >
              {uploading ? "Atualizando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
