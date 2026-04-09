import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await getServerSession();

      // If you throw, the user will not be able to upload
      if (!session || !session.user) throw new UploadThingError("Unauthorized");

      return session.user;
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const newImageUrl = file.url.replace(
        "/f/",
        `/${process.env.UPLOADTHING_APP_ID}/`,
      );
      await prisma.user.update({
        where: {
          id: metadata.id,
        },
        data: {
          image: newImageUrl,
        },
      });
      return {
        image: newImageUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
