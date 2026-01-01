import { useState, useMemo } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, Plus, User, Heart, Calendar, Edit2, Trash2, 
  ChevronLeft, Baby, PersonStanding, Shield, AlertTriangle,
  Stethoscope, Clock, CheckCircle, Pill, FileText, Activity,
  Bell, MapPin, Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEnhancedFeaturesStore } from "@/stores/enhancedFeaturesStore";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format, differenceInYears } from "date-fns";
import { ar } from "date-fns/locale";
import { FamilyMember } from "@/types/enhancedFeatures";
import { libyanClinics } from "@/data/libyaHealthcareData";

const relationships = [
  { value: 'spouse', label: 'زوج/زوجة', icon: Heart },
  { value: 'child', label: 'ابن/ابنة', icon: Baby },
  { value: 'parent', label: 'والد/والدة', icon: PersonStanding },
  { value: 'sibling', label: 'أخ/أخت', icon: Users },
  { value: 'grandparent', label: 'جد/جدة', icon: PersonStanding },
  { value: 'other', label: 'آخر', icon: User }
];

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const FamilyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("members");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [selectedMemberDetails, setSelectedMemberDetails] = useState<FamilyMember | null>(null);

  // Form state with extended fields
  const [formData, setFormData] = useState({
    name: '',
    relationship: '' as FamilyMember['relationship'] | '',
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    currentMedications: '',
    emergencyContact: '',
    nationalId: '',
    notes: ''
  });

  const { 
    familyMembers, 
    familyBookings,
    addFamilyMember, 
    updateFamilyMember, 
    removeFamilyMember,
    setSelectedFamilyMember,
    medicationReminders,
    followUps
  } = useEnhancedFeaturesStore();

  const { addNotification, userId, appointments } = useHealthcareStore();

  // حساب البيانات الموحدة لكل عضو
  const memberStats = useMemo(() => {
    return familyMembers.map(member => {
      const memberReminders = medicationReminders.filter(r => r.familyMemberId === member.id);
      const memberFollowUps = followUps.filter(f => f.patientId === member.id);
      const pendingFollowUps = memberFollowUps.filter(f => f.status === 'pending_response');
      const lowStockMeds = memberReminders.filter(r => r.isActive && r.remainingQuantity <= r.refillThreshold);
      
      return {
        member,
        totalMedications: memberReminders.length,
        lowStockMeds: lowStockMeds.length,
        pendingFollowUps: pendingFollowUps.length,
        hasAlerts: lowStockMeds.length > 0 || pendingFollowUps.length > 0
      };
    });
  }, [familyMembers, medicationReminders, followUps]);

  // التنبيهات الفعّالة
  const activeAlerts = useMemo(() => {
    const alerts: { memberId: string; memberName: string; type: string; message: string }[] = [];
    
    memberStats.forEach(stat => {
      if (stat.lowStockMeds > 0) {
        alerts.push({
          memberId: stat.member.id,
          memberName: stat.member.name,
          type: 'medication',
          message: `${stat.lowStockMeds} دواء يحتاج إعادة تعبئة`
        });
      }
      if (stat.pendingFollowUps > 0) {
        alerts.push({
          memberId: stat.member.id,
          memberName: stat.member.name,
          type: 'followup',
          message: `${stat.pendingFollowUps} متابعة تحتاج ردك`
        });
      }
    });
    
    return alerts;
  }, [memberStats]);

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: '',
      dateOfBirth: '',
      gender: '',
      bloodType: '',
      allergies: '',
      chronicConditions: '',
      currentMedications: '',
      emergencyContact: '',
      nationalId: '',
      notes: ''
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('الرجاء إدخال اسم الفرد');
      return false;
    }
    if (formData.name.trim().length < 3) {
      toast.error('الاسم يجب أن يكون 3 أحرف على الأقل');
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
    if (new Date(formData.dateOfBirth) > new Date()) {
      toast.error('تاريخ الميلاد غير صحيح');
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

    // التحقق من عدم وجود تكرار
    const exists = familyMembers.some(
      m => m.name.trim().toLowerCase() === formData.name.trim().toLowerCase()
    );
    if (exists) {
      toast.error('هذا الفرد موجود بالفعل في العائلة');
      return;
    }

    const birthDate = new Date(formData.dateOfBirth);
    const age = differenceInYears(new Date(), birthDate);

    const newMember: FamilyMember = {
      id: `family-${Date.now()}`,
      headOfFamilyId: userId,
      name: formData.name.trim(),
      relationship: formData.relationship as FamilyMember['relationship'],
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as 'male' | 'female',
      bloodType: formData.bloodType || undefined,
      allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()).filter(Boolean) : undefined,
      chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(',').map(c => c.trim()).filter(Boolean) : undefined,
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
      message: `تمت إضافة ${newMember.name} إلى حساب العائلة. يمكنك الآن حجز المواعيد وإدارة ملفه الطبي.`,
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
      name: formData.name.trim(),
      relationship: formData.relationship as FamilyMember['relationship'],
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as 'male' | 'female',
      bloodType: formData.bloodType || undefined,
      allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()).filter(Boolean) : undefined,
      chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(',').map(c => c.trim()).filter(Boolean) : undefined,
      emergencyContact: formData.emergencyContact || undefined,
      isAdult: age >= 18
    });

    addNotification({
      id: `notif-${Date.now()}`,
      userId,
      type: 'general',
      title: 'تم تحديث بيانات الفرد',
      message: `تم تحديث بيانات ${formData.name} بنجاح`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    toast.success('تم تحديث البيانات بنجاح');
    setEditingMember(null);
    resetForm();
  };

  const handleDeleteMember = () => {
    if (!memberToDelete) return;
    
    const member = familyMembers.find(m => m.id === memberToDelete);
    
    // التحقق من عدم وجود مواعيد نشطة
    const hasActiveAppointments = appointments.some(
      a => a.patientId === memberToDelete && a.status === 'confirmed'
    );
    
    if (hasActiveAppointments) {
      toast.error('لا يمكن حذف فرد لديه مواعيد نشطة');
      setDeleteConfirmOpen(false);
      return;
    }

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
      currentMedications: '',
      emergencyContact: member.emergencyContact || '',
      nationalId: '',
      notes: ''
    });
  };

  const handleBookForMember = (memberId: string, memberName: string) => {
    setSelectedFamilyMember(memberId);
    toast.success(`تم اختيار ${memberName} للحجز`);
    navigate('/patient/search');
  };

  const getRelationshipIcon = (relationship: string) => {
    const rel = relationships.find(r => r.value === relationship);
    return rel?.icon || User;
  };

  const getAge = (dateOfBirth: string) => {
    return differenceInYears(new Date(), new Date(dateOfBirth));
  };

  const MemberCard = ({ stat }: { stat: typeof memberStats[0] }) => {
    const member = stat.member;
    const RelIcon = getRelationshipIcon(member.relationship);
    const age = getAge(member.dateOfBirth);

    return (
      <Card className={stat.hasAlerts ? 'border-yellow-300 bg-yellow-50/50' : ''}>
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
                {stat.hasAlerts && (
                  <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                    <Bell className="h-3 w-3 ml-1" />
                    تنبيهات
                  </Badge>
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

              {/* الحالات الصحية */}
              {member.chronicConditions && member.chronicConditions.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {member.chronicConditions.map((condition, i) => (
                    <Badge key={i} variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                      {condition}
                    </Badge>
                  ))}
                </div>
              )}

              {/* الحساسية */}
              {member.allergies && member.allergies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {member.allergies.map((allergy, i) => (
                    <Badge key={i} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                      <AlertTriangle className="h-3 w-3 ml-1" />
                      {allergy}
                    </Badge>
                  ))}
                </div>
              )}

              {/* إحصائيات سريعة */}
              <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                {stat.totalMedications > 0 && (
                  <span className="flex items-center gap-1">
                    <Pill className="h-3 w-3" />
                    {stat.totalMedications} دواء
                  </span>
                )}
                {stat.lowStockMeds > 0 && (
                  <span className="flex items-center gap-1 text-destructive">
                    <AlertTriangle className="h-3 w-3" />
                    {stat.lowStockMeds} يحتاج تعبئة
                  </span>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
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
                  onClick={() => setSelectedMemberDetails(member)}
                >
                  <FileText className="h-4 w-4 ml-2" />
                  الملف الطبي
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
    );
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

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert className="border-yellow-200 bg-yellow-50">
              <Bell className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <div className="font-medium mb-1">تنبيهات العائلة ({activeAlerts.length})</div>
                <ul className="space-y-1 text-sm">
                  {activeAlerts.slice(0, 3).map((alert, i) => (
                    <li key={i}>
                      <span className="font-medium">{alert.memberName}:</span> {alert.message}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

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
                  أضف أفراد عائلتك لإدارة مواعيدهم، أدويتهم، وسجلاتهم الطبية من حساب واحد. 
                  يمكنك الحجز في العيادات والمستشفيات الليبية نيابة عنهم.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="members">
              أفراد العائلة ({familyMembers.length})
            </TabsTrigger>
            <TabsTrigger value="clinics">
              العيادات الشريكة
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4 mt-4">
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
                {memberStats.map((stat, index) => (
                  <motion.div
                    key={stat.member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MemberCard stat={stat} />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </TabsContent>

          {/* Libyan Clinics Tab */}
          <TabsContent value="clinics" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              العيادات والمستشفيات الشريكة في ليبيا التي تدعم حجز المواعيد لأفراد العائلة
            </p>
            {libyanClinics.map((clinic, index) => (
              <motion.div
                key={clinic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{clinic.name}</h3>
                          <Badge variant="secondary">{clinic.city}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3" />
                          {clinic.address}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Phone className="h-3 w-3" />
                          {clinic.phone}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {clinic.specialties.slice(0, 3).map((spec, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1 text-yellow-500 mb-2">
                          <span className="font-semibold">{clinic.rating}</span>
                          <span>⭐</span>
                        </div>
                        {clinic.offersHomeVisit && (
                          <Badge className="bg-green-100 text-green-700">
                            زيارة منزلية
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
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
                max={new Date().toISOString().split('T')[0]}
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
              <Label>الحساسية (افصل بفاصلة)</Label>
              <Input
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="مثال: بنسلين، حليب"
              />
              <p className="text-xs text-muted-foreground mt-1">
                مهم للسلامة: سيتم تنبيهك عند وصف أدوية قد تسبب حساسية
              </p>
            </div>

            <div>
              <Label>الأمراض المزمنة (افصل بفاصلة)</Label>
              <Input
                value={formData.chronicConditions}
                onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                placeholder="مثال: سكري، ضغط"
              />
            </div>

            <div>
              <Label>رقم التواصل للطوارئ</Label>
              <Input
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="+218 91 XXX XXXX"
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
              {editingMember ? 'حفظ التعديلات' : 'إضافة الفرد'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              تأكيد الحذف
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            هل أنت متأكد من حذف هذا الفرد من حساب العائلة؟ 
            سيتم حذف جميع بياناته الصحية المرتبطة.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteMember}>
              نعم، احذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Member Details Dialog */}
      <Dialog open={!!selectedMemberDetails} onOpenChange={() => setSelectedMemberDetails(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>الملف الطبي - {selectedMemberDetails?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedMemberDetails && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    المعلومات الأساسية
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">العمر:</span> {getAge(selectedMemberDetails.dateOfBirth)} سنة</div>
                    <div><span className="text-muted-foreground">الجنس:</span> {selectedMemberDetails.gender === 'male' ? 'ذكر' : 'أنثى'}</div>
                    <div><span className="text-muted-foreground">فصيلة الدم:</span> {selectedMemberDetails.bloodType || 'غير محدد'}</div>
                    <div><span className="text-muted-foreground">القرابة:</span> {relationships.find(r => r.value === selectedMemberDetails.relationship)?.label}</div>
                  </div>
                </CardContent>
              </Card>

              {selectedMemberDetails.allergies && selectedMemberDetails.allergies.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-4 w-4" />
                      الحساسية
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedMemberDetails.allergies.map((a, i) => (
                        <Badge key={i} variant="destructive">{a}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedMemberDetails.chronicConditions && selectedMemberDetails.chronicConditions.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      الأمراض المزمنة
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedMemberDetails.chronicConditions.map((c, i) => (
                        <Badge key={i} variant="outline" className="bg-yellow-50">{c}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => {
                  setSelectedMemberDetails(null);
                  handleBookForMember(selectedMemberDetails.id, selectedMemberDetails.name);
                }}>
                  <Stethoscope className="h-4 w-4 ml-2" />
                  حجز موعد
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => {
                  setSelectedMemberDetails(null);
                  navigate('/patient/medication-reminder');
                }}>
                  <Pill className="h-4 w-4 ml-2" />
                  الأدوية
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PatientLayout>
  );
};

export default FamilyPage;
