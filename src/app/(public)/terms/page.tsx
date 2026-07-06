export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen container mx-auto px-4 md:px-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-4">Last updated: October 24, 2024</p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
        <p className="mb-4">
          By accessing or using RetailTalent, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Responsibilities</h2>
        <p className="mb-4">
          You are responsible for maintaining the accuracy of your profile and ensuring that any documents uploaded for KYC are genuine. Recruiters must ensure all job postings comply with local labor laws.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Account Termination</h2>
        <p className="mb-4">
          We reserve the right to suspend or terminate accounts that violate our terms, post fraudulent jobs, or engage in malicious behavior on the platform.
        </p>
      </div>
    </div>
  );
}
