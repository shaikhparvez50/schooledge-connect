import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, FileText, Film, Image, Globe, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const PublicCourses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    // Load all public courses
    const publicCourses = localStorage.getItem("publicCourses");
    const parsedCourses = publicCourses ? JSON.parse(publicCourses) : [];
    setAllCourses(parsedCourses);
    setFilteredCourses(parsedCourses);
  }, []);

  useEffect(() => {
    // Filter courses based on search term and active tab
    let results = allCourses;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by type if not "all"
    if (activeTab !== "all") {
      results = results.filter(course => {
        // Check if any file in the course matches the selected type
        return course.files.some(file => {
          const fileType = file.type.split('/')[0];
          if (activeTab === "videos" && fileType === "video") return true;
          if (activeTab === "documents" && (fileType === "text" || file.type.includes("pdf") || file.type.includes("document"))) return true;
          if (activeTab === "images" && fileType === "image") return true;
          return false;
        });
      });
    }
    
    setFilteredCourses(results);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, activeTab, allCourses]);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const getFileIcon = (fileType) => {
    if (fileType.includes("video")) return <Film className="h-10 w-10 text-white" />;
    if (fileType.includes("image")) return <Image className="h-10 w-10 text-white" />;
    return <FileText className="h-10 w-10 text-white" />;
  };

  const getRandomThumbnail = (index) => {
    const images = [
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
      "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa",
      "https://images.unsplash.com/photo-1491841651911-c44c30c34548",
      "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3",
      "https://images.unsplash.com/photo-1588580000645-f29d597b4be0"
    ];
    return images[index % images.length];
  };

  return (
    <div className="container mx-auto max-w-6xl py-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Public Courses</h1>
      </div>

      <div className="flex items-center mb-6 space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses by title, description or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => navigate("/upload-courses")}>
          Upload New Course
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <div className="flex items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Materials</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          {currentItems.length === 0 ? (
            <div className="text-center p-8">
              <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">No courses found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try a different search term or filter" : "Be the first to upload a course!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((course, index) => {
                // Determine thumbnail and primary file type
                const mainFileType = course.files[0]?.type || "document";
                const thumbnail = course.files.find(f => f.type.includes("image"))?.url || getRandomThumbnail(index);
                
                return (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div 
                      className="h-40 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${thumbnail})` }}
                    >
                      <div className="h-full w-full bg-black/30 flex items-center justify-center">
                        {getFileIcon(mainFileType)}
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">By {course.author || "Anonymous"}</p>
                      {course.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{course.description}</p>
                      )}
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{course.files.length} file(s)</span>
                        <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink 
                      isActive={currentPage === index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </TabsContent>
        
        {/* Other tabs content - They will trigger the filter in useEffect */}
        <TabsContent value="videos" className="mt-0">
          {/* Content will be filtered based on the activeTab state */}
        </TabsContent>
        
        <TabsContent value="documents" className="mt-0">
          {/* Content will be filtered based on the activeTab state */}
        </TabsContent>
        
        <TabsContent value="images" className="mt-0">
          {/* Content will be filtered based on the activeTab state */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PublicCourses;
