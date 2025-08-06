import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-[#f4fafd] px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
      <img
        src="/logo.png"
        alt="Footer Logo"
        className="h-[130px] w-auto object-contain"
      />

      <ul className="text-sm text-gray-600 space-y-1 text-center sm:text-right">
        <li>Admin</li>
        <li>&copy; {new Date().getFullYear()}</li>
      </ul>
    </footer>
  );
};

export default Footer;
