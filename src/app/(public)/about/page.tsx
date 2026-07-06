export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen container mx-auto px-4 md:px-6">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About RetailTalent</h1>
        <p className="text-xl text-muted-foreground">
          We are on a mission to organize India's massive retail workforce and connect top talent with the best brands.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="bg-slate-50 p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-muted-foreground">
            To become the undisputed digital backbone for retail hiring across India, bringing transparency, trust, and speed to a traditionally fragmented industry.
          </p>
        </div>
        <div className="bg-slate-50 p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-muted-foreground">
            Founded by industry veterans who saw the pain of hiring reliable promoters and merchandisers at scale, RetailTalent was built to bridge the trust deficit between brands and gig workers.
          </p>
        </div>
      </div>
    </div>
  );
}
