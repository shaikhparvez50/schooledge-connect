
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileText, Film, Image, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getUserData } from "@/lib/user-utils";

const Courses = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  const [activeTab, setActiveTab] = useState("all");
  const [uploadType, setUploadType] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Mock course data
  const [courses, setCourses] = useState([
    {
      id: "course-1",
      title: "Introduction to Mathematics",
      instructor: "Dr. Sarah Johnson",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
      type: "video",
      date: "2023-05-15",
    },
    {
      id: "course-2",
      title: "Advanced Physics Concepts",
      instructor: "Prof. Michael Chen",
      thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa",
      type: "document",
      date: "2023-06-22",
    },
    {
      id: "course-3",
      title: "Literature Analysis Techniques",
      instructor: "Dr. Emily Brooks",
      thumbnail: "https://images.unsplash.com/photo-1491841651911-c44c30c34548",
      type: "image",
      date: "2023-07-10",
    },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    // Add new course to the list
    const newCourse = {
      id: `course-${courses.length + 1}`,
      title,
      instructor: userData?.name || "Anonymous User",
      thumbnail: URL.createObjectURL(selectedFile),
      type: uploadType === "video" ? "video" : uploadType === "document" ? "document" : "image",
      date: new Date().toISOString().split("T")[0],
    };

    setCourses([newCourse, ...courses]);
    
    // Reset form
    setTitle("");
    setDescription("");
    setSelectedFile(null);
    setUploadType(null);
    
    toast.success("Course material uploaded successfully!");
  };

  return (
    <div className="container mx-auto max-w-6xl py-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Course Materials</h1>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Materials</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>
          <Button onClick={() => setUploadType("video")} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Upload New
          </Button>
        </div>

        {uploadType && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upload New Material</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <Button 
                    variant={uploadType === "video" ? "default" : "outline"} 
                    onClick={() => setUploadType("video")}
                    className="flex-col py-4 h-auto"
                  >
                    <Film className="h-10 w-10 mb-2" />
                    <span>Video</span>
                  </Button>
                  <Button 
                    variant={uploadType === "document" ? "default" : "outline"} 
                    onClick={() => setUploadType("document")}
                    className="flex-col py-4 h-auto"
                  >
                    <FileText className="h-10 w-10 mb-2" />
                    <span>Document</span>
                  </Button>
                  <Button 
                    variant={uploadType === "image" ? "default" : "outline"} 
                    onClick={() => setUploadType("image")}
                    className="flex-col py-4 h-auto"
                  >
                    <Image className="h-10 w-10 mb-2" />
                    <span>Image</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter material title" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter material description" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <Input 
                    id="file" 
                    type="file" 
                    onChange={handleFileChange}
                    accept={
                      uploadType === "video" ? "video/*" : 
                      uploadType === "document" ? ".pdf,.doc,.docx,.ppt,.pptx" : 
                      "image/*"
                    }
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setUploadType(null)}>Cancel</Button>
                  <Button onClick={handleUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div 
                  className="h-40 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${course.thumbnail})` }}
                >
                  <div className="h-full w-full bg-black/30 flex items-center justify-center">
                    {course.type === "video" && <Film className="h-10 w-10 text-white" />}
                    {course.type === "document" && <FileText className="h-10 w-10 text-white" />}
                    {course.type === "image" && <Image className="h-10 w-10 text-white" />}
                  </div>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">By {course.instructor}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{course.type.charAt(0).toUpperCase() + course.type.slice(1)}</span>
                    <span>{course.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="videos" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.filter(c => c.type === "video").map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Same card content as "all" tab */}
                <div 
                  className="h-40 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${course.thumbnail})` }}
                >
                  <div className="h-full w-full bg-black/30 flex items-center justify-center">
                    <Film className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">By {course.instructor}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Video</span>
                    <span>{course.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.filter(c => c.type === "document").map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Same card content structure */}
                <div 
                  className="h-40 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${course.thumbnail})` }}
                >
                  <div className="h-full w-full bg-black/30 flex items-center justify-center">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">By {course.instructor}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Document</span>
                    <span>{course.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="images" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.filter(c => c.type === "image").map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Same card content structure */}
                <div 
                  className="h-40 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${course.thumbnail})` }}
                >
                  <div className="h-full w-full bg-black/30 flex items-center justify-center">
                    <Image className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">By {course.instructor}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Image</span>
                    <span>{course.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Courses;
