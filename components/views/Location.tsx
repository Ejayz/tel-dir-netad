"use client";

import { FaMapLocation, FaSortUp } from "react-icons/fa6";
import { AddLocationModal } from "./AddLocationModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSortDown } from "react-icons/fa";

export default function Location() {
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [search, setSearch] = useState("");
  const [column_name, setColumnName] = useState("id");
  const [orderby, setOrderBy] = useState("ASC");
  const [page, setPage] = useState(0);
  const { error, data, isFetching, isError } = useQuery({
    queryKey: ["List_Location", search, column_name, orderby, page],
    queryFn: async () => {
      console.log(page);
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let bodyContent = JSON.stringify({
        orderby: orderby,
        search: search,
        column_name: column_name,
        page: page,
      });

      let response = await fetch("/api/authenticated/location/list_location", {
        method: "POST",
        headers: headersList,
        body: bodyContent,
      });

      let data = await response.json();
      return data;
    },
  });

  return (
    <div className="w-11/12 mx-auto">
      <AddLocationModal />
      <div>
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a>Dashboard</a>
            </li>
            <li>
              <a>Location Management</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-row">
        <label className="input flex-1">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            className="grow"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search"
          />
          <kbd className="kbd kbd-sm">⌘</kbd>
          <kbd className="kbd kbd-sm">K</kbd>
        </label>

        <div className="flex-5 flex flex-col items-end">
          <button
            onClick={() => {
              (
                document.getElementById("AddLocation") as HTMLDialogElement
              ).showModal();
            }}
            className="btn items rounded-md btn-outline btn-primary"
          >
            <FaMapLocation />
            New Location
          </button>
        </div>
      </div>
      <div className="divider"></div>
      <div className="overflow-x-auto w-11/12 mx-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              {column_name !== "location_id" ? (
                <th
                  className="flex flex-row cursor-pointer"
                  onClick={() => {
                    setColumnName("tbl_location");
                    if (orderby == "ASC") {
                      setOrderBy("DESC");
                    } else {
                      setOrderBy("ASC");
                    }
                  }}
                > Location Name
                  {orderby == "ASC" ? (
                    <FaSortUp className="my-auto mx-2" />
                  ) : (
                    <FaSortDown className="my-auto mx-2" />
                  )}
                </th>
              ) : (
                <th className="flex flex-row">Location Name</th>
              )}
              {column_name !== "location_name" ? (
                <th
                  className="flex flex-row cursor-pointer"
                  onClick={() => {
                    setColumnName("tbl_location");
                    if (orderby == "ASC") {
                      setOrderBy("DESC");
                    } else {
                      setOrderBy("ASC");
                    }
                  }}
                > Location Name
                  {orderby == "ASC" ? (
                    <FaSortUp className="my-auto mx-2" />
                  ) : (
                    <FaSortDown className="my-auto mx-2" />
                  )}
                </th>
              ) : (
                <th className="flex flex-row">Location Name</th>
              )}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
            </tr>
           
          </tbody>
        </table>
      </div>
    </div>
  );
}
