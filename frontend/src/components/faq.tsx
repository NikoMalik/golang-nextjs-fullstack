import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  import MaxWidthWrapper from "./MaxWidthWrapper";
 
  
  const pricingFaqData = [
    {
      id: "item-1",
      question: "What is the cost of the free plan?",
      answer:
        "Our free plan is completely free, with no monthly or annual charges. It's a great way to get started and explore our basic features.",
    },
    {
      id: "item-2",
      question: "How much does the Basic Monthly plan cost?",
      answer:
        "The Basic Monthly plan is priced at $15 per month. It provides access to our core features and is billed on a monthly basis.",
    },
    {
      id: "item-3",
      question: "What is the price of the Pro Monthly plan?",
      answer:
        "The Pro Monthly plan is available for $25 per month. It offers advanced features and is billed on a monthly basis for added flexibility.",
    },
    {
      id: "item-4",
      question: "Do you offer any annual subscription plans?",
      answer:
        "Yes, we offer annual subscription plans for even more savings. The Basic Annual plan is $144 per year, and the Pro Annual plan is $300 per year.",
    },
    {
      id: "item-5",
      question: "Is there a trial period for the paid plans?",
      answer:
        "We offer a 14-day free trial for both the Pro Monthly and Pro Annual plans. It's a great way to experience all the features before committing to a paid subscription.",
    },
  ];
  
  export function PricingFaq() {
    return (
      <MaxWidthWrapper className="container py-20 ">
        <h1 className="text-xl font-bold text-default-foreground text-center text-orange-500"> FAQ</h1>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-default-foreground">
        Frequently Asked Questions
    </h1>
    <p className='mt-4 text-lg sm:text-xl text-gray-600 text-center'>
    Explore our comprehensive FAQ to find quick answers to common inquiries. If you need further assistance, don't hesitate to contact us for personalized help.
    </p>
  
        <Accordion type="single" collapsible className="my-12 w-full">
          {pricingFaqData.map((faqItem) => (
            <AccordionItem key={faqItem.id} value={faqItem.id}>
              <AccordionTrigger>{faqItem.question}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground sm:text-[15px]">
                {faqItem.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </MaxWidthWrapper>
    );
  }