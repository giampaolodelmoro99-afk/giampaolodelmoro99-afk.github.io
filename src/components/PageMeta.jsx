import { useEffect } from "react";
import { useLocation } from "react-router";

const siteUrl = "https://gianpaolodelmoro.it";

function setDescription(content) {
  let tag = document.head.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "description");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(href) {
  let tag = document.head.querySelector('link[rel="canonical"]');
  if (href === null) {
    if (tag) tag.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

export default function PageMeta({ title, description, canonical }) {
  const { pathname } = useLocation();
  const canonicalPath = canonical === undefined ? pathname : canonical;

  useEffect(() => {
    document.title = title;
    setDescription(description);
    setCanonical(canonicalPath === null ? null : siteUrl + canonicalPath);
  }, [title, description, canonicalPath]);

  return null;
}
