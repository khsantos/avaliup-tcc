export async function resizeImage(
  file: File,
  maxWidth = 512,
  maxHeight = 512,
  outputType: string = "image/png"
): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      let { width, height } = img;

      const aspectRatio = width / height;
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas não suportado"));

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Erro ao gerar blob"));
          const extension = outputType.split("/")[1] || "png";
          const resizedFile = new File([blob], `resized.${extension}`, { type: outputType });
          resolve(resizedFile);
        },
        outputType,
        0.9
      );
    };

    img.onerror = (err) => reject(err);
  });
}
