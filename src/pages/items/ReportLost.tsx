
import Layout from "@/components/layout/Layout";
import ItemForm from "@/components/items/ItemForm";
import AuthGuard from "@/components/auth/AuthGuard";

const ReportLost = () => {
  return (
    <AuthGuard>
      <Layout>
        <h1 className="text-3xl font-bold mb-6 text-center">Report a Lost Item</h1>
        <ItemForm type="lost" title="Lost Item Details" />
      </Layout>
    </AuthGuard>
  );
};

export default ReportLost;
