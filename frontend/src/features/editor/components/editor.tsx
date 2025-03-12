import { Button } from "@/components/ui/button";
import { EditorContent, Editor as TiptapEditor } from "@tiptap/react";
import { History, Save } from "lucide-react";
import { Menu } from "./menu";

interface TipTapEditorProps {
  editor: TiptapEditor | null;
  title: string;
  onTitleChange?: (title: string) => void;
  isSaving: boolean;
  lastSaved: Date | null;
}

export function Editor({
  editor,
  title,
  onTitleChange,
  isSaving = false,
  lastSaved,
}: TipTapEditorProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center">
        <Menu editor={editor} />

        <div className="flex items-center gap-x-4">
          <Button
            variant="ghost"
            size="icon"
            title="Commit version"
            className="hover:bg-primary/5"
          >
            <History className="size-4" />
          </Button>
          <Button
            variant="default"
            className="text-xs"
            size="sm"
            title="Save version"
          >
            <Save className="size-4" />
            Save version
          </Button>

          {isSaving ? (
            <div className="text-sm text-muted-foreground">Saving...</div>
          ) : lastSaved ? (
            <div className="text-sm text-muted-foreground">
              Last saved {lastSaved.toLocaleTimeString()}
            </div>
          ) : null}
        </div>
      </div>
      <div className="max-w-3xl w-full mx-auto">
        <div className="relative">
          <input
            value={title}
            onChange={(e) => {
              onTitleChange?.(e.target.value);
            }}
            className="outline-none text-4xl font-bold py-6 mb-2 min-h-[60px] w-full"
            placeholder="Untitled"
            autoFocus={title === ""}
          />
        </div>

        <div className="relative">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
