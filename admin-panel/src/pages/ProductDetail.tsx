import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useAdmin";

const ProductDetail = () => {
  const { id } = useParams();
  const { data, isSuccess } = useProduct(id);

  return (
    <div className="w-full h-full">
      <div className="w-full flex justify-center items-center relative">
        <h1 className="text-3xl font-bold text-primary text-center border-b-2 w-[85%] m-auto pb-2 sticky p-5">
          {data?.title}
        </h1>
      </div>

      {isSuccess && (
        <div className="flex justify-center items-center w-full h-[80vh]">
          <div className="w-3/4 border-2 flex justify-between gap-x-5 h-4/6 border-secondary rounded-md">
            <div className="w-1/2 h-full">
              <img
                src={data?.image as string}
                alt="data image"
                className="h-full w-full object-fill rounded-md"
              />
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center gap-y-7 p-2">
              <p className="text-xl font-bold text-primary">
                Price :₹{data.price}
              </p>
              <p className="text-md font-semibold">
                Category: {data?.category}
              </p>
              <p className="text-md font-semibold">
                Quantity: {data?.quantity}
              </p>
              <p className="text-left text-sm text-gray-800 p-2 overflow-y-auto border-[1px] rounded-md">
                <span className="font-bold">Details:-</span>
                <br />
                <br />
                {data?.description}
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum
                vero a ullam itaque molestiae quam iste voluptatibus ipsam
                impedit, libero natus. Maxime voluptas itaque dignissimos ad
                quibusdam culpa ducimus voluptatem?
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
