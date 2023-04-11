export default function Footer() {
  return (
    <footer className="absolute bottom-0 bg-white w-full">
      <div className="p-4 md:flex md:items-center md:justify-between text-gray-500">
        <span className="text-sm sm:text-center ">
          © 2023 tutoring.sg All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0">
          <li>
            <a href="/for-tutors" className="mr-4 hover:underline md:mr-6 ">
              About
            </a>
          </li>
          <li>
            <a href="/terms" className="mr-4 hover:underline md:mr-6">
              Terms & Conditions
            </a>
          </li>
          <li>
            <a href="/josh" className="hover:underline">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
