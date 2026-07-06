export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h1 className="text-4xl font-bold mb-6">Get in touch</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Have questions about hiring on RetailTalent? Our team is here to help you build your perfect retail team.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <span className="font-bold">@</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email Support</h3>
                  <p className="text-muted-foreground">hello@retailtalent.in</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <span className="font-bold">#</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <p className="text-muted-foreground">+91 1800 123 4567</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <span className="font-bold">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Office</h3>
                  <p className="text-muted-foreground">RetailTalent HQ<br />Andheri East, Mumbai 400069<br />Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
            <form className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">First Name</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2 bg-slate-50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Last Name</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2 bg-slate-50" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <input type="email" className="w-full border rounded-lg px-4 py-2 bg-slate-50" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <textarea rows={4} className="w-full border rounded-lg px-4 py-2 bg-slate-50 resize-none"></textarea>
              </div>
              <button className="w-full bg-primary text-white font-medium py-3 rounded-lg mt-2 hover:bg-primary/90 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
