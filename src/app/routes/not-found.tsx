import type { MetaDescriptor } from "react-router";
import { NotFound } from "../../features/not-found/NotFound";
import { getDictionary } from "../../i18n";

export function meta(): MetaDescriptor[] {
  const t = getDictionary("it");
  return [
    { title: t.notFound.title },
    { name: "description", content: t.notFound.description },
    { name: "robots", content: "noindex" },
  ];
}

export default function NotFoundRoute() {
  return <NotFound />;
}
