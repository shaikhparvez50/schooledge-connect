
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileText, Image, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const UploadCourses = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadedMaterials, setUploadedMaterials] = useState(() => {
    const saved = localStorage.getItem("uploadedMaterials");
    return saved ? JSON.parse(saved) : [];
  });
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };
  
  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };
  
  const getFileIcon = (file) => {
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
  
  const handleUpload = () => {
    if (!title.trim()) {
      toast.error("Please add a title for your upload");
      return;
    }
    
    if (files.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }
    
    // In a real app, we would upload the files to a server
    // Here we'll just simulate it by saving metadata
    const fileInfo = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file) // This creates a temporary URL for preview
    }));
    
    const newMaterial = {
      id: Date.now(),
      title,
      description,
      files: fileInfo,
      createdAt: new Date().toISOString()
    };
    
    const updatedMaterials = [...uploadedMaterials, newMaterial];
    setUploadedMaterials(updatedMaterials);
    localStorage.setItem("uploadedMaterials", JSON.stringify(updatedMaterials));
    
    toast.success("Materials uploaded successfully!");
    setTitle("");
    setDescription("");
    setFiles([]);
  };
  
  return (
    <div className="container mx-auto max-w-6xl py-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Upload Course Materials</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Materials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <Button onClick={handleUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Materials
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recently Uploaded</h2>
          {uploadedMaterials.length === 0 ? (
            <Card className="p-4">
              <p className="text-muted-foreground text-center">No uploaded materials yet</p>
            </Card>
          ) : (
            uploadedMaterials.slice(0, 5).map((material) => (
              <Card key={material.id} className="p-4">
                <h3 className="font-medium truncate">{material.title}</h3>
                {material.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{material.description}</p>
                )}
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">
                    {material.files.length} file(s) • {new Date(material.createdAt).toLocaleDateString()}
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
