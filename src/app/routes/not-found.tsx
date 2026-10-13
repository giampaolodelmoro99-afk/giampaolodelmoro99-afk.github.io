import { NotFound } from "../../features/not-found/NotFound";
import { getDictionary } from "../../i18n";
import type { Route } from "./+types/not-found";

export const meta: Route.MetaFunction = () => {
  const t = getDictionary("it");
  return [
    { title: t.notFound.title },
    { name: "description", content: t.notFound.description },
    { name: "robots", content: "noindex" },
  ];
};

export default function NotFoundRoute() {
  return <NotFound />;
}
