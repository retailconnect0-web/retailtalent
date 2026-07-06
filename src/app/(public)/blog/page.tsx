export default function BlogPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen container mx-auto px-4 md:px-6">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl font-bold mb-4">Retail Insights Blog</h1>
        <p className="text-xl text-muted-foreground">
          Tips, trends, and strategies for hiring and thriving in the Indian retail ecosystem.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Top 5 Traits of a Great Sales Promoter", date: "Oct 20, 2024" },
          { title: "How to Reduce Attrition in Retail Jobs", date: "Oct 15, 2024" },
          { title: "The Future of Merchandising in India", date: "Oct 02, 2024" },
        ].map((post, i) => (
          <div key={i} className="border rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white">
            <div className="w-full h-48 bg-slate-100 rounded-xl mb-4"></div>
            <p className="text-sm text-primary font-medium mb-2">{post.date}</p>
            <h3 className="text-xl font-bold">{post.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
