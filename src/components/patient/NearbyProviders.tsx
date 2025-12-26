import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Star, MapPin, Navigation } from "lucide-react";
import { Link } from "react-router-dom";

const providers = [
  {
    id: 1,
    name: "مستشفى طرابلس المركزي",
    type: "مستشفى",
    distance: "1.2 كم",
    rating: 4.8,
    reviews: 234,
    image: "🏥",
  },
  {
    id: 2,
    name: "صيدلية الشفاء",
    type: "صيدلية",
    distance: "0.5 كم",
    rating: 4.6,
    reviews: 128,
    image: "💊",
  },
  {
    id: 3,
    name: "مختبر الأمل",
    type: "مختبر",
    distance: "0.8 كم",
    rating: 4.7,
    reviews: 89,
    image: "🔬",
  },
];

export const NearbyProviders = () => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {providers.map((provider, index) => (
        <motion.div
          key={provider.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex-shrink-0"
        >
          <Link to={`/patient/provider/${provider.id}`}>
            <Card variant="elevated" className="w-40 p-4 hover:shadow-elevated transition-shadow">
              <div className="text-4xl mb-3">{provider.image}</div>
              <h4 className="font-semibold text-foreground text-sm line-clamp-1">{provider.name}</h4>
              <p className="text-xs text-muted-foreground mb-2">{provider.type}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <MapPin className="w-3 h-3" />
                {provider.distance}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{provider.rating}</span>
                <span className="text-xs text-muted-foreground">({provider.reviews})</span>
              </div>
              <button className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-primary font-medium hover:underline">
                <Navigation className="w-3 h-3" />
                الاتجاهات
              </button>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};
