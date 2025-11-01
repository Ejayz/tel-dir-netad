"use client";
import { BsFillTelephoneOutboundFill } from "react-icons/bs";
import { AddLocalModal } from "./Modals/AddLocalModal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaMapLocation, FaSortUp } from "react-icons/fa6";
import { FaSortDown } from "react-icons/fa";
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";



export default function Local() {
  const [search, setSearch] = useState("");
  const [local_name, setLocalName] = useState("local");
  const [group_name, setGroupName] = useState("group");
  const [department_name, setDepartmentName] = useState("department");
  const [location_name, setLocationName] = useState("location");
  const [branch_name, setBranchName] = useState("branch");
  const [orderby, setOrderBy] = useState("ASC");
  const [page, setPage] = useState(0);
  const [local, setLocationId] = useState();


  const { error, data, isFetching, isError, isSuccess, refetch } = useQuery({
    queryKey: ["List_local", search, local_name, group_name, department_name, orderby, page],
    queryFn: async () => {
      // console.log(page);
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let bodyContent = JSON.stringify({
        orderby: orderby,
        search: search,
        local_name: local_name,
        group_name: group_name,
        department_name: department_name,
        location_name: location_name,
        branch_name: branch_name,
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
          <input type="search" className="grow" placeholder="Search" />
          <kbd className="kbd kbd-sm">⌘</kbd>
          <kbd className="kbd kbd-sm">K</kbd>
        </label>

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
              <th className="w-1/20">ID</th>

              {local_name == "local" ? (
                <th
                  className=" cursor-pointer w-1/20"
                  onClick={() => {
                    setLocalName("local");
                    if (orderby == "ASC") {
                      setOrderBy("DESC");
                    } else {
                      setOrderBy("ASC");
                    }
                  }}
                >
                  <div className="flex flex-row justify-center ">
                    Local
                    {orderby == "ASC" ? (
                      <FaSortUp className="my-auto mx-2" />
                    ) : (
                      <FaSortDown className="my-auto mx-2" />
                    )}
                  </div>
                </th>
              ) : (
                <th
                  className="cursor-pointer w-1/20"
                  onClick={() => {
                    setLocalName("local");
                  }}
                >
                  Local
                </th>
              )}
              <th className="w-1/5">User</th>
              <th className="w-1/5">Group</th>
              <th className="w-1/20">Department</th>
              <th className="w-1/5">Location</th>
              <th className="w-1/20">Branch</th>
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
                      <td>{(page*10)+index+1}</td>
                      <td>{local_data.local}</td>
                      <td></td>
                      <td>{local_data.group_name}</td>
                      <td>{local_data.department_name}</td>
                      <td>{local_data.location_name}</td>
                      <td>{local_data.branch_name}</td>
                      <td>
                        <div className="flex flex-row gap-3 justify-center">
                          <button
                            // onClick={() => {
                            //   setLocationId(location_data.location_id);

                            //   (
                            //     document.getElementById(
                            //       "UpdateLocation"
                            //     ) as HTMLDialogElement
                            //   ).showModal();
                            // }}
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
