import { IoMdLogOut } from "react-icons/io";
import { useDispatch } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { toast } from "sonner";

type ProductSectionType = {
  id: string;
  name: string;
  link: string;
};

export const Header = () => {
  const productSections: ProductSectionType[] = [
    {
      id: "1",
      name: "Products",
      link: "/products",
    },
    {
      id: "2",
      name: "Add Product",
      link: "/products/addproduct",
    },
  ];

  const location = useLocation();
  const path = location.pathname;
  const { id } = useParams();
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
        <p>Are you sure!?</p>
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
  return (
    <header className="flex items-between items-center w-[calc(100vw-256px)] top-0 right-0 sticky h-20 bg-white border-b-2 text-primary">
      <div className="w-full flex justify-between px-7">
        <div className="flex list-none justify-start gap-x-20">
          {["/products", `/products/${id}`, "/products/addproduct"].includes(
            path
          ) ? (
            productSections.map((section) => (
              <Link key={section.id} to={section.link}>
                <li
                  className={`text-primary text-base font-bold bg-yellow-50 px-5 py-3 cursor-pointer rounded-xl shadow-md ${
                    path === section.link
                      ? "border-2 border-secondary"
                      : "border-none"
                  }`}
                >
                  {section.name}
                </li>
              </Link>
            ))
          ) : path === "/users" ? (
            <li className="text-primary text-base font-bold border-2 border-secondary bg-yellow-50 px-5 py-3 cursor-pointer rounded-xl shadow-md">
              Users
            </li>
          ) : path === "/orders" ? (
            <li className="text-primary text-base font-bold border-2 border-secondary bg-yellow-50 px-5 py-3 cursor-pointer rounded-xl shadow-md">
              Orders
            </li>
          ) : (
            <li className="text-primary text-base font-bold border-2 border-secondary bg-yellow-50 px-5 py-3 cursor-pointer rounded-xl shadow-md">
              Stats
            </li>
          )}
        </div>
        <div
          className="flex justify-start items-center gap-x-2 px-2 border-2 rounded-full border-secondary cursor-pointer"
          onClick={Logout}
        >
          <p className="text-lg font-medium">Logout</p>
          <IoMdLogOut size={20} />
        </div>
      </div>
    </header>
  );
};
