
import React, { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Loader2, Mail, Calendar, Users, Plus, Edit, Play, Pause, Eye, Clock, ArrowUpRight, MoreVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define types
type CampaignStatus = 'active' | 'paused' | 'draft' | 'scheduled';
type CampaignType = 'automated' | 'newsletter' | 'one-time';

interface Email {
  id: string;
  subject: string;
  body: string;
  delay: number;
  openRate: string;
  clickRate: string;
}

interface CampaignRecipients {
  type: 'segment' | 'all' | 'behavior';
  segmentName: string;
  count: number | string;
}

interface CampaignPerformance {
  sent: number;
  opened: number;
  clicked: number;
  openRate: string;
  clickRate: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  type: CampaignType;
  trigger: string;
  recipients: CampaignRecipients;
  performance: CampaignPerformance;
  lastSent: string | null;
  emails: Email[];
}

interface SuggestedCampaign {
  title: string;
  description: string;
  target: string;
  icon: React.ReactNode;
  benefits: string;
}

interface Segment {
  id: string;
  name: string;
  count: number;
}

// Mock data for campaigns
const mockCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Welcome Series',
    description: 'Automated welcome emails for new customers',
    status: 'active',
    type: 'automated',
    trigger: 'New signup',
    recipients: {
      type: 'segment',
      segmentName: 'New Customers',
      count: 89
    },
    performance: {
      sent: 78,
      opened: 62,
      clicked: 45,
      openRate: '79.5%',
      clickRate: '57.7%',
    },
    lastSent: '2023-05-07T10:30:00Z',
    emails: [
      {
        id: 'email-1',
        subject: 'Welcome to OrganicGrocer! 🌱',
        body: 'Thank you for joining our community of health-conscious shoppers...',
        delay: 0, // immediate
        openRate: '82%',
        clickRate: '63%'
      },
      {
        id: 'email-2',
        subject: 'Here are some products we think you\'ll love',
        body: 'Based on your preferences, we thought you might enjoy these organic options...',
        delay: 3, // 3 days after signup
        openRate: '76%',
        clickRate: '51%'
      }
    ]
  },
  {
    id: 'camp-2',
    name: 'May Newsletter',
    description: 'Monthly newsletter with seasonal products and recipes',
    status: 'scheduled',
    type: 'newsletter',
    trigger: 'Scheduled for May 10',
    recipients: {
      type: 'all',
      segmentName: 'All Subscribers',
      count: 824
    },
    performance: {
      sent: 0,
      opened: 0,
      clicked: 0,
      openRate: '-',
      clickRate: '-',
    },
    lastSent: null,
    emails: [
      {
        id: 'email-3',
        subject: 'May Newsletter: Spring into Organic Eating! 🌸',
        body: 'This month\'s featured products, seasonal recipes, and gardening tips...',
        delay: 0,
        openRate: '-',
        clickRate: '-'
      }
    ]
  },
  {
    id: 'camp-3',
    name: 'Abandoned Cart',
    description: 'Remind customers about items left in their cart',
    status: 'active',
    type: 'automated',
    trigger: 'Cart abandoned',
    recipients: {
      type: 'behavior',
      segmentName: 'Abandoned Cart',
      count: 'Dynamic'
    },
    performance: {
      sent: 156,
      opened: 112,
      clicked: 87,
      openRate: '71.8%',
      clickRate: '55.8%',
    },
    lastSent: '2023-05-07T15:45:00Z',
    emails: [
      {
        id: 'email-4',
        subject: 'You left something in your cart!',
        body: 'We noticed you left some items in your shopping cart. They\'re still waiting for you...',
        delay: 1, // 1 day after abandonment
        openRate: '74%',
        clickRate: '59%'
      }
    ]
  },
  {
    id: 'camp-4',
    name: 'Re-engagement',
    description: 'Win back inactive customers',
    status: 'paused',
    type: 'automated',
    trigger: 'Inactivity (60 days)',
    recipients: {
      type: 'segment',
      segmentName: 'At Risk',
      count: 53
    },
    performance: {
      sent: 42,
      opened: 18,
      clicked: 11,
      openRate: '42.9%',
      clickRate: '26.2%',
    },
    lastSent: '2023-05-05T09:15:00Z',
    emails: [
      {
        id: 'email-5',
        subject: 'We miss you! Come back and save 10%',
        body: 'It\'s been a while since your last order. We\'d love to see you again...',
        delay: 0,
        openRate: '43%',
        clickRate: '26%'
      }
    ]
  },
  {
    id: 'camp-5',
    name: 'Special Offer: Summer Sale',
    description: 'Promotion for seasonal products',
    status: 'draft',
    type: 'one-time',
    trigger: 'Manual send',
    recipients: {
      type: 'segment',
      segmentName: 'Regular Shoppers',
      count: 347
    },
    performance: {
      sent: 0,
      opened: 0,
      clicked: 0,
      openRate: '-',
      clickRate: '-',
    },
    lastSent: null,
    emails: [
      {
        id: 'email-6',
        subject: 'Summer Sale! Up to 30% off select organic products',
        body: 'Beat the heat with our refreshing summer deals...',
        delay: 0,
        openRate: '-',
        clickRate: '-'
      }
    ]
  }
];

