"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUserFriends,
  faShop,
  faReceipt,
  faTags,
  faChartPie,
  faWarehouse,
  faUserShield,
  faGears,
  faSignOut,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "@auth0/nextjs-auth0/client";

const SideBar = () => {
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);

  const { user, error, isLoading } = useUser();

  return (
    <div className=" min-w-36 sticky top-0 w-auto min-h-[80vh] h-auto mr-5 flex flex-col drop-shadow-md shadow-md shadow-secondary rounded-lg p-5 select-none">
      <Link href="/" passHref>
        <a className="logo-link">
          <Image
            src="/assets/logo.png"
            width={100}
            height={100}
            alt="logo"
            loading="lazy" // Lazy load the image
            priority // Preload the image
            className="logo-image w-full h-full"
          />
        </a>
      </Link>
      <div className="w-full flex flex-col gap-1 mt-10">
        <Link
          href="/"
          className={`flex items-center pr-8 pl-2 py-2 rounded-lg hover:shadow-md ${
            pathname === "/" || pathname === ""
              ? "shadow-md shadow-secondary text-active"
              : ""
          }`}
        >
          {" "}
          <FontAwesomeIcon
            icon={faChartLine}
            height={22}
            width={22}
            alt="dashboard"
          />
          <span className="text-xl ml-2">Dashboard</span>
        </Link>{" "}
        <Link prefetch  
          href="/staffs"
          className={`flex items-center pr-8 pl-2 py-2 rounded-lg hover:shadow-md ${
            pathname === "/staffs"
              ? "shadow-md shadow-secondary text-active"
              : ""
          }`}
        >
          {" "}
          <FontAwesomeIcon
            icon={faUserFriends}
            height={22}
            width={22}
            alt="staffs"
          />
          <span className="text-xl ml-2">Staffs</span>
        </Link>{" "}
        <Link  prefetch
          href="/branches"
          className={`flex items-center pr-8 pl-2 py-2 rounded-lg hover:shadow-md ${
            pathname === "/branches"
              ? "shadow-md shadow-secondary text-active"
              : ""
          }`}
        >
          <FontAwesomeIcon
            icon={faShop}
            height={22}
            width={22}
            alt="branches"
          />
          <span className="text-xl ml-2">Branches</span>
        </Link>{" "}
        <Link prefetch
          href="/products"
          className={`flex items-center pr-8 pl-2 py-2 rounded-lg hover:shadow-md ${
            pathname === "/products"
              ? "shadow-md shadow-secondary text-active"
              : ""
          }`}
        >
          <FontAwesomeIcon
            icon={faTags}
            height={22}
            width={22}
            alt="products"
          />
          <span className="text-xl ml-2">Products</span>
        </Link>{" "}
        <Link prefetch
          href="/record"
          className={`flex items-center pr-8 pl-2 py-2 rounded-lg hover:shadow-md ${
            pathname === "/record"
              ? "shadow-md shadow-secondary text-active"
              : ""
          }`}
        >
          <FontAwesomeIcon
            icon={faWarehouse}
            height={22}
            width={22}
            alt="faWarehouse"
          />
          <span className="text-xl ml-2">Record</span>
        </Link>{" "}
        {/* <Link prefetch
          href="/report"
          className={`flex items-center pr-8 pl-2 py-2 rounded-lg hover:shadow-md ${
            pathname === "/report"
              ? "shadow-md shadow-secondary text-active"
              : ""
          }`}
        >
          <FontAwesomeIcon
            icon={faChartPie}
            height={22}
            width={22}
            alt="report"
          />
          <span className="text-xl ml-2">Report</span>
        </Link>{" "} */}
        <Link prefetch
          href="/admin"
          className={`flex items-center pr-8 pl-2 py-2 rounded-lg hover:shadow-md ${
            pathname === "/admin"
              ? "shadow-md shadow-secondary text-active"
              : ""
          }`}
        >
          <FontAwesomeIcon
            icon={faUserShield}
            height={22}
            width={22}
            alt="faUserShield"
          />
          <span className="text-xl ml-2">Admin</span>
        </Link>{" "}
        <Link prefetch
          href="/settings"
          className={`flex items-center pr-8 pl-2 py-2 rounded-lg hover:shadow-md ${
            pathname === "/settings"
              ? "shadow-md shadow-secondary text-active"
              : ""
          }`}
        >
          <FontAwesomeIcon
            icon={faGears}
            height={22}
            width={22}
            alt="Settings"
          />
          <span className="text-xl ml-2">Settings</span>
        </Link>{" "}
      </div>
      {user && (
        <a
          href="/api/auth/logout"
          id="logout"
          className="mt-auto text-xl w-auto py-3 px-2 flex justify-center items-center rounded-xl text-primary hover:text-warning hover:font-bold"
        >
          <FontAwesomeIcon
            icon={loading ? faSpinner : faSignOut}
            height={22}
            width={22}
            alt="faSignOut"
            className="mr-2"
          />
          Logout
        </a>
      )}
    </div>
  );
};

export default SideBar;
