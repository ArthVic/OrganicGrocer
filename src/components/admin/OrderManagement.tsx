import React, { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, MoreHorizontal, Download, Printer, Clipboard, TruckIcon, Search, ChevronDown, Check, X } from 'lucide-react';

// Define types
type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderShipping {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  tracking: string;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  shipping: OrderShipping;
}

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: "ORD-5592",
    customer: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    date: "2023-05-07T09:15:00Z",
    status: "processing",
    total: 78.95,
    items: [
      { name: "Organic Avocados (4 pack)", quantity: 1, price: 6.99 },
      { name: "Grass-fed Ground Beef (1 lb)", quantity: 2, price: 12.99 },
      { name: "Organic Spinach Bundle", quantity: 1, price: 4.99 },
      { name: "Farm Fresh Eggs (12 count)", quantity: 1, price: 5.99 },
      { name: "Organic Almond Butter", quantity: 1, price: 8.99 },
      { name: "Wildflower Honey (16 oz)", quantity: 1, price: 12.99 }
    ],
    shipping: {
      address: "123 Main Street",
      city: "Portland",
      state: "OR",
      zip: "97201",
      country: "USA",
      tracking: ""
    }
  },
  {
    id: "ORD-5591",
    customer: "Michael Chang",
    email: "michael.chang@example.com",
    date: "2023-05-06T15:22:00Z",
    status: "shipped",
    total: 126.45,
    items: [
      { name: "Organic Mixed Berry Box", quantity: 2, price: 24.99 },
      { name: "Wild Caught Salmon Fillets", quantity: 1, price: 18.99 },
      { name: "Organic Quinoa (2 lb bag)", quantity: 1, price: 9.99 },
      { name: "Cold-Pressed Olive Oil", quantity: 1, price: 15.99 },
      { name: "Assorted Organic Teas", quantity: 2, price: 12.99 }
    ],
    shipping: {
      address: "456 Park Avenue",
      city: "New York",
      state: "NY",
      zip: "10022",
      country: "USA",
      tracking: "UPS9834564829"
    }
  },
  {
    id: "ORD-5590",
    customer: "Emily Williams",
    email: "emily.williams@example.com",
    date: "2023-05-05T11:08:00Z",
    status: "delivered",
    total: 54.32,
    items: [
      { name: "Organic Baby Carrots", quantity: 1, price: 3.99 },
      { name: "Free Range Chicken Breast", quantity: 1, price: 14.99 },
      { name: "Organic Brown Rice (5 lb)", quantity: 1, price: 7.99 },
      { name: "Organic Kale Bunch", quantity: 2, price: 3.99 },
      { name: "Organic Apple Juice", quantity: 1, price: 5.99 },
      { name: "Organic Whole Milk", quantity: 1, price: 4.99 }
    ],
    shipping: {
      address: "789 Oak Street",
      city: "Austin",
      state: "TX",
      zip: "78701",
      country: "USA",
      tracking: "FEDEX9275631894"
    }
  },
  {
    id: "ORD-5589",
    customer: "David Rodriguez",
    email: "david.rodriguez@example.com",
    date: "2023-05-04T14:45:00Z",
    status: "cancelled",
    total: 98.76,
    items: [
      { name: "Organic Tomatoes (6 pack)", quantity: 1, price: 5.99 },
      { name: "Grass-fed Ribeye Steak", quantity: 2, price: 22.99 },
      { name: "Organic Blueberries", quantity: 2, price: 6.99 },
      { name: "Organic Sourdough Bread", quantity: 1, price: 6.99 },
      { name: "Organic Maple Syrup", quantity: 1, price: 12.99 }
    ],
    shipping: {
      address: "101 Pine Street",
      city: "San Francisco",
      state: "CA",
      zip: "94111",
      country: "USA",
      tracking: ""
    }
  },
  {
    id: "ORD-5588",
    customer: "Jessica Brown",
    email: "jessica.brown@example.com",
    date: "2023-05-03T09:30:00Z",
    status: "refunded",
    total: 45.67,
    items: [
      { name: "Organic Mixed Greens", quantity: 1, price: 5.99 },
      { name: "Organic Greek Yogurt", quantity: 2, price: 4.99 },
      { name: "Organic Strawberries", quantity: 1, price: 6.99 },
      { name: "Organic Bananas", quantity: 1, price: 3.99 },
      { name: "Organic Almond Milk", quantity: 1, price: 4.99 },
      { name: "Organic Granola", quantity: 1, price: 7.99 }
    ],
    shipping: {
      address: "222 Maple Drive",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
      tracking: "USPS8361749203"
    }
  }
];


