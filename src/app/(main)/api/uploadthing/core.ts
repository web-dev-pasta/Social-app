import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { MetadataBoundary } from "next/dist/lib/framework/boundary-components";
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
      await Promise.all([
        prisma.user.update({
          where: { id: metadata.id },
          data: {
            image: file.ufsUrl,
          },
        }),
        streamServerClient.partialUpdateUser({
          id: metadata.id,
          set: {
            image: file.ufsUrl,
          },
        }),
      ]);
      return {
        image: file.ufsUrl,
      };
    }),
  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const session = await getServerSession();

      if (!session || !session.user) throw new UploadThingError("Unauthorized");

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const media = await prisma.media.create({
        data: {
          url: file.ufsUrl,
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      });

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
