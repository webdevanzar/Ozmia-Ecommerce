import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setIsShow, setSearchValue } from "../../redux/searchSlice";

export const SearchInput = () => {
  const dispatch = useDispatch();
  const searchInput = useSelector((state: RootState) => state.search.value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setIsShow(true));
    dispatch(setSearchValue(e.target.value));
  };

  return (
    <div className="flex justify-strat m-auto pl-3 md:pl-4 items-center text-black bg-white p-0 md:p-1 rounded-full border-2">
      <FaSearch />
      <input
        type="text"
        placeholder="Search here..."
        className="outline-none p-2 rounded-full w-full"
        value={searchInput}
        onChange={handleChange}
      />
    </div>
  );
};
