import { useState, useMemo } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, MapPin, Upload, ShoppingCart, Truck, 
  Package, Clock, CheckCircle, Star, Plus, Minus, X,
  AlertCircle, Pill
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { pharmacies, medications } from "@/data/mockData";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const PharmacyPage = () => {
  const [activeTab, setActiveTab] = useState("pharmacies");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    pharmacyOrders,
    addPharmacyOrder,
    walletBalance,
    updateWalletBalance,
    addTransaction,
    addNotification,
    userId,
    addPendingRating
  } = useHealthcareStore();

  // Calculate cart totals
  const cartDetails = useMemo(() => {
    const items = cart.map(item => {
      const medication = medications.find(m => m.id === item.medicationId);
      return medication ? { ...medication, quantity: item.quantity } : null;
    }).filter(Boolean);

    const subtotal = items.reduce((sum, item) => sum + (item!.price * item!.quantity), 0);
    const deliveryFee = selectedPharmacy 
      ? pharmacies.find(p => p.id === selectedPharmacy)?.deliveryFee || 10 
      : 10;
    const serviceFee = 5;
    const total = subtotal + deliveryFee + serviceFee;

    return { items, subtotal, deliveryFee, serviceFee, total };
  }, [cart, selectedPharmacy]);

  // Filter medications
  const filteredMedications = useMemo(() => {
    return medications.filter(med => 
      med.name.includes(searchQuery) || 
      med.nameEn?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleAddToCart = (medicationId: string) => {
    const med = medications.find(m => m.id === medicationId);
    if (med?.requiresPrescription) {
      toast.info("هذا الدواء يتطلب وصفة طبية");
    }
    addToCart(medicationId);
    toast.success("تمت الإضافة للسلة");
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast.error("السلة فارغة");
      return;
    }

    if (walletBalance < cartDetails.total) {
      toast.error("رصيد المحفظة غير كافٍ");
      return;
    }

    const pharmacy = pharmacies.find(p => p.id === selectedPharmacy) || pharmacies[0];
    
    const order = {
      id: `order-${Date.now()}`,
      patientId: userId,
      pharmacyId: pharmacy.id,
      pharmacy: pharmacy,
      items: cart.map(item => {
        const med = medications.find(m => m.id === item.medicationId)!;
        return {
          medicationId: item.medicationId,
          medication: med,
          quantity: item.quantity,
          price: med?.price || 0
        };
      }),
      status: 'pending' as const,
      deliveryType: 'delivery' as const,
      deliveryAddress: { lat: 32.8872, lng: 13.1913, address: 'طرابلس، ليبيا', city: 'طرابلس' },
      fees: [{ type: 'platform' as const, amount: cartDetails.serviceFee, currency: 'د.ل' }],
      subtotal: cartDetails.subtotal,
      deliveryFee: cartDetails.deliveryFee,
      totalAmount: cartDetails.total,
      paymentMethod: 'wallet' as const,
      paymentStatus: 'paid' as const,
      ratingPromptSent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addPharmacyOrder(order);
    updateWalletBalance(-cartDetails.total);
    addTransaction({
      id: `trans-${Date.now()}`,
      userId,
      type: 'debit',
      amount: cartDetails.total,
      description: `طلب صيدلية - ${pharmacy.name}`,
      status: 'completed',
      createdAt: new Date().toISOString()
    });

    addNotification({
      id: `notif-${Date.now()}`,
      userId,
      type: 'delivery_update',
      title: 'تم استلام طلبك',
      message: `طلبك من ${pharmacy.name} قيد المعالجة`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    clearCart();
    setIsCartOpen(false);
    toast.success("تم إرسال الطلب بنجاح!");

    // Simulate order completion and rating request after 3 seconds
    setTimeout(() => {
      addPendingRating({
        serviceType: 'pharmacy',
        serviceId: pharmacy.id,
        serviceName: pharmacy.name
      });
      addNotification({
        id: `notif-rating-${Date.now()}`,
        userId,
        type: 'rating_request',
        title: 'كيف كانت تجربتك؟',
        message: `قيم تجربتك مع ${pharmacy.name}`,
        data: { serviceType: 'pharmacy', serviceId: pharmacy.id },
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }, 3000);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "delivered":
        return { label: "تم التوصيل", color: "bg-green-100 text-green-700", icon: CheckCircle };
      case "shipping":
        return { label: "جاري التوصيل", color: "bg-blue-100 text-blue-700", icon: Truck };
      case "processing":
        return { label: "قيد التجهيز", color: "bg-orange-100 text-orange-700", icon: Package };
      default:
        return { label: "قيد المعالجة", color: "bg-yellow-100 text-yellow-700", icon: Clock };
    }
  };

  return (
    <PatientLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">الصيدلية</h1>
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>سلة التسوق</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">السلة فارغة</p>
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                      {cartDetails.items.map((item) => (
                        <Card key={item!.id} className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item!.name}</p>
                              <p className="text-primary font-bold">{item!.price} د.ل</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-7 w-7"
                                onClick={() => {
                                  if (item!.quantity <= 1) {
                                    removeFromCart(item!.id);
                                  } else {
                                    updateCartQuantity(item!.id, item!.quantity - 1);
                                  }
                                }}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center">{item!.quantity}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-7 w-7"
                                onClick={() => updateCartQuantity(item!.id, item!.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-destructive"
                                onClick={() => removeFromCart(item!.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">المجموع الفرعي</span>
                        <span>{cartDetails.subtotal} د.ل</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">رسوم التوصيل</span>
                        <span>{cartDetails.deliveryFee} د.ل</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">رسوم الخدمة</span>
                        <span>{cartDetails.serviceFee} د.ل</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>الإجمالي</span>
                        <span className="text-primary">{cartDetails.total} د.ل</span>
                      </div>
                    </div>

                    {/* Wallet Balance */}
                    <div className="bg-muted p-3 rounded-lg flex justify-between items-center">
                      <span className="text-sm">رصيد المحفظة</span>
                      <span className={`font-bold ${walletBalance >= cartDetails.total ? 'text-green-600' : 'text-destructive'}`}>
                        {walletBalance} د.ل
                      </span>
                    </div>

                    {walletBalance < cartDetails.total && (
                      <div className="flex items-center gap-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>رصيد المحفظة غير كافٍ</span>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handlePlaceOrder}
                      disabled={walletBalance < cartDetails.total}
                    >
                      <Truck className="w-5 h-5 ml-2" />
                      تأكيد الطلب
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="ابحث عن دواء..." 
            className="pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Upload Prescription */}
        <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <Button variant="ghost" className="w-full flex flex-col gap-2 h-auto py-4">
              <Upload className="h-8 w-8 text-primary" />
              <span className="text-primary font-medium">رفع وصفة طبية</span>
              <span className="text-sm text-muted-foreground">اضغط لرفع صورة الوصفة</span>
            </Button>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="pharmacies">الصيدليات</TabsTrigger>
            <TabsTrigger value="medications">الأدوية</TabsTrigger>
            <TabsTrigger value="orders">طلباتي</TabsTrigger>
          </TabsList>

          <TabsContent value="pharmacies" className="space-y-4 mt-4">
            {pharmacies.map((pharmacy, index) => (
              <motion.div
                key={pharmacy.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedPharmacy === pharmacy.id 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedPharmacy(pharmacy.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Pill className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{pharmacy.name}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {pharmacy.location.address}
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {pharmacy.rating}
                            </span>
                          </div>
                          {pharmacy.offersDelivery && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Truck className="h-3 w-3" />
                              توصيل: {pharmacy.deliveryFee} د.ل • {pharmacy.deliveryTime}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        pharmacy.isOpen 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {pharmacy.isOpen ? "مفتوح" : "مغلق"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="medications" className="space-y-4 mt-4">
            {filteredMedications.map((med, index) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{med.name}</span>
                        {med.requiresPrescription && (
                          <Badge variant="outline" className="text-xs">وصفة مطلوبة</Badge>
                        )}
                      </div>
                      {med.nameEn && (
                        <p className="text-xs text-muted-foreground">{med.nameEn}</p>
                      )}
                      <div className="text-primary font-bold mt-1">{med.price} د.ل</div>
                    </div>
                    {med.inStock ? (
                      <Button 
                        size="sm"
                        onClick={() => handleAddToCart(med.id)}
                      >
                        <Plus className="h-4 w-4 ml-1" />
                        أضف
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">غير متوفر</span>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4 mt-4">
            <AnimatePresence>
              {pharmacyOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">لا توجد طلبات</p>
                </div>
              ) : (
                pharmacyOrders.map((order, index) => {
                  const statusInfo = getStatusInfo(order.status);
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-medium">{order.pharmacy?.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString('ar-LY')}
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusInfo.color}`}>
                              <statusInfo.icon className="h-3 w-3" />
                              {statusInfo.label}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{order.items.length} منتجات</span>
                            <span className="font-bold text-foreground">{order.totalAmount} د.ل</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </PatientLayout>
  );
};

export default PharmacyPage;
