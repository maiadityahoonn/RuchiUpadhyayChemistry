import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt, Calendar, CreditCard, Coins, Package } from "lucide-react";
import { format } from "date-fns";

interface Purchase {
  id: string;
  order_id: string;
  payment_id: string | null;
  amount: number;
  points_used: number | null;
  points_discount: number | null;
  status: string | null;
  payment_method: string | null;
  created_at: string;
  paid_at: string | null;
  course_id: string;
  course?: {
    title: string;
    image_url: string | null;
    instructor: string;
  };
}

const PurchaseHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) return;

      try {
        const { data: purchasesData, error: purchasesError } = await supabase
          .from("purchases")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (purchasesError) throw purchasesError;

        // Fetch course details for each purchase
        const purchasesWithCourses = await Promise.all(
          (purchasesData || []).map(async (purchase) => {
            const { data: courseData } = await supabase
              .from("courses")
              .select("title, image_url, instructor")
              .eq("id", purchase.course_id)
              .single();

            return {
              ...purchase,
              course: courseData || undefined,
            };
          })
        );

        setPurchases(purchasesWithCourses);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Receipt className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Purchase History</h1>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="w-24 h-24 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : purchases.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't made any course purchases yet.
                </p>
                <button
                  onClick={() => navigate("/courses")}
                  className="text-primary hover:underline"
                >
                  Browse Courses →
                </button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <Card key={purchase.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Course Image */}
                      <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {purchase.course?.image_url ? (
                          <img
                            src={purchase.course.image_url}
                            alt={purchase.course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Purchase Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {purchase.course?.title || "Course"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              by {purchase.course?.instructor || "Unknown"}
                            </p>
                          </div>
                          {getStatusBadge(purchase.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {format(new Date(purchase.created_at), "MMM dd, yyyy")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <span>₹{purchase.amount.toFixed(2)}</span>
                          </div>

                          {purchase.points_used && purchase.points_used > 0 && (
                            <div className="flex items-center gap-2">
                              <Coins className="w-4 h-4 text-yellow-500" />
                              <span className="text-green-600">
                                -{purchase.points_used} pts (₹{purchase.points_discount?.toFixed(2)})
                              </span>
                            </div>
                          )}

                          {purchase.payment_method && (
                            <div className="text-muted-foreground capitalize">
                              via {purchase.payment_method}
                            </div>
                          )}
                        </div>

                        {purchase.order_id && (
                          <p className="text-xs text-muted-foreground mt-3">
                            Order ID: {purchase.order_id}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Summary Card */}
          {purchases.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{purchases.length}</p>
                    <p className="text-sm text-muted-foreground">Total Purchases</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">
                      ₹{purchases.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-500">
                      {purchases.reduce((sum, p) => sum + (p.points_used || 0), 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Points Used</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-green-500">
                      ₹{purchases.reduce((sum, p) => sum + (p.points_discount || 0), 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Saved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PurchaseHistory;
