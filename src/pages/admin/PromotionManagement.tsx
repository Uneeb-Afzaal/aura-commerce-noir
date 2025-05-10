
import React, { useState } from "react";
import { useAdmin } from "@/context/admin-context";
import { Promotion } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Trash2 } from "lucide-react";

const PromotionManagement = () => {
  const { promotions, addPromotion, updatePromotion, deletePromotion } = useAdmin();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(null);
  const [newPromotion, setNewPromotion] = useState<Omit<Promotion, "id">>({
    code: "",
    discountPercent: 10,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true
  });

  const filteredPromotions = promotions.filter(
    (promo) => promo.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPromotion(newPromotion);
    setNewPromotion({
      code: "",
      discountPercent: 10,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true
    });
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPromotion) {
      updatePromotion(currentPromotion.id, currentPromotion);
      setCurrentPromotion(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleEditClick = (promotion: Promotion) => {
    setCurrentPromotion({ ...promotion });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      deletePromotion(id);
    }
  };

  const togglePromotionStatus = (id: string, isActive: boolean) => {
    updatePromotion(id, { isActive });
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil).getTime() < Date.now();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#FFD700]">Promotion Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FFD700] hover:bg-[#F5CB00] text-black">
              <Plus className="mr-2 h-4 w-4" /> Add Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800">
            <DialogHeader>
              <DialogTitle>Create New Promotion</DialogTitle>
              <DialogDescription>
                Create a new promotion code for your customers.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Promotion Code</Label>
                <Input
                  id="code"
                  value={newPromotion.code}
                  onChange={(e) =>
                    setNewPromotion({ ...newPromotion, code: e.target.value.toUpperCase() })
                  }
                  placeholder="SUMMER20"
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount Percentage</Label>
                <div className="relative">
                  <Input
                    id="discount"
                    type="number"
                    min="1"
                    max="100"
                    value={newPromotion.discountPercent}
                    onChange={(e) =>
                      setNewPromotion({
                        ...newPromotion,
                        discountPercent: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                    className="bg-gray-800 border-gray-700 pr-8"
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={new Date(newPromotion.validUntil).toISOString().split('T')[0]}
                  onChange={(e) =>
                    setNewPromotion({
                      ...newPromotion,
                      validUntil: new Date(e.target.value).toISOString(),
                    })
                  }
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newPromotion.isActive}
                  onCheckedChange={(checked) =>
                    setNewPromotion({ ...newPromotion, isActive: checked })
                  }
                />
                <Label htmlFor="active">Active</Label>
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
                  Create Promotion
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search promotions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-gray-900 border-gray-800"
        />
        <p className="text-sm text-gray-400">
          Total Promotions: {filteredPromotions.length}
        </p>
      </div>

      <div className="border rounded-lg border-gray-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-900 hover:bg-gray-900">
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPromotions.length > 0 ? (
              filteredPromotions.map((promo) => (
                <TableRow key={promo.id} className="border-gray-800 hover:bg-gray-900">
                  <TableCell className="font-medium">{promo.code}</TableCell>
                  <TableCell>{promo.discountPercent}%</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{new Date(promo.validUntil).toLocaleDateString()}</span>
                      {isExpired(promo.validUntil) && (
                        <span className="text-xs text-red-400">Expired</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={promo.isActive}
                        onCheckedChange={(checked) =>
                          togglePromotionStatus(promo.id, checked)
                        }
                        disabled={isExpired(promo.validUntil)}
                      />
                      <Badge
                        variant="outline"
                        className={
                          promo.isActive && !isExpired(promo.validUntil)
                            ? "bg-green-900/20 text-green-300"
                            : "bg-red-900/20 text-red-300"
                        }
                      >
                        {promo.isActive && !isExpired(promo.validUntil) ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(promo)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(promo.id)}
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
                  No promotions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle>Edit Promotion</DialogTitle>
            <DialogDescription>
              Update promotion details.
            </DialogDescription>
          </DialogHeader>
          {currentPromotion && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Promotion Code</Label>
                <Input
                  id="edit-code"
                  value={currentPromotion.code}
                  onChange={(e) =>
                    setCurrentPromotion({ ...currentPromotion, code: e.target.value.toUpperCase() })
                  }
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-discount">Discount Percentage</Label>
                <div className="relative">
                  <Input
                    id="edit-discount"
                    type="number"
                    min="1"
                    max="100"
                    value={currentPromotion.discountPercent}
                    onChange={(e) =>
                      setCurrentPromotion({
                        ...currentPromotion,
                        discountPercent: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                    className="bg-gray-800 border-gray-700 pr-8"
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-validUntil">Valid Until</Label>
                <Input
                  id="edit-validUntil"
                  type="date"
                  value={new Date(currentPromotion.validUntil).toISOString().split('T')[0]}
                  onChange={(e) =>
                    setCurrentPromotion({
                      ...currentPromotion,
                      validUntil: new Date(e.target.value).toISOString(),
                    })
                  }
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={currentPromotion.isActive}
                  onCheckedChange={(checked) =>
                    setCurrentPromotion({ ...currentPromotion, isActive: checked })
                  }
                />
                <Label htmlFor="edit-active">Active</Label>
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
                  Update Promotion
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromotionManagement;
