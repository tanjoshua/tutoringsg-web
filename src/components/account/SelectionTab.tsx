import { useRouter } from "next/router";

const tabClasses =
  "w-full p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 ";
const tabClassesSelected =
  "w-full p-4 text-indigo-600 border-b-2 border-indigo-600 rounded-t-lg";
export default function SelectionTab() {
  const router = useRouter();
  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 leading-6">
      <ul className="flex -mb-px">
        <li className="">
          <button
            onClick={() => router.replace("/account/details")}
            className={
              router.pathname === "/account/details"
                ? tabClassesSelected
                : tabClasses
            }
          >
            Account details
          </button>
        </li>
        <li className="">
          <button
            onClick={() => router.replace("/account/ratings")}
            className={
              router.pathname === "/account/ratings"
                ? tabClassesSelected
                : tabClasses
            }
          >
            Given Ratings
          </button>
        </li>
      </ul>
    </div>
  );
}