// Mock data for segments to use in campaign targeting
const mockSegments: Segment[] = [
  { id: 'seg-1', name: 'VIP Customers', count: 124 },
  { id: 'seg-2', name: 'Regular Shoppers', count: 347 },
  { id: 'seg-3', name: 'New Customers', count: 89 },
  { id: 'seg-4', name: 'At Risk', count: 53 },
  { id: 'seg-5', name: 'All Subscribers', count: 824 },
];

// Mock data for suggested campaigns
const suggestedCampaigns: SuggestedCampaign[] = [
  {
    title: 'Loyalty Rewards',
    description: 'Reward your top customers with exclusive offers and early access',
    target: 'VIP Customers',
    icon: <Users className="h-8 w-8 text-leaf-600" />,
    benefits: 'Increase retention and customer lifetime value for your best customers'
  },
  {
    title: 'Seasonal Product Highlights',
    description: 'Showcase what\'s fresh and in season this month',
    target: 'All Subscribers',
    icon: <Calendar className="h-8 w-8 text-leaf-600" />,
    benefits: 'Drive sales of seasonal products and highlight special offers'
  },
  {
    title: 'First Purchase Anniversary',
    description: 'Celebrate customer anniversaries with a special thank-you',
    target: 'Customers with 1+ year history',
    icon: <Gift className="h-8 w-8 text-leaf-600" />,
    benefits: 'Strengthen brand loyalty and encourage repeat purchases'
  }
];

// Create a Gift icon component
function Gift(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="8" width="18" height="4" rx="1"></rect>
      <path d="M12 8v13"></path>
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path>
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>
    </svg>
  );
}

