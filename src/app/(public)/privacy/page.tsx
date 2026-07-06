export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen container mx-auto px-4 md:px-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-4">Last updated: October 24, 2024</p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p className="mb-4">
          At RetailTalent, we collect personal information such as your name, contact details, Government ID (Aadhaar/PAN for verification), and employment history to match you with suitable retail roles.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use this data solely to facilitate hiring processes, verify your identity for platform safety, and improve our services.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Security</h2>
        <p className="mb-4">
          We implement industry-standard security measures to protect your data. Your sensitive documents (like Aadhaar) are encrypted and stored securely.
        </p>
      </div>
    </div>
  );
}
