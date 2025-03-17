
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Send, 
  Plus, 
  User,
  MoreVertical,
  Image,
  Paperclip,
  Smile
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserData } from "@/lib/user-utils";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  status?: "online" | "offline";
  lastSeen?: string;
}

const Messages = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  const currentUserId = userData?.id || "user-123";
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "contact-1", name: "Emma Wilson", status: "online" },
    { id: "contact-2", name: "James Miller", status: "offline", lastSeen: "2 hours ago" },
    { id: "contact-3", name: "Sophia Davis", status: "online" },
    { id: "contact-4", name: "Liam Johnson", status: "offline", lastSeen: "1 day ago" },
    { id: "contact-5", name: "Olivia Smith", status: "online" },
  ]);
  
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("messages");
    return saved ? JSON.parse(saved) : [
      { 
        id: "msg-1", 
        senderId: "contact-1", 
        receiverId: currentUserId, 
        content: "Hi there! How are you doing today?", 
        timestamp: Date.now() - 3600000, 
        read: true 
      },
      { 
        id: "msg-2", 
        senderId: currentUserId, 
        receiverId: "contact-1", 
        content: "I'm doing great! Just working on some school assignments.", 
        timestamp: Date.now() - 3500000, 
        read: true 
      },
      { 
        id: "msg-3", 
        senderId: "contact-1", 
        receiverId: currentUserId, 
        content: "That's good to hear. Need any help with them?", 
        timestamp: Date.now() - 3400000, 
        read: true 
      },
      { 
        id: "msg-4", 
        senderId: currentUserId, 
        receiverId: "contact-1", 
        content: "Maybe later, I'm still figuring things out. Thanks for offering!", 
        timestamp: Date.now() - 3300000, 
        read: true 
      },
      { 
        id: "msg-5", 
        senderId: "contact-1", 
        receiverId: currentUserId, 
        content: "No problem! Let me know if you need anything.", 
        timestamp: Date.now() - 3200000, 
        read: false 
      }
    ];
  });
  
  const [selectedContact, setSelectedContact] = useState<Contact | null>(contacts[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);
  
  useEffect(() => {
    // Scroll to the bottom when messages change
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedContact]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      receiverId: selectedContact.id,
      content: newMessage,
      timestamp: Date.now(),
      read: false
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
  };
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getContactMessages = (contactId: string) => {
    return messages.filter(
      msg => (msg.senderId === contactId && msg.receiverId === currentUserId) || 
             (msg.senderId === currentUserId && msg.receiverId === contactId)
    ).sort((a, b) => a.timestamp - b.timestamp);
  };
  
  const formatMessageTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="container mx-auto max-w-6xl py-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>
      
      <Card className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-200px)]">
        {/* Contacts Sidebar */}
        <div className="border-r border-border">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search contacts..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-65px)]">
            {filteredContacts.map(contact => (
              <div 
                key={contact.id}
                className={`
                  flex items-center gap-3 p-4 cursor-pointer hover:bg-accent
                  ${selectedContact?.id === contact.id ? 'bg-accent' : ''}
                `}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <span 
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background
                      ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}
                    `}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium truncate">{contact.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {/* Show time of the last message if any */}
                      {getContactMessages(contact.id).length > 0 && 
                        formatMessageTime(getContactMessages(contact.id).slice(-1)[0].timestamp)
                      }
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {getContactMessages(contact.id).length > 0 
                      ? getContactMessages(contact.id).slice(-1)[0].content
                      : contact.status === 'online' ? 'Online' : `Last seen ${contact.lastSeen}`
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Message Content */}
        <div className="col-span-2 flex flex-col h-full">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedContact.avatar} />
                    <AvatarFallback>{selectedContact.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedContact.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedContact.status === 'online' 
                        ? 'Online' 
                        : `Last seen ${selectedContact.lastSeen}`
                      }
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {getContactMessages(selectedContact.id).map(message => {
                  const isSender = message.senderId === currentUserId;
                  return (
                    <div 
                      key={message.id} 
                      className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`
                          max-w-[70%] p-3 rounded-lg break-words
                          ${isSender 
                            ? 'bg-primary text-primary-foreground rounded-br-none' 
                            : 'bg-accent rounded-bl-none'
                          }
                        `}
                      >
                        <p>{message.content}</p>
                        <div 
                          className={`
                            text-xs mt-1 flex justify-end
                            ${isSender ? 'text-primary-foreground/70' : 'text-muted-foreground'}
                          `}
                        >
                          {formatMessageTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messageEndRef} />
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Plus className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Image className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input 
                    placeholder="Type a message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button onClick={handleSendMessage} className="flex-shrink-0">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <User className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No contact selected</h3>
              <p className="text-muted-foreground">Choose a contact to start chatting</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Messages;
