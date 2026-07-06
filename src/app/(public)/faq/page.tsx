import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about the platform. Can't find the answer? Contact our support.
          </p>
        </div>

        <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
          <Accordion className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-lg font-medium">What is RetailTalent?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                RetailTalent is India's leading specialized hiring platform exclusively for retail roles, connecting top brands with verified promoters, merchandisers, sales executives, and event staff.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-lg font-medium">How are candidates verified?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                We mandate PAN and Aadhaar verification for all candidates. Furthermore, our system tracks previous job attendance, performance ratings, and work history to provide a trust score.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-lg font-medium">Can I hire staff for short-term events?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                Absolutely! RetailTalent supports full-time, part-time, and gig-based hiring. You can hire staff for a single day event, a 3-day activation, or a permanent store role.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-lg font-medium">Is there a limit to how many jobs I can post?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                The limits depend on your pricing tier. Our Starter plan allows up to 2 jobs per month, while our Pro plan allows up to 20. Enterprise plans have unlimited posting capabilities.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left text-lg font-medium">How do I pay the hired staff?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                Currently, payments are handled directly between the recruiter and the candidate. However, we are launching an integrated digital wallet in Q3 that will allow seamless, compliant escrow payouts.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
