
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Notes = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [savedNotes, setSavedNotes] = useState(() => {
    const saved = localStorage.getItem("studentNotes");
    return saved ? JSON.parse(saved) : [];
  });
  
  const handleSaveNote = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please add both title and content to your note");
      return;
    }
    
    const newNote = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date().toISOString()
    };
    
    const updatedNotes = [...savedNotes, newNote];
    setSavedNotes(updatedNotes);
    localStorage.setItem("studentNotes", JSON.stringify(updatedNotes));
    
    toast.success("Note saved successfully!");
    setTitle("");
    setContent("");
  };
  
  const handleDeleteNote = (id) => {
    const updatedNotes = savedNotes.filter(note => note.id !== id);
    setSavedNotes(updatedNotes);
    localStorage.setItem("studentNotes", JSON.stringify(updatedNotes));
    toast.success("Note deleted");
  };
  
  return (
    <div className="container mx-auto max-w-6xl py-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Student Notes</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Create New Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter note title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  placeholder="Write your notes here..."
                  className="min-h-[200px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNote}>
                <Save className="h-4 w-4 mr-2" />
                Save Note
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Saved Notes</h2>
          {savedNotes.length === 0 ? (
            <Card className="p-4 bg-white dark:bg-gray-800">
              <p className="text-muted-foreground text-center">No saved notes yet</p>
            </Card>
          ) : (
            savedNotes.map((note) => (
              <Card key={note.id} className="p-4 bg-white dark:bg-gray-800">
                <div className="flex justify-between">
                  <h3 className="font-medium truncate">{note.title}</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{note.content}</p>
                <div className="text-xs text-muted-foreground mt-2">
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
