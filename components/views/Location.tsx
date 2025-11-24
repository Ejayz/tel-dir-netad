"use client";

import { FaMapLocation, FaSortUp } from "react-icons/fa6";
import { AddLocationModal } from "./Modals/Location/AddLocationModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSortDown, FaSort } from "react-icons/fa";
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import { EditLocationModal } from "./Modals/Location/EditLocationModal";
import { RemoveLocationModal } from "./Modals/Location/RemoveLocationModal";
import { AddBranchModal } from "./Modals/Branch/AddBranchModal";

export default function Location({Admin}:{Admin?:boolean}) {
  const [search, setSearch] = useState("");
  const [location_sort, setLocationSort] = useState("location_name ASC");
  const [branch_sort, setBranchSort] = useState("");
  const [page, setPage] = useState(0);
  const [location_id, setLocationId] = useState(-1);
  const [location_name, setLocationName] = useState("");
  const [branch_id, setBranchId] = useState(0);
  const [branch_data, setBranchData] = useState({data:[{branch_id:0,branch_name:"No Branch" }]});

  const { error, data, isFetching, isError, isSuccess ,refetch} = useQuery({
    queryKey: [search, location_sort, branch_sort,page],
    queryFn: async () => {
      console.log(page);
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let bodyContent = JSON.stringify({
        search: search,
        location_sort: location_sort,
        branch_sort: branch_sort,
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

  const { error:b_error, data:b_data, isFetching:b_isFetching, isError:b_isError, isSuccess:b_isSuccess ,refetch:b_refetch} = useQuery({
    queryKey: [branch_data],
    queryFn: async () => {
      console.log(page);
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let bodyContent = JSON.stringify({
        orderby: "ASC",
        search: search,
        column_name: "branch_name",
        page: page,
      });

      let response = await fetch("/api/authenticated/branch/list_branch", {
        method: "POST",
        headers: headersList,
        body: bodyContent,
      });

      let data = await response.json();
      setBranchData(data);
      return data;
    },
  });

  return (
    <div className="w-11/12 mx-auto">
      <AddBranchModal FetchList={b_refetch}/>
      <AddLocationModal 
       FetchList={refetch}
       branch_data={branch_data}
       Admin = {Admin}/>
      <EditLocationModal
        FetchList={refetch}
        location_id={location_id}
        location_name = {location_name}
        branch_id={branch_id}
       branch_data={branch_data}
       Admin = {Admin}/>
      <RemoveLocationModal
        FetchList={refetch}
        location_id={location_id}
        location_name={location_name} />
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
         <button className="btn ml-10"
          onClick={() => {
            setLocationSort("");
            setSearch("");
          }

          }
        >
          Reset Filter
        </button>
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
        <table className="table table-zebra text-center text-lg">
          {/* head */}
          <thead
            className={`${isFetching ? "invisible" : "table-header-group"}`}
          >
            <tr className="text-lg">
             <th>#</th>

              <th // Location
                className=" cursor-pointer"
                onClick={() => {
                  switch (location_sort){
                    case "":
                      setLocationSort("location_name ASC");
                      break;
                    case "location_name ASC":
                      setLocationSort("location_name DESC");
                      break;
                    case "location_name DESC":
                      setLocationSort("");
                      break;
                  }
                }}
              >
                <div className="flex flex-row justify-center">
                  Location
                  {location_sort == "" ? (
                    <FaSort className="my-auto mx-2" />
                  ) : location_sort == "location_name ASC" ? (
                    <FaSortUp className="my-auto mx-2" />
                  ) : (
                    <FaSortDown className="my-auto mx-2" />
                  )}
                </div>
              </th>
              <th // Branch
                className=" cursor-pointer"
                onClick={() => {
                  switch (branch_sort){
                    case "":
                      setBranchSort("branch_name ASC");
                      break;
                    case "branch_name ASC":
                      setBranchSort("branch_name DESC");
                      break;
                    case "branch_name DESC":
                      setBranchSort("");
                      break;
                  }
                }}
              >
                <div className="flex flex-row justify-center">
                  Branch
                  {branch_sort == "" ? (
                    <FaSort className="my-auto mx-2" />
                  ) : branch_sort == "branch_name ASC" ? (
                    <FaSortUp className="my-auto mx-2" />
                  ) : (
                    <FaSortDown className="my-auto mx-2" />
                  )}
                </div>
              </th>
              <th>Local Count</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}

            {isError || error ? (
              <tr>
                <td colSpan={3} className="font-xl text-center text-error">
                  Something went wrong while we retrieve data.
                </td>
              </tr>
            ) : isFetching ? (
              <tr>
                <td colSpan={3} className="font-xl text-center text-info">
                  Please wait while we load your data
                  <div className="loading loading-infinity "></div>
                </td>
              </tr>
            ) : isSuccess ? (
              data.status === 404 ? (
                <tr>
                  <td colSpan={3} className="font-xl text-center text-error">
                    {data.statusText}
                  </td>
                </tr>
              ) : data.status === 500 ? (
                <td colSpan={3} className="font-xl text-center text-error">
                  {data.statusText}
                </td>
              ) : (
                data.data?.map((location_data: any, index: number) => {
                  if(index === 10) return; // limit to ten
                  return (
                    <tr key={index}>
                      <td>{(page*10)+index+1}</td>
                      <td>{location_data.location_name}</td>
                      <td>{location_data.branch_name}</td>
                      <td>{location_data.local_list.length}</td>
                      <td>
                        <div className="flex flex-row gap-3 justify-center">
                          <button
                            onClick={() => {
                              setLocationId(location_data.location_id);
                              setLocationName(location_data.location_name);
                              setBranchId(location_data.branch_id);
                              (
                                document.getElementById(
                                  "EditLocation"
                                ) as HTMLDialogElement
                              ).showModal();
                            }}
                            className="btn btn-outline btn-sm rounded-md btn-accent"
                          >
                            <RiEdit2Fill />
                            Edit
                          </button>
                          <button onClick={()=>{
                              setLocationId(location_data.location_id);
                              setLocationName(location_data.location_name);
                              (
                                document.getElementById(
                                  "RemoveLocation"
                                ) as HTMLDialogElement
                              ).showModal();
                          }} className="btn btn-outline btn-sm rounded-md btn-error">
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
          <div className="join mx-auto my-2">
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
                  : data.data.length <= 10
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
