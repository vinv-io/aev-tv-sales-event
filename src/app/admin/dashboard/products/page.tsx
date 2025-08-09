
'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, MoreHorizontal, Edit, Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { getProductsAction, createProductAction, updateProductAction, deleteProductAction } from '@/lib/data/clean-actions';
import type { Product } from '@/lib/data/types';


const ITEMS_PER_PAGE = 5;

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProducts = async () => {
        const prods = await getProductsAction() as Product[];
        setProducts(prods);
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const name = typeof product.name === 'string' ? product.name : product.name.en;
        const description = typeof product.description === 'string' ? product.description : product.description.en;
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               description.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        await createProductAction(formData);
        await createProductAction(formData);
        fetchProducts();
        setCreateDialogOpen(false);
        form.reset();
      };
      
      const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedProduct) return;
        const form = e.currentTarget;
        const formData = new FormData(form);

        await updateProductAction(selectedProduct.id, formData);
        fetchProducts();

        setEditDialogOpen(false);
        setSelectedProduct(null);
      }
    
      const handleDeleteProduct = async (id: string) => {
        await deleteProductAction(id);
        fetchProducts();
      };

      const openEditDialog = (product: Product) => {
        setSelectedProduct(product);
        setEditDialogOpen(true);
      }

  return (
    <Card>
        <CardHeader>
             <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Manage your products.</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create New Product
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                                <DialogTitle>Create New Product</DialogTitle>
                                <DialogDescription>
                                Fill in the details for the new product.
                                </DialogDescription>
                            </DialogHeader>
                            <form id="create-product-form" onSubmit={handleCreateProduct}>
                                <div className="grid gap-4 py-4">
                                     <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="id" className="text-right">ID</Label>
                                        <Input id="id" name="id" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name_en" className="text-right">Name (EN)</Label>
                                        <Input id="name_en" name="name_en" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name_vi" className="text-right">Name (VI)</Label>
                                        <Input id="name_vi" name="name_vi" className="col-span-3" required />
                                    </div>
                                     <div className="grid grid-cols-4 items-start gap-4">
                                        <Label htmlFor="description_en" className="text-right pt-2">Description (EN)</Label>
                                        <Textarea id="description_en" name="description_en" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-start gap-4">
                                        <Label htmlFor="description_vi" className="text-right pt-2">Description (VI)</Label>
                                        <Textarea id="description_vi" name="description_vi" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="image" className="text-right">Image URL</Label>
                                        <Input id="image" name="image" className="col-span-3" placeholder="https://placehold.co/600x400.png" />
                                    </div>
                                </div>
                            </form>
                            <DialogFooter>
                                <Button type="submit" form="create-product-form">Create</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                    <TableCell>
                        <Image src={product.image} alt={typeof product.name === 'string' ? product.name : product.name.en} width={64} height={64} className="rounded-md object-cover" />
                    </TableCell>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{typeof product.name === 'string' ? product.name : product.name.en}</TableCell>
                    <TableCell className="truncate max-w-xs">{typeof product.description === 'string' ? product.description : product.description.en}</TableCell>
                    <TableCell className="text-right">
                        <Dialog open={isEditDialogOpen && selectedProduct?.id === product.id} onOpenChange={(isOpen) => { if (!isOpen) setSelectedProduct(null); setEditDialogOpen(isOpen);}}>
                            <AlertDialog>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => openEditDialog(product)}>
                                            <Edit className="mr-2 h-4 w-4"/>
                                            Edit
                                        </DropdownMenuItem>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4"/>
                                                Delete
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this product.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <DialogContent className="sm:max-w-[625px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Product</DialogTitle>
                                    <DialogDescription>
                                    Update the details for {selectedProduct ? (typeof selectedProduct.name === 'string' ? selectedProduct.name : selectedProduct.name.en) : ''}.
                                    </DialogDescription>
                                </DialogHeader>
                                <form id="edit-product-form" onSubmit={handleEditProduct}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-id" className="text-right">ID</Label>
                                            <Input id="edit-id" name="id" className="col-span-3" defaultValue={selectedProduct?.id} required />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-name_en" className="text-right">Name (EN)</Label>
                                            <Input id="edit-name_en" name="name_en" className="col-span-3" defaultValue={selectedProduct ? (typeof selectedProduct.name === 'object' ? selectedProduct.name.en : '') : ''} required />
                                        </div>
                                         <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-name_vi" className="text-right">Name (VI)</Label>
                                            <Input id="edit-name_vi" name="name_vi" className="col-span-3" defaultValue={selectedProduct ? (typeof selectedProduct.name === 'object' ? selectedProduct.name.vi : '') : ''} required />
                                        </div>
                                        <div className="grid grid-cols-4 items-start gap-4">
                                            <Label htmlFor="edit-description_en" className="text-right pt-2">Description (EN)</Label>
                                            <Textarea id="edit-description_en" name="description_en" className="col-span-3" defaultValue={selectedProduct ? (typeof selectedProduct.description === 'object' ? selectedProduct.description.en : '') : ''} required />
                                        </div>
                                        <div className="grid grid-cols-4 items-start gap-4">
                                            <Label htmlFor="edit-description_vi" className="text-right pt-2">Description (VI)</Label>
                                            <Textarea id="edit-description_vi" name="description_vi" className="col-span-3" defaultValue={selectedProduct ? (typeof selectedProduct.description === 'object' ? selectedProduct.description.vi : '') : ''} required />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-image" className="text-right">Image URL</Label>
                                            <Input id="edit-image" name="image" className="col-span-3" defaultValue={selectedProduct?.image} />
                                        </div>
                                    </div>
                                </form>
                                <DialogFooter>
                                    <Button type="submit" form="edit-product-form">Save Changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
        <CardFooter className="flex justify-center items-center space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
                Previous
            </Button>
            <span>
                Page {currentPage} of {totalPages || 1}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages <= 1}
            >
                Next
                <ChevronRight className="h-4 w-4" />
            </Button>
        </CardFooter>
    </Card>
  )
}
