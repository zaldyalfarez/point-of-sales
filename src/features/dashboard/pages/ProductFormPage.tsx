import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ImageSquare, Plus, Trash } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { mockCategories } from "@/lib/mock-data"

interface VariantRow {
  id: string
  name: string
  skuSuffix: string
  priceAdjustment: string
  stock: string
}

function createEmptyVariant(): VariantRow {
  return {
    id: `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    name: "",
    skuSuffix: "",
    priceAdjustment: "0",
    stock: "0",
  }
}

export function ProductFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    sku: "",
    categoryId: "",
    description: "",
    price: "",
    cost: "",
    stock: "",
    minStock: "",
  })

  const [hasVariants, setHasVariants] = useState(false)
  const [variants, setVariants] = useState<VariantRow[]>([createEmptyVariant()])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleVariantChange = (id: string, field: keyof VariantRow, value: string) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    )
  }

  const addVariant = () => {
    setVariants((prev) => [...prev, createEmptyVariant()])
  }

  const removeVariant = (id: string) => {
    setVariants((prev) => (prev.length <= 1 ? prev : prev.filter((v) => v.id !== id)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: call productService.createProduct(form, variants)
    navigate("/dashboard/products")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Product</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the product details below
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Main Info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Basic product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g. Arabica Coffee Beans"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={form.sku}
                    onChange={(e) => handleChange("sku", e.target.value)}
                    placeholder="e.g. COF-ARB"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={form.categoryId} onValueChange={(v) => handleChange("categoryId", v)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Product description..."
                  rows={3}
                />
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Base Price (IDR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost Price (IDR)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={form.cost}
                    onChange={(e) => handleChange("cost", e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              {!hasVariants && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Initial Stock *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={form.stock}
                      onChange={(e) => handleChange("stock", e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Minimum Stock (Alert)</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={form.minStock}
                      onChange={(e) => handleChange("minStock", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Image & Actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
                  <ImageSquare size={40} weight="thin" className="text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click or drag to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 5MB
                  </p>
                  <Button variant="outline" size="sm" className="mt-3" type="button">
                    Browse
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button type="submit" className="w-full">
                  Save Product
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Variants Section */}
        <Card className="mt-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Product Variants</CardTitle>
                <CardDescription>
                  Add size, weight, or flavor options for this product
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="hasVariants" className="text-xs text-muted-foreground">
                  Enable
                </Label>
                <Switch
                  id="hasVariants"
                  checked={hasVariants}
                  onCheckedChange={(checked) => {
                    setHasVariants(checked)
                    if (checked && variants.length === 0) {
                      setVariants([createEmptyVariant()])
                    }
                  }}
                />
              </div>
            </div>
          </CardHeader>

          {hasVariants && (
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Each variant can have its own SKU suffix, price adjustment (relative to base price), and stock level.
              </p>

              {/* Column headers */}
              <div className="hidden sm:grid grid-cols-[1fr_0.7fr_0.7fr_0.5fr_auto] gap-2 px-1">
                <Label className="text-[10px] text-muted-foreground uppercase">Name *</Label>
                <Label className="text-[10px] text-muted-foreground uppercase">SKU Suffix</Label>
                <Label className="text-[10px] text-muted-foreground uppercase">Price Adj. (Rp)</Label>
                <Label className="text-[10px] text-muted-foreground uppercase">Stock *</Label>
                <div className="w-8" />
              </div>

              {variants.map((variant, idx) => (
                <div
                  key={variant.id}
                  className="grid gap-2 sm:grid-cols-[1fr_0.7fr_0.7fr_0.5fr_auto] items-start border rounded-lg p-2 sm:border-0 sm:p-0"
                >
                  <div>
                    <Label className="sm:hidden text-[10px] text-muted-foreground">Name</Label>
                    <Input
                      placeholder={`e.g. ${idx === 0 ? "Small" : idx === 1 ? "Medium" : "Large"}`}
                      value={variant.name}
                      onChange={(e) => handleVariantChange(variant.id, "name", e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label className="sm:hidden text-[10px] text-muted-foreground">SKU Suffix</Label>
                    <Input
                      placeholder={`e.g. ${idx === 0 ? "SM" : idx === 1 ? "MD" : "LG"}`}
                      value={variant.skuSuffix}
                      onChange={(e) => handleVariantChange(variant.id, "skuSuffix", e.target.value)}
                      className="text-xs font-mono uppercase"
                    />
                  </div>
                  <div>
                    <Label className="sm:hidden text-[10px] text-muted-foreground">Price Adjustment</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={variant.priceAdjustment}
                      onChange={(e) => handleVariantChange(variant.id, "priceAdjustment", e.target.value)}
                      className="text-xs text-right"
                    />
                  </div>
                  <div>
                    <Label className="sm:hidden text-[10px] text-muted-foreground">Stock</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(variant.id, "stock", e.target.value)}
                      className="text-xs text-right"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive/60 hover:text-destructive"
                    onClick={() => removeVariant(variant.id)}
                    disabled={variants.length <= 1}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariant}
                className="w-full"
              >
                <Plus size={14} className="mr-1" />
                Add Variant
              </Button>

              {form.price && (
                <>
                  <Separator />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-semibold">Preview</p>
                    {variants
                      .filter((v) => v.name)
                      .map((v) => {
                        const adj = Number(v.priceAdjustment) || 0
                        const final = (Number(form.price) || 0) + adj
                        return (
                          <div key={v.id} className="flex justify-between">
                            <span>{v.name}{v.skuSuffix ? ` (${form.sku}-${v.skuSuffix})` : ""}</span>
                            <span className="font-medium">
                              Rp{final.toLocaleString()}
                              {adj !== 0 && (
                                <span className={adj > 0 ? " text-amber-600" : " text-emerald-600"}>
                                  {" "}({adj > 0 ? "+" : ""}{adj.toLocaleString()})
                                </span>
                              )}
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </>
              )}
            </CardContent>
          )}
        </Card>
      </form>
    </div>
  )
}
