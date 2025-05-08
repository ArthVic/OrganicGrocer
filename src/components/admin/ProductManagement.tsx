
import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Search, Image, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock_quantity: number;
  weight: string;
  certification?: string | null;
  nutrition_info?: string | null;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock_quantity: number;
  weight: string;
  certification?: string;
  nutrition_info?: string;
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  category: '',
  image: '',
  stock_quantity: 0,
  weight: '',
  certification: '',
  nutrition_info: ''
};

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Function to fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock_quantity' ? Number(value) : value
    }));
  };
  
  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  
  // Upload image to Supabase Storage
  const uploadImage = async (): Promise<string> => {
    if (!imageFile) {
      // If we're editing and no new image is selected, use the existing one
      if (editingProduct) {
        return formData.image;
      } else {
        throw new Error("Please select an image");
      }
    }
    
    setIsUploading(true);
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    try {
      const { data: uploadData, error } = await supabase.storage
        .from('products')
        .upload(`images/${fileName}`, imageFile);
      
      if (error) throw error;
      
      // Get public URL for the uploaded image
      const { data: urlData } = await supabase.storage
        .from('products')
        .getPublicUrl(`images/${fileName}`);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle form submission for creating or updating a product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Upload image if provided
      let imageUrl;
      try {
        imageUrl = await uploadImage();
      } catch (error) {
        // If we're creating a new product and image upload fails, stop
        if (!editingProduct) throw error;
        // If we're editing, we can proceed with the existing image
        imageUrl = formData.image;
      }
      
      const productData = {
        ...formData,
        image: imageUrl
      };
      
      // Create or update the product
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct);
        
        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) throw error;
        toast.success('Product created successfully');
      }
      
      // Reset form and close dialog
      setFormData(initialFormData);
      setEditingProduct(null);
      setImageFile(null);
      setDialogOpen(false);
      
      // Refresh products list
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle product edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock_quantity: product.stock_quantity,
      weight: product.weight,
      certification: product.certification || '',
      nutrition_info: product.nutrition_info || ''
    });
    setDialogOpen(true);
  };
  
  // Handle product delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        toast.success('Product deleted successfully');
        
        // Update the products list
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };
  
  // Reset form when dialog closes
  const handleDialogClose = () => {
    if (!isSubmitting && !isUploading) {
      setFormData(initialFormData);
      setEditingProduct(null);
      setImageFile(null);
      setDialogOpen(false);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">Product Management</h2>
          <p className="text-muted-foreground">View, create, update, and delete products</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          if (!open) handleDialogClose();
          setDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-leaf-600 hover:bg-leaf-700">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              <DialogDescription>
                {editingProduct 
                  ? 'Update the product details below.' 
                  : 'Fill in the details to add a new product.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category" 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input 
                    id="stock_quantity" 
                    name="stock_quantity" 
                    type="number" 
                    min="0" 
                    value={formData.stock_quantity} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input 
                    id="weight" 
                    name="weight" 
                    value={formData.weight} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="e.g., 500g, 1kg" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="certification">Certification (Optional)</Label>
                  <Input 
                    id="certification" 
                    name="certification" 
                    value={formData.certification} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Organic, Non-GMO" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nutrition_info">Nutrition Info (Optional)</Label>
                  <Input 
                    id="nutrition_info" 
                    name="nutrition_info" 
                    value={formData.nutrition_info} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Calories, Protein content" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <div className="flex items-center gap-4">
                  {formData.image && (
                    <div className="w-24 h-24 rounded border overflow-hidden">
                      <img 
                        src={formData.image} 
                        alt="Product preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Label 
                      htmlFor="image-upload" 
                      className="flex items-center gap-2 cursor-pointer border rounded-md p-2"
                    >
                      <Image className="h-5 w-5" />
                      <span>
                        {imageFile ? imageFile.name : 'Choose image file'}
                      </span>
                    </Label>
                    <Input 
                      id="image-upload" 
                      type="file" 
                      onChange={handleImageChange} 
                      className="hidden" 
                      accept="image/*" 
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {editingProduct && !imageFile ? 'Leave empty to keep current image' : 'Recommended size: 800x600px'}
                    </p>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleDialogClose} 
                  disabled={isSubmitting || isUploading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-leaf-600 hover:bg-leaf-700"
                  disabled={isSubmitting || isUploading}
                >
                  {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isUploading ? 'Uploading...' : isSubmitting ? 'Saving...' : 'Save Product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableCaption>
            {isLoading ? 'Loading products...' : `${filteredProducts.length} products`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded border overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={product.stock_quantity < 10 ? 'text-red-500 font-medium' : ''}>
                      {product.stock_quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductManagement;
