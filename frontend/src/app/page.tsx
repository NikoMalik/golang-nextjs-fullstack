"use client"
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

import { Button, buttonVariants } from "@/components/ui/Button";

import Image from "next/image";
import Link from "next/link";
import { content } from "@/components/content";
import TextRevealByWord from "@/components/TextReavel";







import {
  ArrowDownToLine,
  ArrowRight,
  
  
 
  Github,
  Twitter,
  LeafIcon,
  Instagram,
} from 'lucide-react'
import { Powered } from "@/components/powered";
import  Testimonials  from "@/components/Testinomals";
import { OpenSource } from "@/components/Open-source";
import { motion } from "framer-motion";

import { Info } from "@/components/info";




export const features = [
  {
    title: "Save Your Knowledge",
    description:
      "Capture, organize, and utilize your knowledge effortlessly with Cow Templates.",
    link: "/",
    Icon: ArrowDownToLine,
  },
  {
    title: "Quick Setup",
    description:
      "Get started in minutes! Cow Templates makes it easy to save whatever you want.",
    link: "/",
    Icon: LeafIcon,
  },
  {
    title: "Secure Tracking",
    description:
      "Track SSL certificates and domains for ultimate security and peace of mind.",
    link: "/",
    Icon: ArrowRight,
  },
  {
    title: "Customizable Experience",
    description:
      "Tailor Cow Templates to your needs and preferences for a personalized experience.",
    link: "/",
    Icon: LeafIcon,
  },
  {
    title: "Collaboration Tools",
    description:
      "Work together seamlessly with team members using Cow Templates' collaboration features.",
    link: "/",
    Icon: Github,
  },
  {
    title: "Intuitive Interface",
    description:
      "Enjoy a user-friendly interface designed to simplify your workflow and increase productivity.",
    link: "/",
    Icon: Instagram,
  },
];



