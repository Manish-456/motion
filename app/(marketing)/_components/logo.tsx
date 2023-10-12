import Image from "next/image"
import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils"

const poppins = Poppins({
    subsets : ["latin"],
    weight : ["400", "600"]
});

export  function Logo() {
  return (
    <div className="hidden  md:flex items-center gap-x-2">
     <Image 
     src={`/logo.svg`}
     className="dark:hidden"
     height={"30"}
     width={"30"}
     alt="logo"
     />
     <Image 
     src={`/dark-logo.svg`}
     className="hidden dark:block"
     height={"30"}
     width={"30"}
     alt="logo"
     />

     <p className={cn("font-semibold", poppins.className)}>Motion</p>
    </div>
  )
}
