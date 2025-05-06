
import Layout from "@/components/layout/Layout";
import ItemForm from "@/components/items/ItemForm";
import AuthGuard from "@/components/auth/AuthGuard";

const ReportFound = () => {
  return (
    <AuthGuard>
      <Layout>
        <h1 className="text-3xl font-bold mb-6 text-center">Report a Found Item</h1>
        <ItemForm type="found" title="Found Item Details" />
      </Layout>
    </AuthGuard>
  );
};

export default ReportFound;
