
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, Users, Package, ShoppingCart, DollarSign } from 'lucide-react';

const salesData = [
  { name: 'Jan', value: 1200 },
  { name: 'Feb', value: 1900 },
  { name: 'Mar', value: 1500 },
  { name: 'Apr', value: 2400 },
  { name: 'May', value: 2700 },
  { name: 'Jun', value: 2100 },
];

const userSignupData = [
  { name: 'Jan', value: 50 },
  { name: 'Feb', value: 40 },
  { name: 'Mar', value: 65 },
  { name: 'Apr', value: 85 },
  { name: 'May', value: 110 },
  { name: 'Jun', value: 145 },
];

const productInventoryData = [
  { name: 'Fruits', stock: 154 },
  { name: 'Vegetables', stock: 220 },
  { name: 'Dairy', stock: 98 },
  { name: 'Bakery', stock: 43 },
  { name: 'Dry Goods', stock: 167 },
  { name: 'Beverages', stock: 75 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-heading">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your store performance and analytics.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">$24,780</div>
              <DollarSign className="h-8 w-8 text-leaf-600 bg-leaf-100 p-1 rounded-full" />
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+12.5%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">2,845</div>
              <Users className="h-8 w-8 text-leaf-600 bg-leaf-100 p-1 rounded-full" />
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">+5.2%</span>
              <span className="ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">582</div>
              <Package className="h-8 w-8 text-leaf-600 bg-leaf-100 p-1 rounded-full" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <span>82 low in stock</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">36</div>
              <ShoppingCart className="h-8 w-8 text-leaf-600 bg-leaf-100 p-1 rounded-full" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <span>Processed today</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly sales revenue for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer
                config={{
                  sales: {
                    label: "Sales",
                    color: "#84CC16",
                  },
                }}
              >
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#84CC16" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#84CC16" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="sales"
                    stroke="#84CC16"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>Current stock levels across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer
                config={{
                  stock: {
                    label: "Stock",
                    color: "#84CC16",
                  },
                }}
              >
                <BarChart data={productInventoryData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="stock" name="stock" fill="#84CC16" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
