import { useState } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, Plus, User, Heart, Calendar, Edit2, Trash2, 
  ChevronLeft, Baby, PersonStanding, Shield, AlertTriangle,
  Stethoscope, Clock, CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEnhancedFeaturesStore } from "@/stores/enhancedFeaturesStore";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format, differenceInYears } from "date-fns";
import { ar } from "date-fns/locale";
import { FamilyMember } from "@/types/enhancedFeatures";

const relationships = [
  { value: 'spouse', label: 'زوج/زوجة' },
  { value: 'child', label: 'ابن/ابنة' },
  { value: 'parent', label: 'والد/والدة' },
  { value: 'sibling', label: 'أخ/أخت' },
  { value: 'grandparent', label: 'جد/جدة' },
  { value: 'other', label: 'آخر' }
];

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const FamilyPage = () => {
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    relationship: '' as FamilyMember['relationship'] | '',
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    emergencyContact: ''
  });

  const { 
    familyMembers, 
    addFamilyMember, 
    updateFamilyMember, 
    removeFamilyMember,
    setSelectedFamilyMember 
  } = useEnhancedFeaturesStore();

  const { addNotification, userId } = useHealthcareStore();

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: '',
      dateOfBirth: '',
      gender: '',
      bloodType: '',
      allergies: '',
      chronicConditions: '',
      emergencyContact: ''
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('الرجاء إدخال اسم الفرد');
      return false;
    }
    if (!formData.relationship) {
      toast.error('الرجاء اختيار صلة القرابة');
      return false;
    }
    if (!formData.dateOfBirth) {
      toast.error('الرجاء إدخال تاريخ الميلاد');
      return false;
    }
    if (!formData.gender) {
      toast.error('الرجاء اختيار الجنس');
      return false;
    }
    return true;
  };

  const handleAddMember = () => {
    if (!validateForm()) return;

    const birthDate = new Date(formData.dateOfBirth);
    const age = differenceInYears(new Date(), birthDate);

    const newMember: FamilyMember = {
      id: `family-${Date.now()}`,
      headOfFamilyId: userId,
      name: formData.name,
      relationship: formData.relationship as FamilyMember['relationship'],
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as 'male' | 'female',
      bloodType: formData.bloodType || undefined,
      allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : undefined,
      chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(',').map(c => c.trim()) : undefined,
      emergencyContact: formData.emergencyContact || undefined,
      isAdult: age >= 18,
      hasFullAccess: false,
      medicalFileId: `file-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addFamilyMember(newMember);
    
    addNotification({
      id: `notif-${Date.now()}`,
      userId,
      type: 'general',
      title: 'تمت إضافة فرد جديد',
      message: `تمت إضافة ${newMember.name} إلى حساب العائلة`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    toast.success('تمت إضافة الفرد بنجاح');
    setAddDialogOpen(false);
    resetForm();
  };

  const handleUpdateMember = () => {
    if (!editingMember || !validateForm()) return;

    const birthDate = new Date(formData.dateOfBirth);
    const age = differenceInYears(new Date(), birthDate);

    updateFamilyMember(editingMember.id, {
      name: formData.name,
      relationship: formData.relationship as FamilyMember['relationship'],
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as 'male' | 'female',
      bloodType: formData.bloodType || undefined,
      allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : undefined,
      chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(',').map(c => c.trim()) : undefined,
      emergencyContact: formData.emergencyContact || undefined,
      isAdult: age >= 18
    });

    toast.success('تم تحديث البيانات بنجاح');
    setEditingMember(null);
    resetForm();
  };

  const handleDeleteMember = () => {
    if (!memberToDelete) return;
    
    const member = familyMembers.find(m => m.id === memberToDelete);
    removeFamilyMember(memberToDelete);
    
    addNotification({
      id: `notif-${Date.now()}`,
      userId,
      type: 'general',
      title: 'تم حذف فرد من العائلة',
      message: `تم حذف ${member?.name} من حساب العائلة`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    toast.success('تم حذف الفرد بنجاح');
    setDeleteConfirmOpen(false);
    setMemberToDelete(null);
  };

  const openEditDialog = (member: FamilyMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      relationship: member.relationship,
      dateOfBirth: member.dateOfBirth,
      gender: member.gender,
      bloodType: member.bloodType || '',
      allergies: member.allergies?.join(', ') || '',
      chronicConditions: member.chronicConditions?.join(', ') || '',
      emergencyContact: member.emergencyContact || ''
    });
  };

  const handleBookForMember = (memberId: string, memberName: string) => {
    setSelectedFamilyMember(memberId);
    toast.success(`تم اختيار ${memberName} للحجز`);
    navigate('/patient/search');
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship) {
      case 'child': return Baby;
      case 'parent':
      case 'grandparent': return PersonStanding;
      default: return User;
    }
  };

  const getAge = (dateOfBirth: string) => {
    return differenceInYears(new Date(), new Date(dateOfBirth));
  };

  return (
    <PatientLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">حساب العائلة</h1>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة فرد
          </Button>
        </div>

        {/* Info Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">إدارة صحة العائلة</h3>
                <p className="text-sm text-muted-foreground">
                  أضف أفراد عائلتك لإدارة مواعيدهم وسجلاتهم الطبية من حساب واحد
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Family Members List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">أفراد العائلة ({familyMembers.length})</h2>
          
          {familyMembers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">لا يوجد أفراد مضافين</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  أضف أفراد عائلتك لتتمكن من إدارة مواعيدهم وسجلاتهم الطبية
                </p>
                <Button onClick={() => setAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة فرد
                </Button>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence>
              {familyMembers.map((member, index) => {
                const RelIcon = getRelationshipIcon(member.relationship);
                const age = getAge(member.dateOfBirth);
                
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-14 w-14 border-2 border-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary text-lg">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{member.name}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {relationships.find(r => r.value === member.relationship)?.label}
                              </Badge>
                              {!member.isAdult && (
                                <Badge className="bg-blue-100 text-blue-700 text-xs">قاصر</Badge>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {age} سنة
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {member.gender === 'male' ? 'ذكر' : 'أنثى'}
                              </span>
                              {member.bloodType && (
                                <span className="flex items-center gap-1">
                                  <Heart className="h-3 w-3" />
                                  {member.bloodType}
                                </span>
                              )}
                            </div>

                            {member.chronicConditions && member.chronicConditions.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {member.chronicConditions.map((condition, i) => (
                                  <Badge key={i} variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                    {condition}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleBookForMember(member.id, member.name)}
                              >
                                <Stethoscope className="h-4 w-4 ml-2" />
                                حجز موعد
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openEditDialog(member)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  setMemberToDelete(member.id);
                                  setDeleteConfirmOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Add/Edit Member Dialog */}
      <Dialog 
        open={addDialogOpen || !!editingMember} 
        onOpenChange={(open) => {
          if (!open) {
            setAddDialogOpen(false);
            setEditingMember(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? 'تعديل بيانات الفرد' : 'إضافة فرد جديد'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>الاسم الكامل *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="أدخل الاسم الكامل"
              />
            </div>

            <div>
              <Label>صلة القرابة *</Label>
              <Select
                value={formData.relationship}
                onValueChange={(value) => setFormData({ ...formData, relationship: value as FamilyMember['relationship'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر صلة القرابة" />
                </SelectTrigger>
                <SelectContent>
                  {relationships.map((rel) => (
                    <SelectItem key={rel.value} value={rel.value}>
                      {rel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>تاريخ الميلاد *</Label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>

            <div>
              <Label>الجنس *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value as 'male' | 'female' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الجنس" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">ذكر</SelectItem>
                  <SelectItem value="female">أنثى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>فصيلة الدم</Label>
              <Select
                value={formData.bloodType}
                onValueChange={(value) => setFormData({ ...formData, bloodType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر فصيلة الدم" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>الحساسيات (مفصولة بفاصلة)</Label>
              <Input
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="مثال: بنسلين، فول سوداني"
              />
            </div>

            <div>
              <Label>الأمراض المزمنة (مفصولة بفاصلة)</Label>
              <Input
                value={formData.chronicConditions}
                onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                placeholder="مثال: سكري، ضغط"
              />
            </div>

            <div>
              <Label>رقم الطوارئ</Label>
              <Input
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="091XXXXXXX"
                dir="ltr"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setAddDialogOpen(false);
                setEditingMember(null);
                resetForm();
              }}
            >
              إلغاء
            </Button>
            <Button onClick={editingMember ? handleUpdateMember : handleAddMember}>
              {editingMember ? 'حفظ التغييرات' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              تأكيد الحذف
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            هل أنت متأكد من حذف هذا الفرد من حساب العائلة؟ سيتم حذف جميع البيانات المرتبطة به.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteMember}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PatientLayout>
  );
};

export default FamilyPage;