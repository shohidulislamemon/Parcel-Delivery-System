
import { Link } from 'react-router';

const Home = () => {
  return (
    <div>

      <section className="min-h-[80vh] flex flex-col-reverse md:flex-row items-center justify-between gap-10 px-6 sm:px-12 py-12 bg-[#2f3041] text-white">
       
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight uppercase text-[#24bfd7]">
            Fast, Secure, and Professional Delivery For Your Everyday Needs.
          </h2>
          <p className="text-gray-300 mt-4 text-base sm:text-lg">
            We offer reliable parcel delivery services with end-to-end tracking, quick turnaround times, and customer-first support.
          </p>
          <Link
            to="/login"
            className="inline-block mt-6 text-white bg-[#24bfd7] hover:bg-[#1b6f8f]  font-semibold py-3 px-6 rounded-md transition duration-200 shadow-md"
          >
            Create Delivery
          </Link>
        </div>

        <div className="w-full md:w-1/2">
          <img
            src="/herologo.png"
            alt="Parcel delivery truck logo"
            className="w-full max-w-md mx-auto object-contain"
          />
        </div>
      </section>

    </div>
  );
};

export default Home;
