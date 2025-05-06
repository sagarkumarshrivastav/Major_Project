
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <Layout className="pb-0">
      {/* Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between py-12 md:py-24">
        <div className="flex flex-col space-y-6 md:w-1/2">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Lost something on campus?
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Lost & Found helps you reunite with your lost items or return
            found items to their rightful owners.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link to="/report-lost">Report a Lost Item</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/report-found">Report a Found Item</Link>
            </Button>
          </div>
        </div>
        
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img
            src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
            alt="Lost and found items"
            className="rounded-lg shadow-xl w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-slate-50 dark:bg-slate-900 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Report</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Quickly report a lost or found item with details and an image
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">Match</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Our system finds potential matches between lost and found items
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">Claim</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Verify and claim your item through our secure process
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild variant="default" size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link to="/lost-items">Browse Lost & Found Items</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="bg-amber-500 text-white p-8 rounded-xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to find what you've lost?</h2>
            <p className="text-xl mb-6">Join our community and get connected with your lost items.</p>
            <Button asChild size="lg" variant="default" className="bg-white text-amber-500 hover:bg-gray-100">
              <Link to="/register">Create an Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
