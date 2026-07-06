export default function CareersPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen container mx-auto px-4 md:px-6">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Join Our Team</h1>
        <p className="text-xl text-muted-foreground">
          Help us build the future of retail hiring. We're always looking for passionate builders, designers, and operators.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Open Positions at RetailTalent</h2>
        <div className="space-y-4">
          {[
            { role: "Senior Frontend Engineer", dept: "Engineering", location: "Remote / Mumbai" },
            { role: "Product Manager", dept: "Product", location: "Mumbai, India" },
            { role: "B2B Sales Executive", dept: "Sales", location: "Delhi, India" },
          ].map((job, i) => (
            <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-6 rounded-xl bg-white hover:border-primary transition-colors cursor-pointer">
              <div>
                <h3 className="font-bold text-lg">{job.role}</h3>
                <p className="text-muted-foreground text-sm">{job.dept} • {job.location}</p>
              </div>
              <button className="mt-4 sm:mt-0 text-primary font-medium">Apply Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
