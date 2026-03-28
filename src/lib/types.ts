import { Prisma } from "@/generated/prisma/client";

export const userDataSelect = {
  id: true,
  username: true,
  displayUsername: true,
  image: true,
} satisfies Prisma.UserSelect;

const getPostDataInclude = {
  user: {
    select: userDataSelect,
  },
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: typeof getPostDataInclude;
}>;
