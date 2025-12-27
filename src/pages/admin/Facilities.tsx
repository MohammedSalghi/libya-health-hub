import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Plus, Building2, TestTube, Pill, MapPin,
  Phone, Star, MoreVertical, Edit, Trash2, Eye
} from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const hospitals = [
  { id: 1, name: "مستشفى طرابلس المركزي", address: "طرابلس، شارع الجمهورية", phone: "+218 21 123 4567", rating: 4.5, doctors: 45, status: "active" },
  { id: 2, name: "مستشفى بنغازي الطبي", address: "بنغازي، شارع النصر", phone: "+218 61 234 5678", rating: 4.3, doctors: 38, status: "active" },
];

const labs = [
  { id: 1, name: "مختبرات الأمل", address: "طرابلس", phone: "+218 91 111 2222", rating: 4.7, status: "active" },
  { id: 2, name: "مختبر الشفاء", address: "بنغازي", phone: "+218 92 222 3333", rating: 4.5, status: "pending" },
];

const pharmacies = [
  { id: 1, name: "صيدلية النور", address: "طرابلس", phone: "+218 91 333 4444", rating: 4.8, status: "active" },
  { id: 2, name: "صيدلية الشفاء", address: "مصراتة", phone: "+218 92 444 5555", rating: 4.6, status: "active" },
];

const AdminFacilities = () => {
  const [activeTab, setActiveTab] = useState("hospitals");
  const [searchQuery, setSearchQuery] = useState("");

  const renderFacilityCard = (facility: any, type: string) => (
    <Card key={facility.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-full ${
              type === "hospital" ? "bg-blue-100" :
              type === "lab" ? "bg-green-100" : "bg-purple-100"
            }`}>
              {type === "hospital" ? <Building2 className="h-6 w-6 text-blue-600" /> :
               type === "lab" ? <TestTube className="h-6 w-6 text-green-600" /> :
               <Pill className="h-6 w-6 text-purple-600" />}
            </div>
            <div>
              <h3 className="font-semibold">{facility.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                {facility.address}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Phone className="h-3 w-3" />
                {facility.phone}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{facility.rating}</span>
                </div>
                {facility.doctors && (
                  <span className="text-sm text-muted-foreground">
                    • {facility.doctors} طبيب
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              facility.status === "active" 
                ? "bg-green-100 text-green-700" 
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {facility.status === "active" ? "نشط" : "قيد المراجعة"}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 ml-2" />
                  عرض التفاصيل
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 ml-2" />
                  تعديل
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة المنشآت</h1>
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          إضافة منشأة
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="ابحث عن منشأة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="hospitals" className="gap-2">
            <Building2 className="h-4 w-4" />
            المستشفيات ({hospitals.length})
          </TabsTrigger>
          <TabsTrigger value="labs" className="gap-2">
            <TestTube className="h-4 w-4" />
            المختبرات ({labs.length})
          </TabsTrigger>
          <TabsTrigger value="pharmacies" className="gap-2">
            <Pill className="h-4 w-4" />
            الصيدليات ({pharmacies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hospitals" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospitals.map((h, i) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {renderFacilityCard(h, "hospital")}
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="labs" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {labs.map((l, i) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {renderFacilityCard(l, "lab")}
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pharmacies" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pharmacies.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {renderFacilityCard(p, "pharmacy")}
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFacilities;
