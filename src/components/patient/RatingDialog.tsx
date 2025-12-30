// Rating Dialog Component for Post-Service Ratings
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send, X } from "lucide-react";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { toast } from "sonner";

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: 'doctor' | 'clinic' | 'lab' | 'pharmacy' | 'ambulance';
  serviceId: string;
  serviceName: string;
}

const serviceTypeLabels: Record<string, string> = {
  doctor: 'الطبيب',
  clinic: 'العيادة',
  lab: 'المختبر',
  pharmacy: 'الصيدلية',
  ambulance: 'خدمة الإسعاف'
};

export const RatingDialog = ({ isOpen, onClose, serviceType, serviceId, serviceName }: RatingDialogProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addRating, removePendingRating, userId, addNotification } = useHealthcareStore();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("الرجاء اختيار تقييم");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Add rating to store
    addRating({
      id: `rating-${Date.now()}`,
      userId,
      userName: 'المستخدم',
      serviceType,
      serviceId,
      rating,
      review: review.trim() || undefined,
      verified: true,
      date: new Date().toISOString()
    });
    
    // Remove from pending ratings
    removePendingRating(serviceId);
    
    // Add thank you notification
    addNotification({
      id: `notif-thanks-${Date.now()}`,
      userId,
      type: 'general',
      title: 'شكراً لتقييمك!',
      message: `شكراً لمشاركة تجربتك مع ${serviceName}`,
      isRead: false,
      createdAt: new Date().toISOString()
    });
    
    setIsSubmitting(false);
    toast.success("شكراً لتقييمك!");
    
    // Reset and close
    setRating(0);
    setReview("");
    onClose();
  };

  const handleSkip = () => {
    removePendingRating(serviceId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            كيف كانت تجربتك مع {serviceTypeLabels[serviceType]}؟
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Service Name */}
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">{serviceName}</p>
          </div>
          
          {/* Star Rating */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-colors"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              </motion.button>
            ))}
          </div>
          
          {/* Rating Label */}
          <AnimatePresence mode="wait">
            {rating > 0 && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-muted-foreground"
              >
                {rating === 1 && "سيئ جداً"}
                {rating === 2 && "سيئ"}
                {rating === 3 && "مقبول"}
                {rating === 4 && "جيد"}
                {rating === 5 && "ممتاز"}
              </motion.p>
            )}
          </AnimatePresence>
          
          {/* Review Text */}
          <Textarea
            placeholder="أخبرنا المزيد عن تجربتك (اختياري)..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="min-h-[100px] resize-none"
            dir="rtl"
          />
          
          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1 gap-2"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4" />
              تخطي
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="flex-1 gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
