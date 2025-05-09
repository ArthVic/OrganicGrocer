
import { useState, useEffect } from 'react';
import { supabase, subscribeToTable } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DashboardStats {
  totalRevenue: number;
  activeUsers: number;
  totalProducts: number;
  newOrders: number;
  lowStockItems: number;
}

export interface ProductCategoryStock {
  name: string;
  stock: number;
}

export interface SalesData {
  name: string;
  value: number;
}

export interface UserSignupData {
  name: string;
  value: number;
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    activeUsers: 0,
    totalProducts: 0,
    newOrders: 0,
    lowStockItems: 0
  });
  const [inventoryData, setInventoryData] = useState<ProductCategoryStock[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [userSignupData, setUserSignupData] = useState<UserSignupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to generate monthly sales data based on orders
  const generateSalesData = async () => {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      
      // Get data for the last 6 months
      const startMonth = (currentMonth - 5 + 12) % 12; // Go back 5 months
      
      const monthlySales: SalesData[] = [];
      
      // Try to get real sales data from orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total, created_at')
        .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString());
      
      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        // Fall back to mock data if we can't fetch from database
        for (let i = 0; i < 6; i++) {
          const monthIndex = (startMonth + i) % 12;
          monthlySales.push({
            name: months[monthIndex],
            value: Math.floor(Math.random() * 2000) + 1000 // Random value between 1000-3000
          });
        }
      } else if (ordersData && ordersData.length > 0) {
        // Group orders by month and sum totals
        const monthlySalesMap = new Map<string, number>();
        
        // Initialize map with all months
        for (let i = 0; i < 6; i++) {
          const monthIndex = (startMonth + i) % 12;
          monthlySalesMap.set(months[monthIndex], 0);
        }
        
        // Add sales data
        ordersData.forEach(order => {
          const orderDate = new Date(order.created_at);
          const monthName = months[orderDate.getMonth()];
          if (monthlySalesMap.has(monthName)) {
            monthlySalesMap.set(
              monthName, 
              (monthlySalesMap.get(monthName) || 0) + Number(order.total)
            );
          }
        });
        
        // Convert map to array
        for (let i = 0; i < 6; i++) {
          const monthIndex = (startMonth + i) % 12;
          const monthName = months[monthIndex];
          monthlySales.push({
            name: monthName,
            value: Math.round(monthlySalesMap.get(monthName) || 0)
          });
        }
      } else {
        // No orders data, use mock data
        for (let i = 0; i < 6; i++) {
          const monthIndex = (startMonth + i) % 12;
          monthlySales.push({
            name: months[monthIndex],
            value: Math.floor(Math.random() * 2000) + 1000
          });
        }
      }
      
      setSalesData(monthlySales);
    } catch (err) {
      console.error('Error generating sales data:', err);
      // Fallback to mock data
      setSalesData([
        { name: 'Jan', value: 1200 },
        { name: 'Feb', value: 1900 },
        { name: 'Mar', value: 1500 },
        { name: 'Apr', value: 2400 },
        { name: 'May', value: 2700 },
        { name: 'Jun', value: 2100 },
      ]);
    }
  };

  // Function to generate user signup data
  const generateUserSignupData = async () => {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      
      // Get data for the last 6 months
      const startMonth = (currentMonth - 5 + 12) % 12;
      
      // Try to get real user signup data
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      const userCount = count || 0;
      
      // Create mock growth data based on total count
      const userData: UserSignupData[] = [];
      let accumulator = userCount - Math.floor(userCount * 0.6); // Start with 40% of current users
      
      for (let i = 0; i < 6; i++) {
        const monthIndex = (startMonth + i) % 12;
        const growth = Math.floor(userCount * (0.05 + Math.random() * 0.1)); // 5-15% growth
        accumulator += growth;
        userData.push({
          name: months[monthIndex],
          value: i === 5 ? userCount : accumulator
        });
      }
      
      setUserSignupData(userData);
    } catch (err) {
      console.error('Error generating user signup data:', err);
      // Fallback to mock data
      setUserSignupData([
        { name: 'Jan', value: 50 },
        { name: 'Feb', value: 40 },
        { name: 'Mar', value: 65 },
        { name: 'Apr', value: 85 },
        { name: 'May', value: 110 },
        { name: 'Jun', value: 145 },
      ]);
    }
  };

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch products data
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, category, stock_quantity, price');
          
      if (productsError) throw productsError;
      
      // Calculate statistics
      if (productsData) {
        // Group products by category and sum stock quantities
        const categoryMap = new Map();
        let lowStockCount = 0;
        let totalRevenue = 0;
        
        productsData.forEach(product => {
          // Add to category inventory
          const category = product.category;
          const currentStock = categoryMap.get(category) || 0;
          categoryMap.set(category, currentStock + (product.stock_quantity || 0));
          
          // Count low stock items (less than 10)
          if (product.stock_quantity < 10) {
            lowStockCount++;
          }
          
          // Calculate potential revenue (price * stock)
          totalRevenue += product.price * product.stock_quantity;
        });
        
        // Convert map to array for chart data
        const inventoryData = Array.from(categoryMap.entries()).map(([name, stock]) => ({
          name,
          stock
        }));
        
        setInventoryData(inventoryData);
        
        // Fetch recent orders count
        let newOrdersCount = 0;
        try {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const { count } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString());
            
          newOrdersCount = count || 0;
        } catch (e) {
          console.log('Could not fetch new orders count, using default');
          newOrdersCount = 36; // Fallback
        }
        
        // Get auth users count (if you have access)
        let userCount = 0;
        try {
          const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });
            
          userCount = count || 0;
        } catch (e) {
          console.log('Could not fetch user count, using default');
          userCount = 2845; // Fallback
        }
        
        // Update stats
        setStats({
          totalRevenue: Math.round(totalRevenue),
          totalProducts: productsData.length,
          activeUsers: userCount,
          newOrders: newOrdersCount,
          lowStockItems: lowStockCount
        });
        
        // Generate sales data
        await generateSalesData();
        
        // Generate user signup data
        await generateUserSignupData();
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time listeners
    const unsubscribeProducts = subscribeToTable('products', '*', () => {
      console.log('Products changed, refreshing dashboard data');
      fetchDashboardData();
    });
    
    const unsubscribeOrders = subscribeToTable('orders', '*', () => {
      console.log('Orders changed, refreshing dashboard data');
      fetchDashboardData();
    });
    
    const unsubscribeProfiles = subscribeToTable('profiles', '*', () => {
      console.log('Profiles changed, refreshing user data');
      fetchDashboardData();
    });
    
    // Clean up subscriptions
    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribeProfiles();
    };
  }, []);

  // Function to manually refresh data
  const refreshData = () => {
    fetchDashboardData();
  };

  return { stats, inventoryData, salesData, userSignupData, loading, error, refreshData };
};
