import React, { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MoreHorizontal, 
  UserIcon,
  ShieldCheck, 
  Lock, 
  Ban, 
  Mail, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

// Define types
type UserRole = 'admin' | 'customer' | 'manager';
type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending' | 'admin';
type ActivityType = 'login' | 'order' | 'account_update' | 'support';

interface UserActivity {
  type: ActivityType;
  date: string;
  details: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  joinDate: string;
  orders: number;
  totalSpent: number;
  activity: UserActivity[];
}

// Mock data for users
const mockUsers: User[] = [
  {
    id: "USR-1001",
    email: "sarah.johnson@example.com",
    name: "Sarah Johnson",
    role: "customer",
    status: "active",
    lastLogin: "2023-05-07T09:10:00Z",
    joinDate: "2022-02-15T14:22:00Z",
    orders: 12,
    totalSpent: 587.43,
    activity: [
      {
        type: "login",
        date: "2023-05-07T09:10:00Z",
        details: "Logged in from Safari on macOS"
      },
      {
        type: "order",
        date: "2023-05-07T09:15:00Z",
        details: "Placed order #ORD-5592 ($78.95)"
      },
      {
        type: "account_update",
        date: "2023-04-22T16:40:00Z",
        details: "Updated shipping address"
      }
    ]
  },
  {
    id: "USR-1002",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    status: "active",
    lastLogin: "2023-05-07T08:30:00Z",
    joinDate: "2021-11-10T09:00:00Z",
    orders: 0,
    totalSpent: 0,
    activity: [
      {
        type: "login",
        date: "2023-05-07T08:30:00Z",
        details: "Logged in from Chrome on Windows"
      },
      {
        type: "account_update",
        date: "2023-05-02T14:20:00Z",
        details: "Changed password"
      },
      {
        type: "login",
        date: "2023-05-02T14:15:00Z",
        details: "Logged in from Chrome on Windows"
      }
    ]
  },
  {
    id: "USR-1003",
    email: "michael.chang@example.com",
    name: "Michael Chang",
    role: "customer",
    status: "active",
    lastLogin: "2023-05-06T15:20:00Z",
    joinDate: "2022-06-23T11:15:00Z",
    orders: 8,
    totalSpent: 423.12,
    activity: [
      {
        type: "login",
        date: "2023-05-06T15:20:00Z",
        details: "Logged in from Firefox on Android"
      },
      {
        type: "order",
        date: "2023-05-06T15:22:00Z",
        details: "Placed order #ORD-5591 ($126.45)"
      }
    ]
  },
  {
    id: "USR-1004",
    email: "jessica.brown@example.com",
    name: "Jessica Brown",
    role: "customer",
    status: "suspended",
    lastLogin: "2023-05-03T09:25:00Z",
    joinDate: "2022-04-05T16:35:00Z",
    orders: 15,
    totalSpent: 892.67,
    activity: [
      {
        type: "login",
        date: "2023-05-03T09:25:00Z",
        details: "Logged in from Chrome on iPhone"
      },
      {
        type: "order",
        date: "2023-05-03T09:30:00Z",
        details: "Placed order #ORD-5588 ($45.67)"
      },
      {
        type: "support",
        date: "2023-05-03T14:22:00Z",
        details: "Initiated refund request for order #ORD-5588"
      }
    ]
  },
  {
    id: "USR-1005",
    email: "david.manager@example.com",
    name: "David Manager",
    role: "manager",
    status: "active",
    lastLogin: "2023-05-07T07:45:00Z",
    joinDate: "2022-01-10T10:00:00Z",
    orders: 0,
    totalSpent: 0,
    activity: [
      {
        type: "login",
        date: "2023-05-07T07:45:00Z",
        details: "Logged in from Chrome on Windows"
      },
      {
        type: "account_update",
        date: "2023-05-01T11:10:00Z",
        details: "Updated profile information"
      }
    ]
  }
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewingActivity, setViewingActivity] = useState(false);
  
  // Filter users based on search term, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Update user status
  const updateUserStatus = (userId: string, newStatus: UserStatus) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, status: newStatus };
      }
      return user;
    });
    
    setUsers(updatedUsers);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Format date with time for display
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Get status badge color
  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'suspended': return 'bg-red-500';
      case 'pending': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get role badge color
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-purple-500';
      case 'manager': return 'bg-blue-500';
      case 'customer': return 'bg-leaf-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get activity icon
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'login': return <UserIcon className="h-4 w-4" />;
      case 'order': return <ShoppingCart className="h-4 w-4" />;
      case 'account_update': return <CheckCircle className="h-4 w-4" />;
      case 'support': return <Mail className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-heading">User Management</h2>
        <p className="text-muted-foreground">Manage and monitor user accounts</p>
      </div>
      
      <div className="rounded-md border">
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="p-2">
            <TabsTrigger value="users" className="focus:shadow-none">
              Users
            </TabsTrigger>
            <TabsTrigger value="activity" disabled className="focus:shadow-none">
              Activity Logs (Coming Soon)
            </TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  className="pl-10"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-40">
                <select
                  className="w-full h-10 border rounded-md px-3 text-sm"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div className="w-full md:w-40">
                <select
                  className="w-full h-10 border rounded-md px-3 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>
                  {`${filteredUsers.length} users`}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <UserIcon className="h-4 w-4 text-gray-500" />
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className={getRoleColor(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className={getStatusColor(user.status)}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDateTime(user.lastLogin)}</TableCell>
                        <TableCell>{formatDate(user.joinDate)}</TableCell>
                        <TableCell>{user.orders}</TableCell>
                        <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status !== 'active' && (
                                <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'active')}>
                                  <ShieldCheck className="mr-2 h-4 w-4" />
                                  <span>Activate User</span>
                                </DropdownMenuItem>
                              )}
                              {user.status !== 'suspended' && (
                                <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'suspended')}>
                                  <Lock className="mr-2 h-4 w-4" />
                                  <span>Suspend User</span>
                                </DropdownMenuItem>
                              )}
                              {user.status !== 'inactive' && (
                                <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'inactive')}>
                                  <Ban className="mr-2 h-4 w-4" />
                                  <span>Deactivate User</span>
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
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={selectedUser !== null} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View detailed information about the selected user.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Name</div>
                    <div>{selectedUser.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Email</div>
                    <div>{selectedUser.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Role</div>
                    <div>
                      <Badge variant="default" className={getRoleColor(selectedUser.role)}>
                        {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Status</div>
                    <div>
                      <Badge variant="default" className={getStatusColor(selectedUser.status)}>
                        {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Join Date</div>
                    <div>{formatDate(selectedUser.joinDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Last Login</div>
                    <div>{formatDateTime(selectedUser.lastLogin)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Total Orders</div>
                    <div>{selectedUser.orders}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Total Spent</div>
                    <div>${selectedUser.totalSpent.toFixed(2)}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>User Activity</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setViewingActivity(!viewingActivity)}>
                      {viewingActivity ? 'Hide Activity' : 'View All Activity'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedUser.activity.slice(0, viewingActivity ? selectedUser.activity.length : 3).map((activity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {getActivityIcon(activity.type)}
                        <div>
                          <div className="text-sm">{activity.details}</div>
                          <div className="text-xs text-gray-500">{formatDateTime(activity.date)}</div>
                        </div>
                      </div>
                    ))}
                    {selectedUser.activity.length === 0 && (
                      <div className="text-center text-gray-500">No activity found</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add missing ShoppingCart icon
const ShoppingCart = (props: React.SVGProps<SVGSVGElement>) => {
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
      <circle cx="8" cy="21" r="1"></circle>
      <circle cx="19" cy="21" r="1"></circle>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
    </svg>
  );
};

export default UserManagement;
