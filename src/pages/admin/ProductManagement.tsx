import React, { useState } from "react";
import { useAdmin } from "@/context/auth-centext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Product } from "@/types";

const ProductManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    brand: "",
    price: 0,
    imageUrl: "",
    rating: 0,
    description: "",
    category: "unisex",
    stock: 0,
    volume: "",
    heartNotes: ["", "", ""],
    baseNotes: ["", "", ""],
    topNotes: ["", "", ""],
  });

  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      stock: 0,
      volume: "",
      heartNotes: ["", "", ""],
      baseNotes: ["", "", ""],
      topNotes: ["", "", ""],
    });
    setIsAddDialogOpen(false);
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct({ ...product });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProduct) {
      updateProduct(currentProduct.id, currentProduct);
      setCurrentProduct(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    deleteProduct(id);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        {/* Add Product Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Plus size={16} /> Add Product
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
              {/* Basic Info */}
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

              {/* Price & Category */}
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

              {/* Image URL & Stock */}
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

              {/* Rating */}
              <div className="space-y-2">
                <label htmlFor="rating" className="text-sm font-medium">
                  Rating (1–5)
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

              {/* Description */}
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

              {/* Volume */}
              <div className="space-y-2">
                <label htmlFor="volume" className="text-sm font-medium">
                  Volume
                </label>
                <Select
                  value={newProduct.volume}
                  onValueChange={(v) =>
                    setNewProduct({ ...newProduct, volume: v })
                  }
                >
                  <SelectTrigger id="volume" className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select volume" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="3ml">3 ml</SelectItem>
                    <SelectItem value="5ml">5 ml</SelectItem>
                    <SelectItem value="10ml">10 ml</SelectItem>
                    <SelectItem value="15ml">15 ml</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Heart Notes */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Heart Notes (3 ingredients)</p>
                {newProduct.heartNotes.map((note, idx) => (
                  <Input
                    key={idx}
                    placeholder={`Heart Note ${idx + 1}`}
                    value={note}
                    onChange={(e) => {
                      const notes = [...newProduct.heartNotes] as [string, string, string];
                      notes[idx] = e.target.value;
                      setNewProduct({ ...newProduct, heartNotes: notes });
                    }}
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                ))}
              </div>

              {/* Base Notes */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Base Notes (3 ingredients)</p>
                {newProduct.baseNotes.map((note, idx) => (
                  <Input
                    key={idx}
                    placeholder={`Base Note ${idx + 1}`}
                    value={note}
                    onChange={(e) => {
                      const notes = [...newProduct.baseNotes] as [string, string, string];
                      notes[idx] = e.target.value;
                      setNewProduct({ ...newProduct, baseNotes: notes });
                    }}
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                ))}
              </div>

              {/* Top Notes */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Top Notes (3 ingredients)</p>
                {newProduct.topNotes.map((note, idx) => (
                  <Input
                    key={idx}
                    placeholder={`Top Note ${idx + 1}`}
                    value={note}
                    onChange={(e) => {
                      const notes = [...newProduct.topNotes] as [string, string, string];
                      notes[idx] = e.target.value;
                      setNewProduct({ ...newProduct, topNotes: notes });
                    }}
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                ))}
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-[#FFD700] hover:bg-[#F5CB00] text-black"
                >
                  Add Product
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Table */}
      <div className="flex justify-between items-center mb-4">
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
                <TableRow
                  key={product.id}
                  className="border-gray-800 hover:bg-gray-900"
                >
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
                  <TableCell>PKR {product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock && product.stock < 10
                          ? "text-red-400"
                          : ""
                      }
                    >
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

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details.</DialogDescription>
          </DialogHeader>
          {currentProduct && (
  <form onSubmit={handleEditSubmit} className="space-y-4">
    {/* Name & Brand */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label htmlFor="edit-name" className="text-sm font-medium">Name</label>
        <Input
          id="edit-name"
          value={currentProduct.name}
          onChange={e =>
            setCurrentProduct({ ...currentProduct, name: e.target.value })
          }
          required
          className="bg-gray-800 border-gray-700"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="edit-brand" className="text-sm font-medium">Brand</label>
        <Input
          id="edit-brand"
          value={currentProduct.brand}
          onChange={e =>
            setCurrentProduct({ ...currentProduct, brand: e.target.value })
          }
          required
          className="bg-gray-800 border-gray-700"
        />
      </div>
    </div>

    {/* Price & Category */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label htmlFor="edit-price" className="text-sm font-medium">Price</label>
        <Input
          id="edit-price"
          type="number"
          min="0"
          step="0.01"
          value={currentProduct.price}
          onChange={e =>
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
        <label htmlFor="edit-category" className="text-sm font-medium">Category</label>
        <Select
          value={currentProduct.category}
          onValueChange={v =>
            setCurrentProduct({ ...currentProduct, category: v })
          }
        >
          <SelectTrigger id="edit-category" className="bg-gray-800 border-gray-700">
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

    {/* Image URL & Stock */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label htmlFor="edit-imageUrl" className="text-sm font-medium">Image URL</label>
        <Input
          id="edit-imageUrl"
          value={currentProduct.imageUrl}
          onChange={e =>
            setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })
          }
          required
          className="bg-gray-800 border-gray-700"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="edit-stock" className="text-sm font-medium">Stock</label>
        <Input
          id="edit-stock"
          type="number"
          min="0"
          value={currentProduct.stock}
          onChange={e =>
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

    {/* Rating */}
    <div className="space-y-2">
      <label htmlFor="edit-rating" className="text-sm font-medium">Rating (1–5)</label>
      <Input
        id="edit-rating"
        type="number"
        min="1"
        max="5"
        value={currentProduct.rating}
        onChange={e =>
          setCurrentProduct({
            ...currentProduct,
            rating: parseInt(e.target.value) || 0,
          })
        }
        required
        className="bg-gray-800 border-gray-700"
      />
    </div>

    {/* Description */}
    <div className="space-y-2">
      <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
      <Textarea
        id="edit-description"
        value={currentProduct.description}
        onChange={e =>
          setCurrentProduct({ ...currentProduct, description: e.target.value })
        }
        required
        className="bg-gray-800 border-gray-700"
      />
    </div>

    {/* Volume */}
    <div className="space-y-2">
      <label htmlFor="edit-volume" className="text-sm font-medium">Volume</label>
      <Select
        value={currentProduct.volume}
        onValueChange={v =>
          setCurrentProduct({ ...currentProduct, volume: v })
        }
      >
        <SelectTrigger id="edit-volume" className="bg-gray-800 border-gray-700">
          <SelectValue placeholder="Select volume" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-800">
          <SelectItem value="3ml">3 ml</SelectItem>
          <SelectItem value="5ml">5 ml</SelectItem>
          <SelectItem value="10ml">10 ml</SelectItem>
          <SelectItem value="15ml">15 ml</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Heart Notes */}
    <div className="space-y-2">
      <p className="text-sm font-medium">Heart Notes (3)</p>
      {currentProduct.heartNotes.map((n, i) => (
        <Input
          key={i}
          placeholder={`Heart Note ${i + 1}`}
          value={n}
          onChange={e => {
            const notes = [...currentProduct.heartNotes] as [string,string,string];
            notes[i] = e.target.value;
            setCurrentProduct({ ...currentProduct, heartNotes: notes });
          }}
          required
          className="bg-gray-800 border-gray-700"
        />
      ))}
    </div>

    {/* Base Notes */}
    <div className="space-y-2">
      <p className="text-sm font-medium">Base Notes (3)</p>
      {currentProduct.baseNotes.map((n, i) => (
        <Input
          key={i}
          placeholder={`Base Note ${i + 1}`}
          value={n}
          onChange={e => {
            const notes = [...currentProduct.baseNotes] as [string,string,string];
            notes[i] = e.target.value;
            setCurrentProduct({ ...currentProduct, baseNotes: notes });
          }}
          required
          className="bg-gray-800 border-gray-700"
        />
      ))}
    </div>

    {/* Top Notes */}
    <div className="space-y-2">
      <p className="text-sm font-medium">Top Notes (3)</p>
      {currentProduct.topNotes.map((n, i) => (
        <Input
          key={i}
          placeholder={`Top Note ${i + 1}`}
          value={n}
          onChange={e => {
            const notes = [...currentProduct.topNotes] as [string,string,string];
            notes[i] = e.target.value;
            setCurrentProduct({ ...currentProduct, topNotes: notes });
          }}
          required
          className="bg-gray-800 border-gray-700"
        />
      ))}
    </div>

    <DialogFooter>
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
