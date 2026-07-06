export default function RefundPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen container mx-auto px-4 md:px-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-4">Last updated: October 24, 2024</p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Subscription Plans</h2>
        <p className="mb-4">
          RetailTalent operates on a SaaS subscription model for recruiters. All subscription fees are billed in advance and are non-refundable.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Exceptions</h2>
        <p className="mb-4">
          Refunds may be granted at the sole discretion of RetailTalent management in cases of billing errors or service outages that significantly impact the ability to use the platform.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Cancellation</h2>
        <p className="mb-4">
          You may cancel your subscription at any time. Your access to premium features will continue until the end of your current billing cycle.
        </p>
      </div>
    </div>
  );
}
