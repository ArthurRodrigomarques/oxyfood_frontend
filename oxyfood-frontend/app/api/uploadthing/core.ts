import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload completo para userId:", metadata);
    console.log("URL do arquivo:", file.ufsUrl);

    return { uploadedBy: "user" };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
