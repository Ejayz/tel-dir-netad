"use client";
import { BsFillTelephoneOutboundFill } from "react-icons/bs";
import { AddLocalModal } from "./Modals/Local/AddLocalModal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaSortUp ,FaSortDown, FaSort} from "react-icons/fa6";
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";



export default function Local() {
  const [search, setSearch] = useState("");
  const [local_sort, setLocalSort] = useState("local ASC");
  const [group_sort, setGroupSort] = useState("");
  const [department_sort, setDepartmentSort] = useState("");
  const [location_sort, setLocationSort] = useState("");
  const [branch_sort, setBranchSort] = useState("");
  // const [orderby, setOrderBy] = useState("ASC");
  const [page, setPage] = useState(0);


  const { error, data, isFetching, isError, isSuccess, refetch } = useQuery({
    queryKey: [search, local_sort, group_sort, department_sort, location_sort, branch_sort, page],
    queryFn: async () => {
      // console.log(page);
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let bodyContent = JSON.stringify({
        search: search,
        local_sort: local_sort,
        group_sort: group_sort,
        department_sort: department_sort,
        location_sort: location_sort,
        branch_sort: branch_sort,
        page: page,
      });

      let response = await fetch("/api/authenticated/local/list_local", {
        method: "POST",
        headers: headersList,
        body: bodyContent,
      });
      // console.log(response);
      let data = await response.json();
      console.log(data);
      return data;
    },
  });


  return (
    <div className="w-11/12 mx-auto">
      <AddLocalModal></AddLocalModal>

      <div>
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a>Dashboard</a>
            </li>
            <li>
              <a>Local Management</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-row">
        <label className="input w-80">
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
            setLocalSort("");
            setGroupSort("");
            setDepartmentSort("");
            setLocationSort("");
            setDepartmentSort("");
            setSearch("");
          }

          }
        >
          Reset Filter
        </button>

        <div className="flex-5 flex flex-col items-end">
          <label
            htmlFor="my_modal_6"
            className="btn items rounded-md btn-outline btn-primary"
          >
            <BsFillTelephoneOutboundFill className="" />
            New Local
          </label>
        </div>
      </div>
      <div className="divider"></div>
      <div className="overflow-x-auto w-11/12 mx-auto">
        <table className="table table-zebra text-center">
          {/* head */}
          <thead
            className={`${isFetching ? "invisible" : "table-header-group"}`}
          >
            <tr>
              <th>ID</th>
              <th
                className=" cursor-pointer"
                onClick={() => {
                  switch (local_sort) {
                    case "":
                      setLocalSort("local ASC");
                      break;
                    case "local ASC":
                      setLocalSort("local DESC");
                      break;
                    case "local DESC":
                      setLocalSort("");
                      break;
                  }
                }}
              >
                <div className="flex flex-row justify-center">
                  Local
                  {local_sort == "" ? (
                    <FaSort className="my-auto mx-2" />
                  ) : local_sort == "local ASC" ? (
                    <FaSortUp className="my-auto mx-2" />
                  ) : (
                    <FaSortDown className="my-auto mx-2" />
                  )}
                </div>
              </th>
              <th>User</th>
              <th // Group
                className=" cursor-pointer"
                onClick={() => {
                  switch (group_sort) {
                    case "":
                      setGroupSort("group_name ASC");
                      break;
                    case "group_name ASC":
                      setGroupSort("group_name DESC");
                      break;
                    case "group_name DESC":
                      setGroupSort("");
                      break;
                  }
                }}
              >
                <div className="flex flex-row justify-center">
                  Group
                  {group_sort == "" ? (
                    <FaSort className="my-auto mx-2" />
                  ) : group_sort == "group_name ASC" ? (
                    <FaSortUp className="my-auto mx-2" />
                  ) : (
                    <FaSortDown className="my-auto mx-2" />
                  )}
                </div>
              </th>
              <th // Department
                className=" cursor-pointer"
                onClick={() => {
                  switch (department_sort) {
                    case "":
                      setDepartmentSort("department_name ASC");
                      break;
                    case "department_name ASC":
                      setDepartmentSort("department_name DESC");
                      break;
                    case "department_name DESC":
                      setDepartmentSort("");
                      break;
                  }
                }}
              >
                <div className="flex flex-row justify-center">
                  Department
                  {department_sort == "" ? (
                    <FaSort className="my-auto mx-2" />
                  ) : department_sort == "department_name ASC" ? (
                    <FaSortUp className="my-auto mx-2" />
                  ) : (
                    <FaSortDown className="my-auto mx-2" />
                  )}
                </div>
              </th>
              <th // Location
                className=" cursor-pointer"
                onClick={() => {
                  switch (location_sort) {
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
                  switch (branch_sort) {
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
              <th className="w-1/5">Action</th>
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
                data.data?.map((local_data: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td>{(page * 10) + index + 1}</td>
                      <td>{local_data.local}</td>
                      <td></td>
                      <td>{local_data.group_name}</td>
                      <td>{local_data.department_name}</td>
                      <td>{local_data.location_name}</td>
                      <td>{local_data.branch_name}</td>
                      <td>
                        <div className="flex flex-row gap-3 justify-center">
                          <button
                            onClick={() => {
                            
                            }}
                            className="btn btn-outline btn-sm rounded-md btn-accent"
                          >
                            <RiEdit2Fill />
                            Update
                          </button>
                          <button onClick={() => {

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
              className={`join-item btn ${!isSuccess
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
