import Image from "next/image";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Marquee from "./Marque";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "John Doe",
    job: "Web Developer",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
    review:
      "ssl-tracking-and-domain-tracking made it easy to monitor and track my SSL certificates and domains. I was able to quickly identify any issues and make the necessary adjustments to ensure the security and performance of my website.",
  },
  {
    name: "Alice Smith",
    job: "Cybersecurity Analyst",
    img: "https://randomuser.me/api/portraits/women/2.jpg",
    review:
      "ssl-tracking-and-domain-tracking streamlined my workflow for monitoring and managing SSL certificates and domains. I was able to stay on top of security and performance issues in real-time, making it easier to identify and fix any potential vulnerabilities.",
  },
  {
    name: "David Johnson",
    job: "DevOps Engineer",
    img: "https://randomuser.me/api/portraits/men/3.jpg",
    review:
      "ssl-tracking-and-domain-tracking provided me with the tools I needed to effectively manage and monitor my SSL certificates and domains. With its user-friendly interface and detailed reports, I was able to quickly identify any issues and make the necessary adjustments to ensure the security and performance of my website.",
  },
  {
    name: "Michael Wilson",
    job: "Security Professional",
    img: "https://randomuser.me/api/portraits/men/5.jpg",
    review:
      "ssl-tracking-and-domain-tracking has been a valuable resource for staying on top of SSL certificate and domain management. The dashboard and reporting capabilities make it easy to identify and address any security or performance issues in a timely manner, ensuring the security and reliability of my website.",
  },
];

const firstRow = testimonials.slice(0, testimonials.length / 2);
const secondRow = testimonials.slice(testimonials.length / 2);

const ReviewCard = ({
  img,
  name,
  job,
  review,
}: {
  img: string;
  name: string;
  job: string;
  review: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-96 cursor-pointer overflow-hidden sm:w-60 lq:w-80 xl:w-96  p-4",
        // light styles
        " bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        " dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex col-span-2 flex-row items-center gap-3 ">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{job}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{review}</blockquote>
    </figure>
  );
};
 
const Testimonials = () => {
  return (
    <MaxWidthWrapper>
      <div className="relative flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full max-w-xs md:max-w-md lg:max-w-lg xl:max-w-full ">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.job} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.job} {...review} />
            ))}
          </Marquee>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Testimonials;