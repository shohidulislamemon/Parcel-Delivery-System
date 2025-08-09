import React from "react";
import { Link } from "react-router";
import {
  FaBox,
  FaCalendarAlt,
  FaChartBar,
  FaClipboard,
  FaClipboardList,
  FaCog,
  FaElementor,
  FaHdd,
  FaHome,
  FaUser,
  FaUsers,
} from "react-icons/fa";

const menuItems = [
  { icon: <FaHome />, text: "Home", to: "/" },
  { icon: <FaUser />, text: "Profile", to: "/profile" },
  "divider",
  { icon: <FaBox />, text: "Parcels", to: "/parcels" },
  { icon: <FaUsers />, text: "Users", to: "/users" },
  { icon: <FaClipboardList />, text: "Delivery Agents", to: "/delivery-agents" },
  "divider",
  { icon: <FaElementor />, text: "Elements", to: "/elements" },
  { icon: <FaCog />, text: "Settings", to: "/settings" },
  { icon: <FaHdd />, text: "Backups", to: "/backups" },
  "divider",
  { icon: <FaChartBar />, text: "Charts", to: "/charts" },
  { icon: <FaClipboard />, text: "All Logs", to: "/logs" },
  { icon: <FaCalendarAlt />, text: "Calendar", to: "/calendar" },
];

const Menu = () => {
  return (
    <div className="h-[90vh] shadow-xl px-4 py-6 bg-[#2a2b3a]">
      <ul className="flex flex-col gap-2">
        {menuItems.map((item, index) =>
          item === "divider" ? (
            <hr
              key={`divider-${index}`}
              className="border-t border-[#2a2b3a] my-2"
            />
          ) : (
            <li key={item.text}>
              <Link
                to={item.to}
                className="flex items-center gap-4 text-[#24bfd7] hover:text-[#1a6a87] text-[17px] font-medium px-2 py-2 transition"
              >
                <span className="text-lg pl-18">{item.icon}</span>
                <span>{item.text}</span>
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Menu;
