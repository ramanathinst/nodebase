import { Button } from "@/components/ui/button";

 
const Page = () => {
  const something = true;

  return(
    <div className="min-h-screen min-w-screen flex justify-center items-center">
      <Button variant="outline">
        click me
      </Button>
    </div>
  )
}

export default Page;