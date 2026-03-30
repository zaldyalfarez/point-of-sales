import { useState } from "react"
import { FloppyDisk, Storefront, Receipt, Percent } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useStoreSettings } from "@/contexts/StoreSettingsContext"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function SettingsPage() {
  const { settings, updateSettings } = useStoreSettings()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Receipt preview amount
  const previewSubtotal = 185000
  const previewTax = settings.taxEnabled ? Math.round(previewSubtotal * settings.taxRate) : 0
  const previewTotal = previewSubtotal + previewTax

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your store settings, tax configuration, and receipt customization
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="general" className="gap-1.5">
            <Storefront size={14} />
            General
          </TabsTrigger>
          <TabsTrigger value="tax" className="gap-1.5">
            <Percent size={14} />
            Tax
          </TabsTrigger>
          <TabsTrigger value="receipt" className="gap-1.5">
            <Receipt size={14} />
            Receipt
          </TabsTrigger>
        </TabsList>

        {/* ── General Tab ──────────────────────────────────────────── */}
        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Update your store details displayed across the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={settings.storeName}
                  onChange={(e) => updateSettings({ storeName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Address</Label>
                <Input
                  id="storeAddress"
                  value={settings.storeAddress}
                  onChange={(e) => updateSettings({ storeAddress: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Phone</Label>
                  <Input
                    id="storePhone"
                    value={settings.storePhone}
                    onChange={(e) => updateSettings({ storePhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email</Label>
                  <Input
                    id="storeEmail"
                    value={settings.storeEmail}
                    onChange={(e) => updateSettings({ storeEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" value={settings.currency} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" value={settings.timezone} disabled />
                </div>
              </div>
              <Separator />
              <Button onClick={handleSave}>
                <FloppyDisk size={14} className="mr-1" />
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tax Tab ──────────────────────────────────────────────── */}
        <TabsContent value="tax" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tax Configuration</CardTitle>
                <CardDescription>Configure sales tax settings for all transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="text-sm font-medium">Enable Tax</Label>
                    <p className="text-xs text-muted-foreground">Apply tax to all transactions</p>
                  </div>
                  <Switch
                    checked={settings.taxEnabled}
                    onCheckedChange={(checked) => updateSettings({ taxEnabled: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={Math.round(settings.taxRate * 100)}
                    onChange={(e) => updateSettings({ taxRate: Number(e.target.value) / 100 })}
                    disabled={!settings.taxEnabled}
                  />
                  <p className="text-xs text-muted-foreground">
                    Standard PPN (Value Added Tax) in Indonesia is 11%
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Tax Label</Label>
                  <Input
                    value={settings.taxLabel}
                    onChange={(e) => updateSettings({ taxLabel: e.target.value })}
                    placeholder="e.g. PPN, VAT, GST"
                    disabled={!settings.taxEnabled}
                  />
                  <p className="text-xs text-muted-foreground">
                    This label appears on receipts and invoices
                  </p>
                </div>

                <Separator />
                <Button onClick={handleSave}>
                  <FloppyDisk size={14} className="mr-1" />
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Tax Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How tax appears on a sample order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(previewSubtotal)}</span>
                  </div>
                  {settings.taxEnabled && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {settings.taxLabel} ({Math.round(settings.taxRate * 100)}%)
                      </span>
                      <span>{formatCurrency(previewTax)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{formatCurrency(previewTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Receipt Tab ──────────────────────────────────────────── */}
        <TabsContent value="receipt" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Receipt Customization</CardTitle>
                <CardDescription>Customize what appears on your printed receipts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="text-sm font-medium">Show Logo</Label>
                    <p className="text-xs text-muted-foreground">Display store logo on receipt</p>
                  </div>
                  <Switch
                    checked={settings.showLogo}
                    onCheckedChange={(checked) => updateSettings({ showLogo: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Header Message</Label>
                  <Textarea
                    value={settings.receiptHeader}
                    onChange={(e) => updateSettings({ receiptHeader: e.target.value })}
                    placeholder="Displayed below store name"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Footer Message</Label>
                  <Textarea
                    value={settings.receiptFooter}
                    onChange={(e) => updateSettings({ receiptFooter: e.target.value })}
                    placeholder="Displayed at the bottom of receipt"
                    rows={2}
                  />
                </div>

                <Separator />
                <Button onClick={handleSave}>
                  <FloppyDisk size={14} className="mr-1" />
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Receipt Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Receipt Preview</CardTitle>
                <CardDescription>Live preview of your receipt</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-white dark:bg-zinc-950 p-5 text-xs space-y-3 font-mono mx-auto max-w-64">
                  {/* Store Header */}
                  <div className="text-center">
                    {settings.showLogo && (
                      <div className="mx-auto mb-1.5 flex size-8 items-center justify-center rounded-full bg-primary/10">
                        <Storefront size={16} className="text-primary" />
                      </div>
                    )}
                    <p className="font-bold text-sm">{settings.storeName}</p>
                    <p className="text-[10px] text-muted-foreground">{settings.storeAddress}</p>
                    <p className="text-[10px] text-muted-foreground">{settings.storePhone}</p>
                    {settings.receiptHeader && (
                      <p className="mt-1 text-[10px] italic text-muted-foreground">{settings.receiptHeader}</p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Order ID</span>
                    <span>TXN-XXXXX</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Date</span>
                    <span>{new Date().toLocaleDateString("id-ID")}</span>
                  </div>

                  <Separator />

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span>Arabica Coffee × 1</span>
                      <span>{formatCurrency(previewSubtotal)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(previewSubtotal)}</span>
                    </div>
                    {settings.taxEnabled && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{settings.taxLabel} ({Math.round(settings.taxRate * 100)}%)</span>
                        <span>{formatCurrency(previewTax)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-xs">
                      <span>Total</span>
                      <span>{formatCurrency(previewTotal)}</span>
                    </div>
                  </div>

                  {settings.receiptFooter && (
                    <>
                      <Separator />
                      <p className="text-center text-[9px] text-muted-foreground italic leading-relaxed">
                        {settings.receiptFooter}
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
