import React from "react";
import "../style.css";
const links = [
  { name: "Home", href: "#" },
  { name: "Competitions", href: "#competitions" },
  { name: "Schedule", href: "#schedule" },
  { name: "Gallery", href: "#gallery" }
];

export default function NavLinks() {
  return (
    <>
      {links.map(link => (
        <a
          key={link.name}
          href={link.href}
          className="font-medium text-slate-300 hover:text-yellow-200 transition-all duration-300"
        >
          {link.name}
        </a>
      ))}
    </>
  );
}
