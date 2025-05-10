
import React, { useState } from "react";
import { useAdmin } from "@/context/admin-context";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash2 } from "lucide-react";

const ProductManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    brand: "",
    price: 0,
    imageUrl: "",
    rating: 0,
    description: "",
    category: "unisex",
    stock: 0
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(newProduct);
    setNewProduct({
      name: "",
      brand: "",
      price: 0,
      imageUrl: "",
      rating: 0,
      description: "",
      category: "unisex",
      stock: 0
    });
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProduct) {
      updateProduct(currentProduct.id, currentProduct);
      setCurrentProduct(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct({ ...product });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#FFD700]">Product Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FFD700] hover:bg-[#F5CB00] text-black">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the details for the new product.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="brand" className="text-sm font-medium">
                    Brand
                  </label>
                  <Input
                    id="brand"
                    value={newProduct.brand}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, brand: e.target.value })
                    }
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">
                    Price
                  </label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category
                  </label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) =>
                      setNewProduct({ ...newProduct, category: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="imageUrl" className="text-sm font-medium">
                    Image URL
                  </label>
                  <Input
                    id="imageUrl"
                    value={newProduct.imageUrl}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, imageUrl: e.target.value })
                    }
                    required
                    className="bg-gray-800 border-gray-700"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="stock" className="text-sm font-medium">
                    Stock
                  </label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="rating" className="text-sm font-medium">
                  Rating (1-5)
                </label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={newProduct.rating}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      rating: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#FFD700] hover:bg-[#F5CB00] text-black">
                  Add Product
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-gray-900 border-gray-800"
        />
        <p className="text-sm text-gray-400">
          Total Products: {filteredProducts.length}
        </p>
      </div>

      <div className="border rounded-lg border-gray-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-900 hover:bg-gray-900">
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-gray-800 hover:bg-gray-900">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-400">{product.brand}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={product.stock && product.stock < 10 ? "text-red-400" : ""}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(product)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(product.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details.
            </DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="edit-name"
                    value={currentProduct.name}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, name: e.target.value })
                    }
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-brand" className="text-sm font-medium">
                    Brand
                  </label>
                  <Input
                    id="edit-brand"
                    value={currentProduct.brand}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, brand: e.target.value })
                    }
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-price" className="text-sm font-medium">
                    Price
                  </label>
                  <Input
                    id="edit-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentProduct.price}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-category" className="text-sm font-medium">
                    Category
                  </label>
                  <Select
                    value={currentProduct.category}
                    onValueChange={(value) =>
                      setCurrentProduct({ ...currentProduct, category: value as any })
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-imageUrl" className="text-sm font-medium">
                    Image URL
                  </label>
                  <Input
                    id="edit-imageUrl"
                    value={currentProduct.imageUrl}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })
                    }
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-stock" className="text-sm font-medium">
                    Stock
                  </label>
                  <Input
                    id="edit-stock"
                    type="number"
                    min="0"
                    value={currentProduct.stock}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-rating" className="text-sm font-medium">
                  Rating (1-5)
                </label>
                <Input
                  id="edit-rating"
                  type="number"
                  min="1"
                  max="5"
                  value={currentProduct.rating}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      rating: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="edit-description"
                  value={currentProduct.description}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      description: e.target.value,
                    })
                  }
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#FFD700] hover:bg-[#F5CB00] text-black">
                  Update Product
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
