import Image from "next/image";
import { FiArrowRight, FiDownload, FiGift } from "react-icons/fi";
import Header from "@/features/home/components/header";
export default function Home() {
  return (
    <main className="bg-background flex-1">
      <Header />

      <section className="container mx-auto pt-[90px] h-screen items-center justify-center flex flex-col gap-8">
        <h1 className="font-bold text-4xl max-w-2xl text-center leading-tight">
          <span className="text-[#6F66D9] ">Revolutionize</span> Your Shopping
          Experience
        </h1>
        <p className=" max-w-2xl font-medium text-center text-[18px] ">
          Welcome to SellSpot, where buying and selling meet seamless
          convenience on your fingertips. Explore a world of endless
          possibilities today!
        </p>
        <button className="btn">
          Start Free Now
          <FiArrowRight size={20} />
        </button>
      </section>

      <section className="container mx-auto">
        <div className="w-[730px] h-[355px] relative mb-[48px] mx-auto">
          <Image
            src="/smartPhone.png"
            alt="hero"
            fill
            sizes="(max-width: 768px) 100vw, 730px"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className=" font-medium text-[36px]">
            Discover, Connect, Transact
          </h2>
          <p className=" max-w-2xl font-normal text-[16px] text-center my-[16px]">
            SellSpot is more than just an app; it's your gateway to a vibrant
            marketplace community where buyers and sellers converge, creating a
            dynamic ecosystem of exchange.
          </p>
        </div>
        <button className="btn mx-auto">
          Start Now
          <FiDownload size={20} />
        </button>
      </section>
      <section className="container mx-auto mt-[160px]">
        <div className=" flex flex-col items-center justify-center mb-20">
          <h3 className=" font-bold text-[36px]">Why SellSpot?</h3>
          <p className=" font-normal text-[16px] max-w-2xl text-center">
            Choose SellSpot for a seamless, enjoyable, and rewarding marketplace
            experience unlike any other.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="dark:bg-linear-to-b from-[#242333] to-[#17161C] shadow-lg dark:shadow-none p-4 border border-border rounded-[12px]"
            >
              <div>
                <div className=" rounded-[8px] p-2 dark:bg-background border border-border inline-block">
                  <FiGift size={20} />
                </div>
                <h3 className=" text-2xl font-semibold my-2">
                  Easy to Use Interface
                </h3>
                <p className="text-[16px] font-normal">
                  Navigate effortlessly with our intuitive, user-friendly design
                  — perfect for everyone.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div>
          <h3 className="font-semibold">Step 1</h3>
        </div>
      </section>
    </main>
  );
}