const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderStatusUpdate, setOrderStatusUpdate] = useState<OrderStatus>('processing');
  
  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Update order tracking number
  const updateOrderTracking = () => {
    if (!selectedOrder) return;
    
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          shipping: {
            ...order.shipping,
            tracking: trackingNumber
          },
          status: 'shipped' as OrderStatus
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    setSelectedOrder(null);
  };
  
  // Update order status
  const updateOrderStatus = (id: string, status: OrderStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === id) {
        return { ...order, status };
      }
      return order;
    });
    
    setOrders(updatedOrders);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Get status badge color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-indigo-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'refunded': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Calculate order total
  const calculateOrderTotal = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-heading">Order Management</h2>
        <p className="text-muted-foreground">Manage and view customer orders</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 lg:w-3/5">
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10"
                placeholder="Search orders..."
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
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableCaption>
                {filteredOrders.length === 0 ? 'No orders found' : `${filteredOrders.length} orders`}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer}</div>
                          <div className="text-sm text-gray-500">{order.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>${calculateOrderTotal(order.items)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" /> Download Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="h-4 w-4 mr-2" /> Print Invoice
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Clipboard className="h-4 w-4 mr-2" /> Copy Order Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 lg:w-2/5">
          {selectedOrder ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Order Details: {selectedOrder.id}</CardTitle>
                </div>
                <CardDescription>
                  Customer: {selectedOrder.customer} ({selectedOrder.email})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Order Date: {formatDate(selectedOrder.date)}
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <h4 className="font-medium mb-2">Order Items</h4>
                    <ul className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{item.name} x {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="font-medium mt-3 text-right">
                      Total: ${calculateOrderTotal(selectedOrder.items)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Shipping Information</h4>
                  <div className="p-4 bg-muted rounded-md space-y-2">
                    <div>Address: {selectedOrder.shipping.address}</div>
                    <div>
                      {selectedOrder.shipping.city}, {selectedOrder.shipping.state} {selectedOrder.shipping.zip}, {selectedOrder.shipping.country}
                    </div>
                    <div>
                      Tracking Number: {selectedOrder.shipping.tracking || 'Not available'}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2 flex items-center">
                    <TruckIcon className="h-4 w-4 mr-2" /> Update Shipping Status
                  </h4>
                  
                  {selectedOrder.status !== 'shipped' && (
                    <>
                      <div className="mb-2">
                        <Input
                          type="text"
                          placeholder="Enter tracking number"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                        />
                      </div>
                      <Button 
                        className="w-full bg-leaf-600 hover:bg-leaf-700"
                        onClick={updateOrderTracking}
                        disabled={!trackingNumber}
                      >
                        Update Tracking &amp; Mark as Shipped
                      </Button>
                    </>
                  )}
                  
                  <div className="mt-4">
                    <Select 
                      value={orderStatusUpdate} 
                      onValueChange={(value) => setOrderStatusUpdate(value as OrderStatus)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                      onClick={() => updateOrderStatus(selectedOrder.id, orderStatusUpdate)}
                    >
                      Update Order Status
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>
                  Select an order to view details
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center p-10 text-gray-500">
                <TruckIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No order selected</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
