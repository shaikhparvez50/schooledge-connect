
import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface NoteDetailModalProps {
  note: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const NoteDetailModal = ({ note, isOpen, onClose }: NoteDetailModalProps) => {
  if (!note) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{note.title}</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Created {formatDistanceToNow(new Date(note.createdAt))} ago
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="rounded-md bg-muted p-4">
            <pre className="whitespace-pre-wrap text-sm">{note.content}</pre>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDetailModal;