export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 py-20 sm:py-16 md:py-15 lg:py-20">
  {/* Twitter Link */}
  <MaxWidthWrapper className='mb-12 flex flex-col items-center justify-center text-center'>
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      viewport={{ once: true, amount: 0.5 }}
      className="flex max-w-5xl text-center py-1 pr-2"
    >
      <Link
        href="https://twitter.com/Niko__Malik"
        className={buttonVariants({ size: "sm", className: 'mt-3', variant: "outline", rounded: "2xl" })}
        target="_blank"
      >
        <Twitter className="mr-2 h-3 w-3" />
        Introducing on{" "}
      </Link>
    </motion.div>

    {/* Main Title */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      viewport={{ once: true, amount: 1 }}
      className="py-2 mx-auto text-center flex flex-col items-center max-w-3xl"
    >
      <h1 className='max-w-3xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold'>
        Monitor across {' '}
        <span className='text-orange-500'> Different Providers </span>{' '}
      </h1>
      <p className='max-w-prose text-lg sm:text-xl leading-normal text-muted-foreground mt-5'>
        Running smoothly with our proactive SSL certificate expiration alerts
      </p>
      {/* Buttons */}
      <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:gap-5 md:gap-8">
        <Link href='/pricing' className={buttonVariants({ size: "lg", className: 'mt-5', variant: "default", rounded: "2xl" })} target='_blank'>
          Browse products
          <ArrowRight className='ml-2 h-5 w-5' />
        </Link>
        <Link href="https://github.com/NikoMalik/golang-nextjs-fullstack" className={buttonVariants({ size: "lg", className: 'mt-5', variant: "orange", rounded: "2xl" })} target='_blank'>
          <Github className="mr-2 h-4 w-4" />
          Star on GitHub{" "}
        </Link>
      </div>
    </motion.div>

    {/* Product Image */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      viewport={{ once: true, amount: 0.5 }}
      className=' max-w-6xl'
    >
      <div className='mt-16 sm:mt-24 shadow-[0px_5px_30px_0px_#ed8936]'>
        <div className='p-2 lg:-m-4 lg:p-4'>
          <Image
            src='/images/hd.jpg'
            alt='product preview'
            width={1000}
            height={1000}
           
            className='rounded-md p-2 sm:p-8 md:p-10 w-full h-auto'
          />
        </div>
      </div>
    </motion.div>

    {/* Powered Component */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      viewport={{ once: true, amount: 0.5 }}
    >
      <Powered />
    </motion.div>
  </MaxWidthWrapper>

  {/* Features Section */}
  <MaxWidthWrapper className='mb-12 flex flex-col items-center justify-center text-center'>
    <motion.section
    id="features"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      viewport={{ once: true, amount: 0.5 }}
      className='mb-32 mt-32 sm:mt-56'
    >
      {/* Features */}
      <h1 className="text-xl font-bold text-default-foreground text-center text-orange-500"> Features</h1>
      <div className='mb-12'>
        <div className='mx-auto max-w-2xl sm:text-center'>
          <h2 className='text-xl sm:text-3xl font-bold md:text-4xl lg:text-5xl text-default-foreground text-pretty'>
            Start saving in minutes
          </h2>
          <p className='mt-4 text-lg sm:text-xl text-gray-600 text-center'>
            Save whatever you want
          </p>
        </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.5 }}
            className="mt-12 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
           {features.map((feature, index) => (
            <div className="group relative overflow-hidden rounded-3xl border border-muted-foreground bg-background p-5 md:p-8" key={index}>
              <div aria-hidden="true" className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full bg-gradient-to-b from-purple-500/80 to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10" />
              <div className="relative">
                <div className="relative flex size-12 rounded-3xl shadow-sm *:relative *:m-auto *:size-6 text-foreground border-t border-muted">
                  {feature.Icon && <feature.Icon className='w-1/3 h-1/3' />}
                </div>
                <p className="mt-6 pb-6 text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  </MaxWidthWrapper>

  <MaxWidthWrapper>
    <motion.section
      id="monitoring"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      viewport={{ once: true, amount: 0.5 }}
    >
      <div className='mx-auto max-w-2xl sm:text-center'>
        <h1 className="text-xl font-bold text-default-foreground text-center text-orange-500">Monitoring and Reporting</h1>
        <h2 className='text-xl sm:text-3xl font-bold md:text-4xl lg:text-5xl text-default-foreground text-pretty'>
          Gain Insights into the Performance of your API.
        </h2>
      </div>
      <div className='mx-auto max-w-5xl'>
        <div className='sm:mt-24 shadow-[0px_5px_30px_0px_#ed8936]'>
          <div className='p-2 lg:-m-4 lg:p-4'>
            <Image
              src='/images/aggresive.png'
              alt='uploading preview'
              width={1000}
              height={1000}
              
              className='rounded-md p-2 sm:p-8 md:p-10 w-full h-auto'
            />
          </div>
        </div>
      </div>
    </motion.section>
  </MaxWidthWrapper>

  {/* New Columns Section */}
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 1, ease: "easeInOut" }}
    viewport={{ once: true, amount: 1 }}
  >
    <MaxWidthWrapper>
      <Info />
    </MaxWidthWrapper>
  </motion.div>

  <MaxWidthWrapper>
    <section id="opensource">
      <div className="mx-auto py-20 mb-40">
        <OpenSource />
      </div>
    </section>
  </MaxWidthWrapper>

  

  {/* Testimonials Section */}
  <motion.section
    id="testimonials"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 1, ease: "easeInOut" }}
    viewport={{ once: true, amount: 0.5 }}
    className='mb-10 mt-40 sm:mt-56'
  >
    <MaxWidthWrapper className="container">
      <h1 className="text-xl font-bold text-default-foreground text-center text-orange-500"> Testimonials</h1>
      <div className='px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl sm:text-center'>
          <h2 className='text-xl sm:text-3xl font-bold md:text-4xl lg:text-5xl text-default-foreground text-center text-pretty'>
            What customers are saying
          </h2>
          <p className='mt-4 text-sm sm:text-xl text-gray-600 text-center'>
            Discover the glowing feedback from our delighted customers worldwide.
          </p>
        </div>
      </div>
    <Testimonials />
    </MaxWidthWrapper>
  </motion.section>
</main>
)}