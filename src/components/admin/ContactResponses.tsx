
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
import { Search, Mail, Eye, MessageCircle, Check, X, RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContactMessages, ContactMessage, MessageStatus } from '@/hooks/useContactMessages';

const ContactResponses: React.FC = () => {
  const { 
    messages, 
    loading, 
    error, 
    markAsRead, 
    sendReply, 
    formatDate, 
    refreshMessages 
  } = useContactMessages();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    setIsSubmitting(true);
    const success = await sendReply(selectedMessage.id, replyText);
    
    if (success) {
      // Update the selected message in state
      setSelectedMessage({
        ...selectedMessage,
        replied: true,
        status: 'read'
      });
      setReplyText('');
    }
    
    setIsSubmitting(false);
  };
  
  // Refresh messages
  const handleRefresh = () => {
    refreshMessages();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">Contact Form Responses</h2>
          <p className="text-muted-foreground">Manage and respond to customer inquiries</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
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
                {loading ? 'Loading messages...' : `${filteredMessages.length} messages`}
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-leaf-600 mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ) : filteredMessages.length === 0 ? (
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
                        {formatDate(message.date)}
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
                    disabled={isSubmitting || selectedMessage.replied}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setReplyText('')}
                      disabled={isSubmitting || selectedMessage.replied}
                    >
                      <X className="h-4 w-4 mr-2" /> Clear
                    </Button>
                    <Button 
                      onClick={handleSendReply} 
                      disabled={!replyText.trim() || isSubmitting || selectedMessage.replied}
                      className="bg-leaf-600 hover:bg-leaf-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div> Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" /> Send Reply
                        </>
                      )}
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
      
      {error && (
        <Card className="bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContactResponses;
