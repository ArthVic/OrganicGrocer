
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from '@/components/ui/button';

// Sample product data for search (in a real app, this would come from context or API)
const products = [
  {
    id: '1',
    name: 'Organic Avocado',
    category: 'Fruits',
    price: 2.99
  },
  {
    id: '2',
    name: 'Organic Baby Spinach',
    category: 'Leafy Greens',
    price: 3.49
  },
  {
    id: '3',
    name: 'Organic Carrots',
    category: 'Vegetables',
    price: 1.99
  },
  {
    id: '4',
    name: 'Organic Blueberries',
    category: 'Berries',
    price: 4.99
  },
  {
    id: '5',
    name: 'Organic Bananas',
    category: 'Fruits',
    price: 1.49
  },
  {
    id: '6',
    name: 'Organic Cucumber',
    category: 'Vegetables',
    price: 1.79
  }
];

interface SearchDialogProps {
  className?: string;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (productId: string) => {
    setOpen(false);
    navigate(`/products/${productId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Search className="h-5 w-5" />
          <span className="sr-only">Search products</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search for products..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Products">
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  onSelect={() => handleSelect(product.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-muted-foreground">{product.category}</span>
                  </div>
                  <span className="font-medium">${product.price.toFixed(2)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
