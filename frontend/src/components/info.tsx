import Image from "next/image";
import { motion } from "framer-motion";

import { AlertTriangle, GitMerge, LayoutDashboard, Settings } from "lucide-react";

export const Info: React.FC = () => {
  const info = [
   
    {
      icon: AlertTriangle,
      name: "Stay Focused",
      description: "Keep your Tracking workspace focused on what's important",
    },
    {
      icon: Settings,
      name: "Customizable Settings",
      description: "Customize your alert settings to suit your unique needs",
    },
    {
      icon: LayoutDashboard,
      name: "Clear Overview",
      description: "Get a clear overview of all your alerts in one place",
    },
  ];
  return (
    <>
      <div className="py-20 mb-10   mx-auto ">
        

       
                <div className="text-right max-w-xl grid grid-cols-3 gap-4 space-x-3 lg:max-w-4xl sm:max-w-sm ">
                  {info.map((info) => (
                    <div
                      key={info.name}
                      className="text-right px-2 py-1 rounded group hover:bg-white/90 duration-500"
                    >
                      <div className="flex items-center mb-1 space-x-2 ">
                        <info.icon className="w-4 h-4 shrink-0 text-orange-500 duration-500" />
                        <h4 className="font-medium text-foreground group-hover:text-zinc-950 duration-500">
                          {info.name}
                        </h4>
                      </div>
                      <p className="text-sm text-left text-zinc-400 group-hover:text-zinc-950 duration-500">
                        {info.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

           
            
          
        
      
    </>
  );
};

