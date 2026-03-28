import { Prisma } from "@/generated/prisma/client";

const getPostDataInclude = {
  user: {
    select: {
      username: true,
      displayUsername: true,
      image: true,
    },
  },
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: typeof getPostDataInclude;
}>;
