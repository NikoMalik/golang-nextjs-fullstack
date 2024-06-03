"use client";
import { SectionTitle } from "./section";
import { motion } from "framer-motion";
import { Star, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button, buttonVariants } from "./ui/Button";




export const OpenSource: React.FC = () => {
  return (
    <MaxWidthWrapper className="py-40  ">
      <div className="">
       
       
       
      </div>
      <div className="flex flex-col items-center justify-center w-full xl:flex-row xl:justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <SectionTitle
            align="left"
            title="Empower your projects"
            text="We believe strongly in the value of open source: our codebase and development process is available to learn from and contribute to."
            label="OPEN SOURCE"
          >
            <div className="flex mt-10 space-x-6">
            <Link href="https://github.com/NikoMalik/golang-nextjs-fullstack" className={buttonVariants({ size: "lg", className: 'mt-5', variant: "orange", rounded: "2xl" })} target='_blank'>
              <StarIcon className="mr-2 h-4 w-4" />
              Star on GitHub{" "} 
            </Link>
            </div>
          </SectionTitle>
        </motion.div>
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <Image alt="Github logo" 
           
            width={500}
            height={500}
            quality={100}
            src="/images/wich.jpg" 
            className="mt-24" />
            <div className="absolute  ">
              
            </div>
          </motion.div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};