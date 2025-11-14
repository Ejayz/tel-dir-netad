"use client";

import { FaPlus, FaSortDown, FaSort, FaSortUp, FaOldRepublic } from "react-icons/fa6";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RiBillLine, RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import { AddBranchModal } from "./Modals/Branch/AddBranchModal";
import { AddUserModal } from "./Modals/Users/AddUserModal";
import { RemoveUserModal } from "./Modals/Users/RemoveUser";
import { EditUserModal } from "./Modals/Users/EditUserModal";

export default function User() {
  const [search, setSearch] = useState("");
  const [username, setUsername] = useState("");
  const [page, setPage] = useState(0);
  const [uuid, setUuid] = useState("");
  const [users_sort, setUserSort] = useState("username ASC");
  const [branch_data, setBranchData] = useState({ data: [{ branch_id: 0, branch_name: "No Branch" }] });
  const [branch, setBranch] = useState(0);
  const [user_data, setUserData] = useState({ uuid: "", username: "", email: "", first_name: "", middle_name: "", last_name: "", branch_id: 0 })

  const { error, data, isFetching, isError, isSuccess, refetch } = useQuery({
    queryKey: [search, users_sort, page],
    staleTime:0,
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let bodyContent = JSON.stringify({
        search: search,
        users_sort: users_sort,
        page: page,
      });

      let response = await fetch("/api/authenticated/users/list_users", {
        method: "POST",
        headers: headersList,
        body: bodyContent,
        cache: 'no-store'
      });

      let data = await response.json();
      console.log(data);
      return data;
    },
  });

  const { error: b_error, data: b_data, isFetching: b_isFetching, isError: b_isError, isSuccess: b_isSuccess, refetch: b_refetch } = useQuery({
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
  // console.log(data);
  return (
    <div className="w-11/12 mx-auto">
      <AddBranchModal
        FetchList={b_refetch} />
      <AddUserModal
        FetchList={refetch}
        branch_data={branch_data} />
      <RemoveUserModal
        FetchList={refetch}
        uuid={uuid}
        username={username}
        branch_id={branch}
      />
      <EditUserModal
        FetchList={refetch}
        user_data={user_data}
        branch_data={branch_data} />
      <div>
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a>Dashboard</a>
            </li>
            <li>
              <a>User Management</a>
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
                document.getElementById("AddUser") as HTMLDialogElement
              ).showModal();
            }}
            className="btn items rounded-md btn-outline btn-primary"
          >
            <FaPlus />
            New User
          </button>
        </div>
      </div>
      <div className="divider"></div>
      <div className="overflow-x-auto w-11/12 mx-auto">
        <table className="table table-zebra text-center text-md">
          {/* head */}
          <thead
            className={`${isFetching ? "invisible" : "table-header-group"}`}
          >
            <tr className="text-md">
              <th>#</th>
              <th // User
                className=" cursor-pointer w-1/3"
                onClick={() => {
                  switch (users_sort) {
                    case "":
                      setUserSort("username ASC");
                      break;
                    case "username ASC":
                      setUserSort("username DESC");
                      break;
                    case "username DESC":
                      setUserSort("");
                      break;
                  }
                }}
              >
                <div className="flex flex-row justify-center">
                  User Name
                  {users_sort == "" ? (
                    <FaSort className="my-auto mx-2" />
                  ) : users_sort == "username ASC" ? (
                    <FaSortUp className="my-auto mx-2" />
                  ) : (
                    <FaSortDown className="my-auto mx-2" />
                  )}
                </div>
              </th>
              <th>E-mail</th>
              <th>Name</th>
              <th>Branch</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}

            {isError || error || b_error ? (
              <tr>
                <td></td>
                <td colSpan={3} className="font-xl text-center text-error">
                  Something went wrong while we retrieve data.
                </td>
              </tr>
            ) : isFetching || b_isFetching ? (
              <tr>
                <td></td>
                <td colSpan={3} className="font-xl text-center text-info">
                  Please wait while we load your data
                  <div className="loading loading-infinity "></div>
                </td>
              </tr>
            ) : isSuccess || b_isSuccess ? (
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
                data.data?.map((user_data: any, index: number) => {
                  let type = user_data.branch_name || "";
                  if (user_data.branch_name == "No Branch") {
                    type = "Admin"
                  }
                  return (
                    <tr key={index} className="hover:bg-secondary hover:font-semibold hover:text-primary-content">
                      <td className="w-1/20">{(page * 10) + index + 1}</td>
                      <td className="w-1/6">{user_data.username}</td>
                      <td className="w-1/6">{user_data.email}</td>
                      <td className="w-1/6">{user_data.first_name + " " + user_data.middle_name?.slice(0, 1) + ". " + user_data.last_name}</td>
                      <td className="w-1/6">{type}</td>
                      <td className="w-2/20">
                        <div className="flex flex-row gap-3 justify-center">
                          <button
                            onClick={() => {
                              setUserData({
                                uuid: user_data.uuid,
                                username: user_data.username,
                                email: user_data.email,
                                first_name: user_data.first_name,
                                middle_name: user_data.middle_name,
                                last_name: user_data.last_name,
                                branch_id: user_data.branch_id,
                              });
                              (
                                document.getElementById(
                                  "EditUser"
                                ) as HTMLDialogElement
                              ).showModal();
                            }}
                            className={user_data.current_user ? ("btn hidden btn-outline btn-sm rounded-md btn-accent") : ("btn btn-outline btn-sm rounded-md btn-accent")}
                          >
                            <RiEdit2Fill />
                            Edit
                          </button>
                          <button onClick={() => {
                            setUsername(user_data.username);
                            setUuid(user_data.uuid);
                            setBranch(user_data.branch_id);
                            (

                              document.getElementById(
                                "RemoveUser"
                              ) as HTMLDialogElement
                            ).showModal();
                          }} className={user_data.current_user ? ("btn hidden btn-outline btn-sm rounded-md btn-error") : ("btn btn-outline btn-sm rounded-md btn-error")}>
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