const EmailAutomation: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [segments] = useState<Segment[]>(mockSegments);
  const [campaignFormOpen, setCampaignFormOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isViewingCampaign, setIsViewingCampaign] = useState(false);
  
  // Handle campaign status change
  const toggleCampaignStatus = (campaignId: string) => {
    const updatedCampaigns = campaigns.map(campaign => {
      if (campaign.id === campaignId) {
        const newStatus = campaign.status === 'active' ? 'paused' : 'active';
        return { ...campaign, status: newStatus as CampaignStatus };
      }
      return campaign;
    });
    setCampaigns(updatedCampaigns);
  };
  
  // View campaign details
  const viewCampaignDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsViewingCampaign(true);
  };
  
  // Get status badge color
  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      case 'scheduled': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not sent yet';
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-heading">Email Automation</h2>
        <p className="text-muted-foreground">Create and manage marketing email campaigns</p>
      </div>
      
      <div className="flex justify-end">
        <Dialog open={campaignFormOpen} onOpenChange={setCampaignFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-leaf-600 hover:bg-leaf-700">
              <Plus className="mr-2 h-4 w-4" /> Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a new email campaign to engage with your customers.
              </DialogDescription>
            </DialogHeader>
            
            {/* Campaign creation form would go here */}
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="campaign-name" className="text-sm font-medium">Campaign Name</label>
                <Input id="campaign-name" placeholder="e.g., Summer Sale Promotion" />
              </div>
              <div className="space-y-2">
                <label htmlFor="campaign-description" className="text-sm font-medium">Description</label>
                <Textarea id="campaign-description" placeholder="Brief description of this campaign's purpose" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="border rounded-md p-3 hover:border-leaf-600 cursor-pointer">
                    <Mail className="h-5 w-5 mb-2 text-leaf-600" />
                    <h4 className="font-medium">One-time</h4>
                    <p className="text-xs text-gray-500">Send a single email</p>
                  </div>
                  <div className="border rounded-md p-3 hover:border-leaf-600 cursor-pointer">
                    <Calendar className="h-5 w-5 mb-2 text-leaf-600" />
                    <h4 className="font-medium">Newsletter</h4>
                    <p className="text-xs text-gray-500">Regular scheduled emails</p>
                  </div>
                  <div className="border rounded-md p-3 hover:border-leaf-600 cursor-pointer">
                    <Play className="h-5 w-5 mb-2 text-leaf-600" />
                    <h4 className="font-medium">Automated</h4>
                    <p className="text-xs text-gray-500">Triggered by events</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <div className="border rounded-md p-3">
                  <div className="mb-2">Choose segments to target:</div>
                  <div className="space-y-2">
                    {segments.map(segment => (
                      <div key={segment.id} className="flex items-center space-x-2">
                        <Checkbox id={`segment-${segment.id}`} />
                        <label 
                          htmlFor={`segment-${segment.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {segment.name} ({segment.count})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email-subject" className="text-sm font-medium">Email Subject</label>
                <Input id="email-subject" placeholder="Enter an attention-grabbing subject line" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email-content" className="text-sm font-medium">Email Content</label>
                <Textarea id="email-content" placeholder="Write your email content here..." className="min-h-[150px]" />
                <p className="text-xs text-gray-500">
                  In a real application, this would be a rich text editor for creating HTML emails.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setCampaignFormOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-leaf-600 hover:bg-leaf-700">
                Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableCaption>
            Your email campaigns
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Last Sent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No campaigns found
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <div 
                        className="font-medium hover:underline cursor-pointer"
                        onClick={() => viewCampaignDetails(campaign)}
                      >
                        {campaign.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {campaign.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {campaign.type === 'automated' && <Play className="h-3 w-3 mr-1" />}
                      {campaign.type === 'newsletter' && <Calendar className="h-3 w-3 mr-1" />}
                      {campaign.type === 'one-time' && <Mail className="h-3 w-3 mr-1" />}
                      {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{campaign.recipients.segmentName}</div>
                      <div className="text-xs text-gray-500">
                        {typeof campaign.recipients.count === 'number' 
                          ? `${campaign.recipients.count} recipients`
                          : campaign.recipients.count}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {campaign.performance.sent > 0 ? (
                      <div className="text-xs">
                        <div>Open rate: {campaign.performance.openRate}</div>
                        <div>Click rate: {campaign.performance.clickRate}</div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">No data yet</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm flex items-center">
                      {campaign.lastSent ? (
                        <>
                          <Clock className="h-3 w-3 mr-1 text-gray-400" />
                          {new Date(campaign.lastSent).toLocaleDateString()}
                        </>
                      ) : (
                        <span className="text-gray-500">Not sent yet</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewCampaignDetails(campaign)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {(campaign.status === 'active' || campaign.status === 'paused') && (
                          <DropdownMenuItem onClick={() => toggleCampaignStatus(campaign.id)}>
                            {campaign.status === 'active' ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                <span>Activate</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 font-heading">Suggested Campaigns</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestedCampaigns.map((campaign, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  {campaign.icon}
                  <Badge variant="outline">Suggestion</Badge>
                </div>
                <CardTitle className="mt-3">{campaign.title}</CardTitle>
                <CardDescription>{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium">Target Segment:</span> {campaign.target}
                  </div>
                  <div>
                    <span className="font-medium">Benefits:</span> {campaign.benefits}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Create This Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Dialog open={isViewingCampaign} onOpenChange={setIsViewingCampaign}>
        {selectedCampaign && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{selectedCampaign.name}</DialogTitle>
                <Badge className={getStatusColor(selectedCampaign.status)}>
                  {selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                </Badge>
              </div>
              <DialogDescription>{selectedCampaign.description}</DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Type</div>
                <div className="flex items-center">
                  {selectedCampaign.type === 'automated' && <Play className="h-4 w-4 mr-1 text-leaf-600" />}
                  {selectedCampaign.type === 'newsletter' && <Calendar className="h-4 w-4 mr-1 text-leaf-600" />}
                  {selectedCampaign.type === 'one-time' && <Mail className="h-4 w-4 mr-1 text-leaf-600" />}
                  {selectedCampaign.type.charAt(0).toUpperCase() + selectedCampaign.type.slice(1)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Trigger</div>
                <div>{selectedCampaign.trigger}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Recipients</div>
                <div>
                  {selectedCampaign.recipients.segmentName} 
                  ({typeof selectedCampaign.recipients.count === 'number' 
                    ? `${selectedCampaign.recipients.count} recipients`
                    : selectedCampaign.recipients.count})
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Last Sent</div>
                <div>{formatDate(selectedCampaign.lastSent)}</div>
              </div>
            </div>
            
            {selectedCampaign.performance.sent > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-muted rounded-md">
                      <div className="text-xl font-bold">{selectedCampaign.performance.sent}</div>
                      <div className="text-sm text-muted-foreground">Emails Sent</div>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <div className="text-xl font-bold">{selectedCampaign.performance.openRate}</div>
                      <div className="text-sm text-muted-foreground">Open Rate</div>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <div className="text-xl font-bold">{selectedCampaign.performance.clickRate}</div>
                      <div className="text-sm text-muted-foreground">Click Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div>
              <h4 className="text-lg font-semibold mb-3">Email Content</h4>
              {selectedCampaign.emails.map((email, index) => (
                <Card key={email.id} className="mb-3">
                  <CardHeader className="py-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Email {index + 1}: {email.subject}</CardTitle>
                      {email.delay > 0 && (
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Delay: {email.delay} day{email.delay > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="py-3">
                    <div className="border p-3 rounded-md bg-gray-50 text-sm">
                      {email.body}
                    </div>
                    {email.openRate !== '-' && (
                      <div className="flex justify-between mt-3 text-xs text-gray-600">
                        <span>Open rate: {email.openRate}</span>
                        <span>Click rate: {email.clickRate}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewingCampaign(false)}>
                Close
              </Button>
              <Button className="bg-leaf-600 hover:bg-leaf-700">
                <Edit className="mr-2 h-4 w-4" /> Edit Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default EmailAutomation;
