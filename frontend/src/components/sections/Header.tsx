import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { HiMenuAlt2 } from "react-icons/hi";
import type { IconType } from "react-icons";

import logo from "../../assets/images/navbaricons/logo.svg";

import { SideBar } from "./SideBar";
import { RiLoginCircleLine } from "react-icons/ri";
import { FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { Link, useLocation, useParams } from "react-router-dom";
import { isTokenValide } from "../../utils/token";
import { RootState } from "../../redux/store";
import { SearchInput } from "../search/SearchInput";
import { SearchList } from "../search/SearchList";

type NavItemsType = {
  id: string;
  name: string;
  link?: React.RefObject<HTMLDivElement | null> | string;
};

type IconSectionType = {
  id: string;
  name: string;
  src: IconType;
  link?: string;
};

type HeaderProps = {
  scrollTo: (ref: React.RefObject<HTMLDivElement | null> | undefined) => void;
  refs: {
    aboutRef: React.RefObject<HTMLDivElement | null>;
    collectionRef: React.RefObject<HTMLDivElement | null>;
    shopRef: React.RefObject<HTMLDivElement | null>;
    contactRef: React.RefObject<HTMLDivElement | null>;
  };
};

export const Header = ({ scrollTo, refs }: HeaderProps) => {
  const { id } = useParams();
  const location = useLocation();
  const { token, username } = useSelector((state: RootState) => state.auth);
  const { cartCount } = useSelector((state: RootState) => state.cart);
  const { value, isShowList } = useSelector((state: RootState) => state.search);

  const isAuthenticated = isTokenValide(token);
  const getInitials = (name: string) => {
    return name?.slice(0, 2).toUpperCase();
  };

  const navItems: NavItemsType[] = [
    {
      id: "home",
      name: "Home",
    },
    {
      id: "about",
      name: "About",
      link: refs.aboutRef,
    },
    {
      id: "collection",
      name: "Collection",
      link: refs.collectionRef,
    },
    {
      id: "shop",
      name: "Shop",
      link: refs.shopRef,
    },
    {
      id: "orders",
      name: "Orders",
      link: "/orders",
    },
  ];

  const iconSection: IconSectionType[] = [
    {
      id: "wishlist",
      name: "Wishlist",
      link: "/wishlist",
      src: FaRegHeart,
    },
    {
      id: "cart",
      name: "Cart",
      link: "/cart",
      src: FaShoppingCart,
    },
  ];

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);
  const [isShow, setIsShow] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 1024);
  };

  const dispatch = useDispatch();
  const Logout = () => {
    const confirmLogout = () => {
      dispatch(logout());
      window.location.href = "/login";
    };

    const cancelLogout = () => {
      toast.dismiss();
    };

    toast.info(
      <div>
        <p>Logout..!?</p>
        <div className="flex gap-2 justify-center mt-2 ">
          <button
            onClick={confirmLogout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            OK
          </button>
          <button
            onClick={cancelLogout}
            className="bg-green-400 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        duration: Infinity, // Disable auto-close for this toast
      }
    );
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    //TODO: bg-gradient
    <header className="w-full h-16 md:h-20 bg-[linear-gradient(296.61deg,_#00CF67_13.41%,_#009C4E_29.39%,_#008542_54.49%,_#006131_68.42%,_#004A25_99.14%)]  flex justify-between px-5 md:p-0 md:justify-around items-center md:border-b-2 text-[#FFFCAD]">
      <div className="w-[15%] sm:w-[20%] md:w-[30%] relative">
        <img
          src={logo}
          alt="Logo"
          className="absolute -top-4 cursor-pointer z-10"
        />
      </div>

      {![
        "/products",
        "/cart",
        "/wishlist",
        "/orders",
        `/products/${id}`,
      ].includes(location.pathname) ? (
        <nav>
          <ul className="lg:flex hidden justify-between items-center w-2/3 space-x-16">
            {navItems.map((navitem) =>
              typeof navitem.link === "string" ? (
                <Link key={navitem.id} to={navitem.link}>
                  <li
                    className={`text-base cursor-pointer ${
                      navitem.id !== "home"
                        ? "cool-link"
                        : "border-b-2 border-[#FFFCAD]"
                    }`}
                  >
                    {navitem.name}
                  </li>
                </Link>
              ) : (
                <li
                  key={navitem.id}
                  onClick={() => scrollTo(navitem.link)}
                  className={`text-base cursor-pointer ${
                    navitem.id !== "home"
                      ? "cool-link"
                      : "border-b-2 border-[#FFFCAD]"
                  }`}
                >
                  {navitem.name}
                </li>
              )
            )}
          </ul>
        </nav>
      ) : (
        <div className="md:w-1/3 relative">
          <SearchInput />
          {value && isShowList && <SearchList />}
        </div>
      )}

      <div className="hidden lg:flex items-center space-x-16 min-w-[90px] cursor-pointer pl-16">
        {!["/cart", "/wishlist", "/orders"].includes(location.pathname) &&
          iconSection.map((Icon) => (
            <div key={Icon.id} className="relative">
              <Link to={Icon.link}>
                <Icon.src size={24} />
              </Link>

              {Icon.id === "cart" && cartCount > 0 && (
                <span className="absolute font-serif -top-2 -right-2 bg-green-700 border-[1px] text-white text-sm w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          ))}
        {!isAuthenticated && (
          <Link to="/login">
            <RiLoginCircleLine size={20} />
          </Link>
        )}

        {isAuthenticated && (
          <div className="relative" ref={popupRef}>
            <button
              onClick={() => setShowPopup((prev) => !prev)}
              className="w-6 h-6 p-4 rounded-full hover:text-violet-800 hover:bg-amber-50 bg-violet-800 font-bold text-white flex items-center justify-center cursor-pointer"
            >
              {getInitials(username)}
            </button>

            {showPopup && (
              <div className="absolute right-0 top-8 login-bg text-gray-200 rounded-md shadow-md w-36 py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-green-800 w-full text-left"
                >
                  View Profile
                </Link>
                <button
                  onClick={Logout}
                  className="block px-4 py-2 hover:bg-green-800 w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isMobile && isShow && (
          <SideBar
            key="mobile-sidebar"
            onClose={() => setIsShow(false)}
            navItems={navItems}
            scrollTo={scrollTo}
          />
        )}
        {isMobile && (
          <div className="flex lg:hidden cursor-pointer">
            <HiMenuAlt2
              color={`${isShow ? "transparent" : "white"}`}
              size={30}
              onClick={() => setIsShow(true)}
            />
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
