
import React, { useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, Search, Mail, Users, DollarSign, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Mock data for segments
const mockSegments = [
  {
    id: 'seg-1',
    name: 'VIP Customers',
    description: 'Customers who spend over $500 in the last 6 months',
    count: 124,
    criteria: {
      totalSpent: { min: 500 },
      timeframe: { months: 6 },
    },
    color: '#84CC16', // leaf-600
    attributes: {
      avgOrderValue: 112.75,
      orderFrequency: 'Weekly',
      preferredCategories: ['Organic Produce', 'Premium Items'],
      retention: '95%'
    }
  },
  {
    id: 'seg-2',
    name: 'Regular Shoppers',
    description: 'Customers who order at least once every 2 weeks',
    count: 347,
    criteria: {
      orderFrequency: { max: 14 }, // days
    },
    color: '#65A30D', // leaf-700
    attributes: {
      avgOrderValue: 67.40,
      orderFrequency: 'Bi-weekly',
      preferredCategories: ['Vegetables', 'Dairy'],
      retention: '82%'
    }
  },
  {
    id: 'seg-3',
    name: 'New Customers',
    description: 'Customers who joined in the last 30 days',
    count: 89,
    criteria: {
      joinDate: { days: 30 },
    },
    color: '#BEE679', // leaf-300
    attributes: {
      avgOrderValue: 45.20,
      orderFrequency: 'Once',
      preferredCategories: ['Fruits', 'Snacks'],
      retention: 'N/A'
    }
  },
  {
    id: 'seg-4',
    name: 'At Risk',
    description: 'Previous regular customers who haven\'t ordered in 60 days',
    count: 53,
    criteria: {
      lastOrder: { min: 60 }, // days
      previousOrders: { min: 5 },
    },
    color: '#F87171', // red-400
    attributes: {
      avgOrderValue: 72.30,
      orderFrequency: 'Lapsed',
      preferredCategories: ['Bakery', 'Beverages'],
      retention: '35%'
    }
  },
  {
    id: 'seg-5',
    name: 'Big Basket',
    description: 'Customers with average order value above $100',
    count: 211,
    criteria: {
      avgOrderValue: { min: 100 },
    },
    color: '#60A5FA', // blue-400
    attributes: {
      avgOrderValue: 156.80,
      orderFrequency: 'Monthly',
      preferredCategories: ['Bulk Items', 'Pantry'],
      retention: '78%'
    }
  }
];

// Mock data for customers belonging to a segment
const mockCustomers = [
  { id: 'cust-1', name: 'Jane Smith', email: 'jane.smith@example.com', orders: 12, lastOrder: '2023-05-05', totalSpent: 1245.60 },
  { id: 'cust-2', name: 'John Doe', email: 'john.doe@example.com', orders: 8, lastOrder: '2023-05-01', totalSpent: 876.30 },
  { id: 'cust-3', name: 'Alice Johnson', email: 'alice.johnson@example.com', orders: 15, lastOrder: '2023-05-06', totalSpent: 1560.75 },
  { id: 'cust-4', name: 'Robert Wilson', email: 'robert.wilson@example.com', orders: 6, lastOrder: '2023-04-28', totalSpent: 734.20 },
  { id: 'cust-5', name: 'Emily Davis', email: 'emily.davis@example.com', orders: 10, lastOrder: '2023-05-02', totalSpent: 1120.50 },
];

interface SegmentCriteria {
  totalSpent?: { min?: number; max?: number };
  orderFrequency?: { min?: number; max?: number };
  timeframe?: { days?: number; months?: number };
  joinDate?: { days?: number; months?: number };
  lastOrder?: { min?: number; max?: number };
  previousOrders?: { min?: number; max?: number };
  avgOrderValue?: { min?: number; max?: number };
}

interface SegmentAttributes {
  avgOrderValue: number;
  orderFrequency: string;
  preferredCategories: string[];
  retention: string;
}

interface Segment {
  id: string;
  name: string;
  description: string;
  count: number;
  criteria: SegmentCriteria;
  color: string;
  attributes: SegmentAttributes;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  lastOrder: string;
  totalSpent: number;
}

const CustomerSegmentation: React.FC = () => {
  const [segments, setSegments] = useState<Segment[]>(mockSegments);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  
  // Format data for pie chart
  const pieChartData = segments.map(segment => ({
    name: segment.name,
    value: segment.count,
    color: segment.color
  }));
  
  // View segment details and fetch customers
  const viewSegmentDetails = (segment: Segment) => {
    setSelectedSegment(segment);
    // In a real app, you would fetch customers from API
    setCustomers(mockCustomers);
    setSelectedCustomers([]);
  };
  
  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    return (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Toggle customer selection
  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId);
      } else {
        return [...prev, customerId];
      }
    });
  };
  
  // Handle select all customers
  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };
  
  // Format date for better display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">Customer Segmentation</h2>
          <p className="text-muted-foreground">Analyze and manage customer segments</p>
        </div>
        <Button>Create New Segment</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Segments Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2 mt-4">
              {segments.map((segment) => (
                <div 
                  key={segment.id}
                  className={`p-3 rounded-md cursor-pointer flex items-center justify-between hover:bg-gray-100 ${
                    selectedSegment?.id === segment.id ? 'bg-gray-100 border-l-4 border-leaf-600' : ''
                  }`}
                  onClick={() => viewSegmentDetails(segment)}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: segment.color }}
                    />
                    <div>
                      <div className="font-medium">{segment.name}</div>
                      <div className="text-xs text-gray-500">{segment.count} customers</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Segment Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedSegment ? selectedSegment.name : 'Select a Segment'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSegment ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Average Order Value</div>
                    <div className="text-2xl font-bold">${selectedSegment.attributes.avgOrderValue}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Order Frequency</div>
                    <div className="text-2xl font-bold">{selectedSegment.attributes.orderFrequency}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Retention Rate</div>
                    <div className="text-2xl font-bold">{selectedSegment.attributes.retention}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Preferred Categories</div>
                    <div className="text-2xl font-bold">{selectedSegment.attributes.preferredCategories.join(', ')}</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Customers in Segment</h3>
                    <div className="flex items-center space-x-2">
                      <div className="relative w-64">
                        <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search customers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      <Button variant="outline" onClick={handleSelectAll}>
                        {selectedCustomers.length === filteredCustomers.length ? 'Deselect All' : 'Select All'}
                      </Button>
                      <Button>Export Selected</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <Checkbox
                              checked={selectedCustomers.length === filteredCustomers.length}
                              onCheckedChange={handleSelectAll}
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Orders
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Order
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Spent
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCustomers.map((customer) => (
                          <tr key={customer.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Checkbox
                                checked={selectedCustomers.includes(customer.id)}
                                onCheckedChange={() => toggleCustomerSelection(customer.id)}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                  <div className="text-sm text-gray-500">{customer.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {customer.orders}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(customer.lastOrder)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${customer.totalSpent.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No segment selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a segment from the list to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerSegmentation;
