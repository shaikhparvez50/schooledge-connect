
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Film, FileText, Image, Save, X, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getUserData } from "@/lib/user-utils";
import { getCourseNotes, saveCourseNote, updateCourseNote, deleteCourseNote } from "@/lib/db-utils";

interface CourseNote {
  id: string;
  courseId: string;
  userId: string;
  title?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: {
    id: string;
    title: string;
    instructor: string;
    thumbnail: string;
    type: string;
    date: string;
    description?: string;
  } | null;
}

const CourseDetailModal = ({ open, onOpenChange, course }: CourseDetailModalProps) => {
  const [notes, setNotes] = useState<CourseNote[]>([]);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const userData = getUserData();

  useEffect(() => {
    if (open && course) {
      loadNotes();
    }
  }, [open, course]);

  const loadNotes = async () => {
    if (!course) return;
    
    const response = await getCourseNotes(course.id);
    if (response.notes) {
      setNotes(response.notes);
    }
  };

  const handleSaveNote = async () => {
    if (!course || !userData) return;
    
    if (!newNoteContent.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }
    
    const response = await saveCourseNote({
      courseId: course.id,
      userId: userData.id,
      title: newNoteTitle,
      content: newNoteContent
    });
    
    if (response.success) {
      toast.success("Note saved successfully");
      setNewNoteContent("");
      setNewNoteTitle("");
      loadNotes();
    } else {
      toast.error("Failed to save note");
    }
  };

  const handleEditNote = (note: CourseNote) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const handleUpdateNote = async () => {
    if (!editingNoteId) return;
    
    if (!editContent.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }
    
    const response = await updateCourseNote(editingNoteId, editContent);
    
    if (response.success) {
      toast.success("Note updated successfully");
      setEditingNoteId(null);
      setEditContent("");
      loadNotes();
    } else {
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const response = await deleteCourseNote(noteId);
    
    if (response.success) {
      toast.success("Note deleted successfully");
      loadNotes();
    } else {
      toast.error("Failed to delete note");
    }
  };

  if (!course) return null;

  const TypeIcon = () => {
    if (course.type === "video") return <Film className="h-6 w-6" />;
    if (course.type === "document") return <FileText className="h-6 w-6" />;
    return <Image className="h-6 w-6" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TypeIcon />
            {course.title}
          </DialogTitle>
          <DialogDescription>
            Instructor: {course.instructor} • Published: {course.date}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div 
              className="h-48 bg-cover bg-center rounded-md mb-4" 
              style={{ backgroundImage: `url(${course.thumbnail})` }}
            />
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Course Details</h3>
              <p className="text-sm text-muted-foreground">
                {course.description || "No description available for this course."}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Your Notes
            </h3>

            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="noteTitle">Note Title (Optional)</Label>
                <Input
                  id="noteTitle"
                  placeholder="Enter a title for your note"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="noteContent">Note Content</Label>
                <Textarea
                  id="noteContent"
                  placeholder="Write your notes about this course here..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              
              <Button onClick={handleSaveNote} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Note
              </Button>
            </div>

            <div className="space-y-3 mt-6">
              <h4 className="font-medium">Saved Notes</h4>
              
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No notes yet. Add your first note above!</p>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {notes.map((note) => (
                    <div key={note.id} className="border rounded-md p-3">
                      {editingNoteId === note.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditingNoteId(null)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={handleUpdateNote}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Update
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {note.title && (
                            <h5 className="font-medium mb-1">{note.title}</h5>
                          )}
                          <p className="text-sm whitespace-pre-wrap mb-2">{note.content}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Updated: {formatDate(note.updatedAt)}</span>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditNote(note)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDetailModal;
