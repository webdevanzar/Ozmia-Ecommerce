import { useDispatch, useSelector } from "react-redux";
import { useProducts } from "../../hooks/useUserProducts";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { setIsShow, setSearchValue } from "../../redux/searchSlice";
import { ProductType } from "../../utils/types";
import { useSearchDebounce } from "../../hooks/useSearchDebounce";

export const SearchList = () => {
  const searchInput = useSelector((state: RootState) => state.search.value);
  const { debouncedValue } = useSearchDebounce(searchInput, 500);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: products } = useProducts("", debouncedValue);

  const handleClick = (product: ProductType) => {
    dispatch(setSearchValue(product.title));
    dispatch(setIsShow(false));
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="flex p-2 gap-y-2 top-14 flex-col w-[500px] absolute bg-slate-100 rounded-md text-black max-h-80 overflow-y-auto scrollbar-hide z-50">
      {products?.length !== 0 ? (
        products?.map((product) => (
          <div
            key={product.id}
            onClick={() => handleClick(product)}
            className="flex justify-start items-center gap-x-4 p-2 cursor-pointer hover:bg-white rounded-md"
          >
            <div>
              <img
                src={product.image as string}
                alt="product"
                className="w-8 h-8 object-contain rounded-full border-2"
              />
            </div>
            <div>
              <p>{product.title}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-start items-center gap-x-4 p-2">
          <h1>No products found</h1>
        </div>
      )}
    </div>
  );
};
