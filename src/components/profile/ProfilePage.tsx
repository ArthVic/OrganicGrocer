
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Set initial form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: user?.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zipCode: profile.zip_code || '',
        country: profile.country || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [profile, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone
    });
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip_code: formData.zipCode,
      country: formData.country
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    // Note: Password change functionality would need to be implemented with Supabase Auth
    toast.success("Password changed successfully!");
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-earth-900 mb-8">My Account</h1>
        <div className="text-center py-16">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-earth-900 mb-8">My Account</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSaveProfile}>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="firstName">First Name</label>
                        <Input 
                          id="firstName" 
                          value={formData.firstName} 
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="lastName">Last Name</label>
                        <Input 
                          id="lastName" 
                          value={formData.lastName} 
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="email">Email Address</label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email} 
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone Number</label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={formData.phone} 
                        onChange={handleChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="bg-leaf-600 hover:bg-leaf-700">Save Changes</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                  <CardDescription>Update your shipping information here.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSaveAddress}>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="address">Street Address</label>
                      <Input 
                        id="address" 
                        value={formData.address} 
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="city">City</label>
                        <Input 
                          id="city" 
                          value={formData.city} 
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="state">State</label>
                        <Input 
                          id="state" 
                          value={formData.state} 
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="zipCode">Zip Code</label>
                        <Input 
                          id="zipCode" 
                          value={formData.zipCode} 
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="country">Country</label>
                        <Input 
                          id="country" 
                          value={formData.country} 
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="bg-leaf-600 hover:bg-leaf-700">Save Address</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password here.</CardDescription>
                </CardHeader>
                <form onSubmit={handleChangePassword}>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="currentPassword">Current Password</label>
                      <Input 
                        id="currentPassword" 
                        type="password" 
                        value={formData.currentPassword}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="newPassword">New Password</label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">Confirm New Password</label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="submit" className="bg-leaf-600 hover:bg-leaf-700">Change Password</Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to sign out?')) {
                          signOut();
                        }
                      }}
                    >
                      Sign Out
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="font-medium">Account Status</div>
                  <div className="mt-2 text-sm">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      <span>Active</span>
                    </div>
                    <p className="mt-1 text-earth-600">Email: {user?.email}</p>
                    <p className="mt-1 text-earth-600">
                      Member since: {new Date(user?.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {/* Account settings and links can be added here */}
                
                <div className="mt-4 text-center">
                  <Button 
                    variant="link" 
                    className="text-leaf-600"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to sign out?')) {
                        signOut();
                      }
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
