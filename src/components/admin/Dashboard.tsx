
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
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, Users, Package, ShoppingCart, DollarSign, RefreshCw } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { stats, inventoryData, salesData, userSignupData, loading, error, refreshData } = useDashboardData();

  const handleRefresh = () => {
    toast.info('Refreshing dashboard data...');
    refreshData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your store performance and analytics.</p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
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
              <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
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
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <Package className="h-8 w-8 text-leaf-600 bg-leaf-100 p-1 rounded-full" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <span>{stats.lowStockItems} low in stock</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.newOrders}</div>
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
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-leaf-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
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
                </ResponsiveContainer>
              )}
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
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-leaf-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer
                    config={{
                      stock: {
                        label: "Stock",
                        color: "#84CC16",
                      },
                    }}
                  >
                    <BarChart data={inventoryData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="stock" name="stock" fill="#84CC16" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {error && (
        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading dashboard data: {error}</p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={refreshData}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
