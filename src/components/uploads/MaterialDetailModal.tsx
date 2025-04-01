
import React from "react";
import { X, FileText, Image, File } from "lucide-react";
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

interface MaterialDetailModalProps {
  material: {
    id: number;
    title: string;
    description?: string;
    files: Array<{
      name: string;
      size: number;
      type: string;
      url: string;
    }>;
    createdAt: string;
    author: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const MaterialDetailModal = ({ material, isOpen, onClose }: MaterialDetailModalProps) => {
  if (!material) return null;

  const getFileIcon = (fileType: string) => {
    const type = fileType.split('/')[0];
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{material.title}</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Uploaded by {material.author} • {formatDistanceToNow(new Date(material.createdAt))} ago
          </DialogDescription>
        </DialogHeader>

        {material.description && (
          <div className="mt-2">
            <h3 className="text-sm font-medium mb-1">Description</h3>
            <p className="text-sm text-muted-foreground">{material.description}</p>
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Files</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {material.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.type)}
                  <span className="text-sm truncate max-w-xs">{file.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialDetailModal;
