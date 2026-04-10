import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "256KB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const session = await getServerSession();

      if (!session || !session.user) throw new UploadThingError("Unauthorized");

      return session.user;
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.image;

      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split("/f/")[1];
        await new UTApi().deleteFiles(key);
      }
      await prisma.user.update({
        where: {
          id: metadata.id,
        },
        data: {
          image: file.ufsUrl,
        },
      });
      return {
        image: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
