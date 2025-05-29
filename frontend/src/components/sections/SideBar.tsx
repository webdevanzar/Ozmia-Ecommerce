import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../redux/authSlice";

type SideBarSections = {
  id: string;
  name: string;
  src?: string;
  link?: React.RefObject<HTMLDivElement | null> | string;
};

type NavItemsType = {
  id: string;
  name: string;
  link?: React.RefObject<HTMLDivElement | null>;
};

type SideBarProps = {
  onClose: () => void;
  navItems: NavItemsType[];
  scrollTo: (ref: React.RefObject<HTMLDivElement | null> | undefined) => void;
};

export const SideBar: React.FC<SideBarProps> = ({
  onClose,
  navItems,
  scrollTo,
}: SideBarProps) => {
  const sidebarSections: SideBarSections[] = [
    {
      id: "about",
      name: "ABOUT",
      link: navItems.find((item) => item.id === "about")?.link,
    },
    {
      id: "collection",
      name: "COLLECTION",
      link: navItems.find((item) => item.id === "collection")?.link,
    },
    {
      id: "products",
      name: "PRODUCTS",
      link: "/products",
    },
    {
      id: "wishlist",
      name: "WISHLIST",
      link: "/wishlist",
    },
    {
      id: "cart",
      name: "CART",
      link: "/cart",
    },
    {
      id: "shop",
      name: "SHOP",
      link: navItems.find((item) => item.id === "shop")?.link,
    },
    {
      id: "orders",
      name: "ORDERS",
      link: "/orders",
    },
    {
      id: "contact",
      name: "CONTACT",
      link: navItems.find((item) => item.id === "contact")?.link,
    },
  ];
  const dispatch = useDispatch();
  const logOut = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="h-[100dvh] w-2/3 p-5 right-0 bottom-0 sidebar-bg text-white z-50 fixed overflow-y-hidden"
    >
      <div className="h-5/6 flex flex-col justify-start">
        <div className="flex justify-end items-center">
          <IoMdCloseCircleOutline onClick={() => onClose()} size={30} />
        </div>
        <ul className="flex flex-col space-y-8 pt-16 h-5/6">
          {sidebarSections.map((section) =>
            typeof section.link === "string" ? (
              <Link key={section.id} to={section.link} onClick={onClose}>
                <li className="text-sm">{section.name}</li>
              </Link>
            ) : (
              <li
                className="text-sm"
                key={section.id}
                onClick={() => {
                  if (section.link) {
                    scrollTo(section.link);
                  }
                  onClose();
                }}
              >
                {section.name}
              </li>
            )
          )}
          <li className="border-b" onClick={logOut}>
            Logout
          </li>
        </ul>
      </div>
    </motion.div>
  );
};
