
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search, Mail, Eye, MessageCircle, Check, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define MessageStatus type
type MessageStatus = 'read' | 'unread';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: MessageStatus;
  replied: boolean;
}

// Mock data for contact messages
const mockMessages: ContactMessage[] = [
  {
    id: 'msg-1234',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    subject: 'Question about organic certification',
    message: "I'm interested in learning more about your organic certification process. Can you provide more information about how you verify products are truly organic?",
    date: '2023-05-07T14:30:00Z',
    status: 'unread',
    replied: false
  },
  {
    id: 'msg-1235',
    name: 'John Doe',
    email: 'john.doe@example.com',
    subject: 'Damaged product in my order',
    message: "I recently received my order #ORD-1235, and unfortunately one of the items was damaged during shipping. The glass jar of honey was cracked. Could I get a replacement?",
    date: '2023-05-06T10:15:00Z',
    status: 'read',
    replied: false
  },
  {
    id: 'msg-1236',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    subject: 'Bulk order inquiry',
    message: "I'm planning an event and would like to place a bulk order of your organic fruit baskets. Do you offer any discounts for large orders? I would need about 50 baskets.",
    date: '2023-05-05T16:45:00Z',
    status: 'read',
    replied: true
  },
  {
    id: 'msg-1237',
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    subject: 'Newsletter subscription issue',
    message: "I've tried subscribing to your newsletter multiple times, but I'm not receiving any confirmation emails. Can you check if there's an issue with my subscription?",
    date: '2023-05-04T09:20:00Z',
    status: 'unread',
    replied: false
  },
  {
    id: 'msg-1238',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    subject: 'Product suggestion',
    message: "I love your store and products! I was wondering if you've considered adding organic pet food to your inventory? I think it would be a great addition to your product line.",
    date: '2023-05-03T11:10:00Z',
    status: 'read',
    replied: true
  }
];

const ContactResponses: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>(mockMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  
  // Filter messages based on search term and status
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'replied' && message.replied) ||
      (statusFilter === 'unreplied' && !message.replied) ||
      message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Mark message as read
  const markAsRead = (id: string) => {
    const updatedMessages = messages.map(message => {
      if (message.id === id) {
        return { ...message, status: 'read' as MessageStatus };
      }
      return message;
    });
    setMessages(updatedMessages);
    
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({
        ...selectedMessage,
        status: 'read'
      });
    }
  };
  
  // View message details
  const viewMessageDetails = (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplyText('');
    
    // Mark message as read when viewed
    if (message.status === 'unread') {
      markAsRead(message.id);
    }
  };
  
  // Handle sending a reply
  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    const updatedMessages = messages.map(message => {
      if (message.id === selectedMessage.id) {
        return { ...message, replied: true };
      }
      return message;
    });
    
    setMessages(updatedMessages);
    setSelectedMessage({
      ...selectedMessage,
      replied: true
    });
    
    // In a real app, you would send the email here
    alert(`Reply sent to ${selectedMessage.email}`);
    setReplyText('');
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-heading">Contact Form Responses</h2>
        <p className="text-muted-foreground">Manage and respond to customer inquiries</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 lg:w-3/5">
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="unreplied">Unreplied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableCaption>
                {`${filteredMessages.length} messages`}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      No messages found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMessages.map((message) => (
                    <TableRow key={message.id} className={message.status === 'unread' ? 'bg-blue-50' : ''}>
                      <TableCell>
                        {message.status === 'unread' ? (
                          <Badge className="bg-blue-500">Unread</Badge>
                        ) : message.replied ? (
                          <Badge className="bg-green-500">Replied</Badge>
                        ) : (
                          <Badge variant="outline">Read</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className={message.status === 'unread' ? 'font-medium' : ''}>
                            {message.name}
                          </div>
                          <div className="text-sm text-gray-500">{message.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className={message.status === 'unread' ? 'font-medium' : ''}>
                        {message.subject}
                      </TableCell>
                      <TableCell>
                        {new Date(message.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => viewMessageDetails(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 lg:w-2/5">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedMessage.subject}</CardTitle>
                    <CardDescription>
                      From {selectedMessage.name} ({selectedMessage.email})
                    </CardDescription>
                  </div>
                  {selectedMessage.replied && (
                    <Badge className="bg-green-500">Replied</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Received on {formatDate(selectedMessage.date)}
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    {selectedMessage.message}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="mb-2 flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    <h4 className="font-medium">Reply to this message</h4>
                  </div>
                  <Textarea
                    placeholder="Write your response here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[150px] mb-4"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setReplyText('')}>
                      <X className="h-4 w-4 mr-2" /> Clear
                    </Button>
                    <Button 
                      onClick={handleSendReply} 
                      disabled={!replyText.trim()}
                      className="bg-leaf-600 hover:bg-leaf-700"
                    >
                      <Mail className="h-4 w-4 mr-2" /> Send Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Message Details</CardTitle>
                <CardDescription>
                  Select a message to view details
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center p-10 text-gray-500">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No message selected</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactResponses;
