import { useState } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Plus, CreditCard, Receipt, Gift, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { motion } from "framer-motion";

const transactions = [
  { id: 1, type: "payment", title: "استشارة د. أحمد", amount: -50, date: "اليوم", icon: ArrowUpRight },
  { id: 2, type: "topup", title: "شحن المحفظة", amount: 200, date: "أمس", icon: ArrowDownLeft },
  { id: 3, type: "cashback", title: "استرداد نقدي", amount: 10, date: "منذ 3 أيام", icon: Gift },
  { id: 4, type: "payment", title: "تحاليل مخبرية", amount: -80, date: "منذ أسبوع", icon: ArrowUpRight },
];

const WalletPage = () => {
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");

  return (
    <PatientLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">المحفظة</h1>
          <Button variant="outline" size="icon">
            <Receipt className="h-5 w-5" />
          </Button>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-full">
                  <Wallet className="h-6 w-6" />
                </div>
                <span className="text-sm opacity-90">الرصيد المتاح</span>
              </div>
              <div className="text-4xl font-bold mb-6">350.00 د.ل</div>
              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
                  onClick={() => setShowTopup(!showTopup)}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  شحن
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <CreditCard className="h-4 w-4 ml-2" />
                  البطاقات
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Topup Section */}
        {showTopup && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">شحن المحفظة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[50, 100, 200].map((amount) => (
                    <Button
                      key={amount}
                      variant={topupAmount === String(amount) ? "default" : "outline"}
                      onClick={() => setTopupAmount(String(amount))}
                    >
                      {amount} د.ل
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="مبلغ آخر"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                  />
                  <Button className="px-6">شحن</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Cashback */}
        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-full">
                <Gift className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <div className="font-medium">نقاط الولاء</div>
                <div className="text-sm text-muted-foreground">150 نقطة متاحة</div>
              </div>
            </div>
            <Button variant="outline" size="sm">استبدال</Button>
          </CardContent>
        </Card>

        {/* Transactions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">المعاملات الأخيرة</h2>
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        tx.type === "payment" ? "bg-destructive/10" : "bg-green-100"
                      }`}>
                        <tx.icon className={`h-4 w-4 ${
                          tx.type === "payment" ? "text-destructive" : "text-green-600"
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium">{tx.title}</div>
                        <div className="text-sm text-muted-foreground">{tx.date}</div>
                      </div>
                    </div>
                    <div className={`font-bold ${
                      tx.amount > 0 ? "text-green-600" : "text-destructive"
                    }`}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount} د.ل
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default WalletPage;
