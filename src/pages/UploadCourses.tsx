
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileText, Image, File, X, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { createCourse, getUserCourses, type Course } from "@/lib/supabase-utils";

const UploadCourses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  
  // Load user's courses when component mounts
  useEffect(() => {
    if (user) {
      getUserCourses(user.id).then(courses => {
        setUserCourses(courses);
      });
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles([...files, ...selectedFiles]);
  };
  
  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };
  
  const getFileIcon = (file: File) => {
    const fileType = file.type.split('/')[0];
    switch (fileType) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };
  
  const handleUpload = async () => {
    if (!user) {
      toast.error("You must be logged in to upload courses");
      return;
    }

    if (!title.trim()) {
      toast.error("Please add a title for your upload");
      return;
    }
    
    if (files.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }
    
    setUploading(true);
    
    try {
      // Get user profile for author name
      const userEmail = user.email || 'Anonymous';
      
      const courseData = {
        title,
        description,
        author: userEmail,
        author_id: user.id,
        file_count: files.length,
        file_types: files.map(file => file.type)
      };
      
      const newCourse = await createCourse(courseData);
      
      toast.success("Course uploaded successfully! Your course is now publicly available.");
      
      // Reset form
      setTitle("");
      setDescription("");
      setFiles([]);
      
      // Refresh user courses
      const updatedCourses = await getUserCourses(user.id);
      setUserCourses(updatedCourses);
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("There was an error uploading your course. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-6xl py-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Upload Course Materials</h1>
        <Button variant="outline" onClick={() => navigate("/public-courses")}>
          View Public Courses
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Materials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                <Globe className="h-4 w-4" />
                <span>All uploaded courses are public and visible to everyone</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter a title for these materials" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe what these materials are for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="files">Upload Files</Label>
                <Input 
                  id="files" 
                  type="file" 
                  multiple
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Selected Files:</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center gap-2">
                            {getFileIcon(file)}
                            <span className="text-sm truncate max-w-xs">{file.name}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleUpload} 
                disabled={uploading || !user}
                className="w-full md:w-auto"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Materials
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Recent Uploads</h2>
          {userCourses.length === 0 ? (
            <Card className="p-4">
              <p className="text-muted-foreground text-center">No uploaded materials yet</p>
            </Card>
          ) : (
            userCourses.slice(0, 5).map((course) => (
              <Card key={course.id} className="p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium truncate">{course.title}</h3>
                {course.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                )}
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">
                    {course.file_count} file(s) • {new Date(course.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadCourses;
