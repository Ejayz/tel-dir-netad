"use client";

import { FaMapLocation, FaSortUp } from "react-icons/fa6";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSortDown } from "react-icons/fa";
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import UpdateLocationModal from "./Modals/Location/UpdateLocationModal";
import { AddBranchModal } from "./Modals/Branch/AddBranchModal";

export default function Branch() {
  const [search, setSearch] = useState("");
  const [column_name, setColumnName] = useState("location_id");
  const [orderby, setOrderBy] = useState("ASC");
  const [page, setPage] = useState(0);
  const [location_id, setLocationId] = useState();

  const { error, data, isFetching, isError, isSuccess, refetch } = useQuery({
    queryKey: ["List_Group", search, column_name, orderby, page],
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
      <AddBranchModal FetchList={refetch} />
      <UpdateLocationModal
        FetchList={refetch}
        location_id={location_id}
        setLocationId={setLocationId}
      />
      <div>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <a>Dashboard</a>
            </li>
            <li>
              <a>Branch Management</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-row">
        <label className="flex-1 input">
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

        <div className="flex flex-col items-end flex-5">
          <button
            onClick={() => {
              (
                document.getElementById("AddBranch") as HTMLDialogElement
              ).showModal();
            }}
            className="rounded-md btn items btn-outline btn-primary"
          >
            <FaMapLocation />
            New Branch
          </button>
        </div>
      </div>
      <div className="divider"></div>
      <div className="w-11/12 mx-auto overflow-x-auto">
        <table className="table text-center table-zebra">
          {/* head */}
          <thead
            className={`${isFetching ? "invisible" : "table-header-group"}`}
          >
            <tr>
              <th>ID</th>

              {column_name == "location_name" ? (
                <th
                  className="cursor-pointer "
                  onClick={() => {
                    setColumnName("location_name");
                    if (orderby == "ASC") {
                      setOrderBy("DESC");
                    } else {
                      setOrderBy("ASC");
                    }
                  }}
                >
                  <div className="flex flex-row justify-center">
                    Group Name
                    {orderby == "ASC" ? (
                      <FaSortUp className="mx-2 my-auto" />
                    ) : (
                      <FaSortDown className="mx-2 my-auto" />
                    )}
                  </div>
                </th>
              ) : (
                <th
                  className="cursor-pointer"
                  onClick={() => {
                    setColumnName("location_name");
                  }}
                >
                  Group Name
                </th>
              )}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}

            {isError || error ? (
              <tr>
                <td colSpan={3} className="text-center font-xl text-error">
                  Something went wrong while we retrieve data.
                </td>
              </tr>
            ) : isFetching ? (
              <tr>
                <td colSpan={3} className="text-center font-xl text-info">
                  Please wait while we load your data
                  <div className="loading loading-infinity "></div>
                </td>
              </tr>
            ) : isSuccess ? (
              data.status === 404 ? (
                <tr>
                  <td colSpan={3} className="text-center font-xl text-error">
                    {data.statusText}
                  </td>
                </tr>
              ) : data.status === 500 ? (
                <td colSpan={3} className="text-center font-xl text-error">
                  {data.statusText}
                </td>
              ) : (
                data.data?.map((location_data: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td>{(page*10)+index+1}</td>
                      <td>{location_data.location_name}</td>
                      <td>
                        <div className="flex flex-row justify-center gap-3">
                          <button
                            onClick={() => {
                              setLocationId(location_data.location_id);

                              (
                                document.getElementById(
                                  "UpdateLocation"
                                ) as HTMLDialogElement
                              ).showModal();
                            }}
                            className="rounded-md btn btn-outline btn-sm btn-accent"
                          >
                            <RiEdit2Fill />
                            Update
                          </button>
                          <button
                            onClick={() => {}}
                            className="rounded-md btn btn-outline btn-sm btn-error"
                          >
                            <RiDeleteBin2Fill />
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )
            ) : (
              <tr>
                <td>Something went wrong</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex flex-row w-full my-auto">
          <div className="mx-auto my-2 join">
            <button
              onClick={() => {
                if (page !== 0) {
                  setPage(page - 1);
                }
              }}
              className={`join-item btn ${page == 0 ? "btn-disabled" : ""}`}
            >
              «
            </button>
            <button className="join-item btn">Page {page + 1}</button>
            <button
              onClick={() => {
                if (data.data.length >= 10) {
                  setPage(page + 1);
                }
              }}
              className={`join-item btn ${
                !isSuccess
                  ? ""
                  : data.status == 404
                  ? "btn-disabled"
                  : data.data.length !== 10
                  ? "btn-disabled"
                  : ""
              }`}
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
