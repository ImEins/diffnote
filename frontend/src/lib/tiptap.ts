import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import { History } from "@tiptap/extension-history";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";

export const BlankTemplate = {
  title: "",
  content: { type: "doc", content: [] },
};

export const Extensions = [
  Document,
  Paragraph,
  Text,
  History,
  TextStyle,
  ListItem,
  Bold,
  Italic,
  Strike,
  Code,
  Heading.configure({
    levels: [1, 2, 3],
    HTMLAttributes: ({ level }: { level: number }) => {
      return {
        class:
          level === 1
            ? "text-3xl font-bold mt-6 mb-4"
            : level === 2
              ? "text-2xl font-bold mt-5 mb-3"
              : "text-xl font-bold mt-4 mb-2",
      };
    },
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: "list-disc ml-4",
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: "list-decimal ml-4",
    },
  }),
  Placeholder.configure({
    placeholder: "Write something...",
  }),
];

