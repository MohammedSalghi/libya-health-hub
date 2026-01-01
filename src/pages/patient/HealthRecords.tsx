import { useState } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, Download, Share2, Calendar, Pill, TestTube, 
  Heart, Activity, Droplets, ChevronLeft, Plus, Shield,
  Eye, Clock, CheckCircle, XCircle, AlertTriangle, History,
  Lock, Unlock, User, Building
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEnhancedFeaturesStore } from "@/stores/enhancedFeaturesStore";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const HealthRecordsPage = () => {
  const [activeTab, setActiveTab] = useState("records");
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const { 
    medicalRecords, 
    accessRequests, 
    auditLogs,
    chronicConditions,
    approveAccess,
    denyAccess,
    addAuditLog
  } = useEnhancedFeaturesStore();

  const { addNotification, userId } = useHealthcareStore();

  // Filter records by type
  const visitRecords = medicalRecords.filter(r => r.type === 'visit');
  const labResults = medicalRecords.filter(r => r.type === 'lab_result');
  const prescriptions = medicalRecords.filter(r => r.type === 'prescription');
  const pendingRequests = accessRequests.filter(r => r.status === 'pending');

  const handleApproveAccess = (requestId: string) => {
    const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
    approveAccess(requestId, validUntil);
    
    addNotification({
      id: `notif-${Date.now()}`,
      userId,
      type: 'general',
      title: 'تمت الموافقة على طلب الوصول',
      message: 'تم منح صلاحية الوصول للسجل الطبي',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    toast.success('تمت الموافقة على طلب الوصول');
    setAccessDialogOpen(false);
  };

  const handleDenyAccess = (requestId: string) => {
    denyAccess(requestId);
    
    addNotification({
      id: `notif-${Date.now()}`,
      userId,
      type: 'general',
      title: 'تم رفض طلب الوصول',
      message: 'تم رفض طلب الوصول للسجل الطبي',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    toast.info('تم رفض طلب الوصول');
    setAccessDialogOpen(false);
  };

  const handleDownloadPDF = () => {
    // Log the download action
    addAuditLog({
      id: `log-${Date.now()}`,
      patientId: userId,
      action: 'download',
      entityType: 'record',
      entityId: 'full-record',
      performedBy: userId,
      performerType: 'patient',
      details: 'تم تحميل السجل الطبي الكامل',
      timestamp: new Date().toISOString()
    });

    toast.success('جاري تحميل السجل الطبي...');
  };

  const handleShareRecord = () => {
    addAuditLog({
      id: `log-${Date.now()}`,
      patientId: userId,
      action: 'share',
      entityType: 'record',
      entityId: 'full-record',
      performedBy: userId,
      performerType: 'patient',
      details: 'تم مشاركة السجل الطبي',
      timestamp: new Date().toISOString()
    });

    toast.success('تم نسخ رابط المشاركة');
    setShareDialogOpen(false);
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'visit': return Calendar;
      case 'lab_result': return TestTube;
      case 'prescription': return Pill;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-yellow-100 text-yellow-700';
      case 'managed': return 'bg-green-100 text-green-700';
      case 'resolved': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <PatientLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">السجل الصحي</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setAuditDialogOpen(true)}
            >
              <History className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShareDialogOpen(true)}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Access Requests Alert */}
        {pendingRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-yellow-800">
                        {pendingRequests.length} طلب وصول جديد
                      </p>
                      <p className="text-sm text-yellow-600">
                        يوجد طلبات وصول للسجل الطبي تحتاج موافقتك
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setAccessDialogOpen(true)}
                  >
                    عرض
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">ملخص السجل</h2>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 ml-2" />
                  تحميل PDF
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{visitRecords.length}</div>
                  <div className="text-sm text-muted-foreground">زيارة</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{labResults.length}</div>
                  <div className="text-sm text-muted-foreground">تحليل</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{prescriptions.length}</div>
                  <div className="text-sm text-muted-foreground">وصفة</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{chronicConditions.length}</div>
                  <div className="text-sm text-muted-foreground">مزمنة</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="records">السجل</TabsTrigger>
            <TabsTrigger value="lab">التحاليل</TabsTrigger>
            <TabsTrigger value="prescriptions">الوصفات</TabsTrigger>
            <TabsTrigger value="chronic">المزمنة</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-4 mt-4">
            <div className="space-y-3">
              {medicalRecords.map((record, index) => {
                const Icon = getRecordIcon(record.type);
                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{record.title}</span>
                              {record.isVerified && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {record.doctorName || record.clinicName} • {format(new Date(record.date), 'd MMMM yyyy', { locale: ar })}
                            </div>
                          </div>
                        </div>
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="lab" className="space-y-4 mt-4">
            {labResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <TestTube className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{result.title}</span>
                            {result.isVerified && (
                              <Badge variant="secondary" className="text-xs">موثق</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {result.clinicName} • {format(new Date(result.date), 'd MMMM yyyy', { locale: ar })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          جاهز
                        </span>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {labResults.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد نتائج تحاليل
              </div>
            )}
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4 mt-4">
            {prescriptions.map((rx, index) => (
              <motion.div
                key={rx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Pill className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{rx.title}</span>
                          {rx.isVerified && (
                            <Badge variant="secondary" className="text-xs">موثقة</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {rx.doctorName} • {format(new Date(rx.date), 'd MMMM yyyy', { locale: ar })}
                        </div>
                      </div>
                    </div>
                    {rx.description && (
                      <p className="text-sm text-muted-foreground">{rx.description}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {prescriptions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد وصفات طبية
              </div>
            )}
          </TabsContent>

          <TabsContent value="chronic" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">الأمراض المزمنة</h3>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 ml-2" />
                إضافة
              </Button>
            </div>
            {chronicConditions.map((condition, index) => (
              <motion.div
                key={condition.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{condition.name}</div>
                          <div className="text-sm text-muted-foreground">
                            تشخيص: {format(new Date(condition.diagnosisDate), 'd MMMM yyyy', { locale: ar })}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(condition.status)}>
                        {condition.status === 'active' ? 'نشط' : 
                         condition.status === 'managed' ? 'مستقر' : 'محلول'}
                      </Badge>
                    </div>
                    {condition.treatmentPlan && (
                      <p className="text-sm text-muted-foreground mb-2">
                        العلاج: {condition.treatmentPlan}
                      </p>
                    )}
                    {condition.nextCheckup && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Calendar className="h-4 w-4" />
                        الفحص القادم: {format(new Date(condition.nextCheckup), 'd MMMM yyyy', { locale: ar })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Access Requests Dialog */}
      <Dialog open={accessDialogOpen} onOpenChange={setAccessDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              طلبات الوصول للسجل الطبي
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد طلبات معلقة
              </div>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {request.requesterType === 'doctor' ? (
                          <User className="h-5 w-5 text-primary" />
                        ) : (
                          <Building className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{request.requesterName}</div>
                        <div className="text-sm text-muted-foreground">
                          {request.requesterSpecialty || request.requesterType}
                        </div>
                        {request.accessReason && (
                          <p className="text-sm mt-2 text-muted-foreground">
                            السبب: {request.accessReason}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        size="sm"
                        onClick={() => handleApproveAccess(request.id)}
                      >
                        <CheckCircle className="h-4 w-4 ml-2" />
                        موافقة
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1" 
                        size="sm"
                        onClick={() => handleDenyAccess(request.id)}
                      >
                        <XCircle className="h-4 w-4 ml-2" />
                        رفض
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Audit Log Dialog */}
      <Dialog open={auditDialogOpen} onOpenChange={setAuditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              سجل النشاط
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {auditLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لا يوجد نشاط مسجل
              </div>
            ) : (
              auditLogs.slice(0, 20).map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-background rounded-full">
                    {log.action === 'view' && <Eye className="h-4 w-4 text-blue-500" />}
                    {log.action === 'create' && <Plus className="h-4 w-4 text-green-500" />}
                    {log.action === 'download' && <Download className="h-4 w-4 text-purple-500" />}
                    {log.action === 'share' && <Share2 className="h-4 w-4 text-orange-500" />}
                    {log.action === 'access_granted' && <Unlock className="h-4 w-4 text-green-500" />}
                    {log.action === 'access_denied' && <Lock className="h-4 w-4 text-red-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{log.details}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(log.timestamp), 'd MMMM yyyy - HH:mm', { locale: ar })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              مشاركة السجل الطبي
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              سيتم إنشاء رابط مشاركة مؤقت صالح لمدة 24 ساعة
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">رابط المشاركة</p>
              <code className="text-sm">https://sahti.ly/share/abc123...</code>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleShareRecord}>
              نسخ الرابط
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PatientLayout>
  );
};

export default HealthRecordsPage;