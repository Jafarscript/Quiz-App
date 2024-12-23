import { MdArrowBackIosNew } from "react-icons/md";
import {useRouter} from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  // const location = useLocation()

  return (
    <button
      onClick={() => router.back()}
      className="text-blue-600 text-base hover:bg-blue-600 hover:text-white border-blue-600 px-5 py-1 border rounded-md flex items-center justify-center gap-2 font-medium"
    >
      <MdArrowBackIosNew className="text-xs" /> Back
    </button>
  );
};

export default BackButton;
