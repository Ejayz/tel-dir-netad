"use client";

import { FaPlus, FaSortUp, FaSortDown, FaSort  } from "react-icons/fa6";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import { AddGroupModal } from "./Modals/Group/AddGroupModal";
import { EditGroupModal } from "./Modals/Group/EditGroup";
import { RemoveGroupModal } from "./Modals/Group/RemoveGroup";
import { AddDepartmentModal } from "./Modals/Department/AddDepartmentModal";
import { group } from "console";

export default function Group() {
  const [search, setSearch] = useState("");
  const [group_name, setGroupName] = useState("");
  const [page, setPage] = useState(0);
  const [group_id, setGroupId] = useState(0);
  const [group_sort, setGroupSort] = useState("group_name ASC");
  const [department_sort, setDepartmentSort] = useState("")
  const [department_name, setDepartmentName]= useState("");
  const [department_id, setDepartmentId] = useState(-1);
 const [department_list, setDepartmentList] = useState({data:[{department_id : 0, department_name : "test"}]})

  const { error, data, isFetching, isError, isSuccess, refetch } = useQuery({
    queryKey: [search, group_name, group_sort, department_sort, page],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let bodyContent = JSON.stringify({
        search: search,
        group_sort: group_sort,
        department_sort: department_sort,
        page: page,
      });

      let response = await fetch("/api/authenticated/group/list_group", {
        method: "POST",
        headers: headersList,
        body: bodyContent,
      });

      let data = await response.json();
      return data;
    },
  });
    const { error:d_error, data:d_data, isFetching:d_isFetching, isError:d_isError, isSuccess:d_isSuccess , refetch:d_refetch} = useQuery({
    queryKey:[],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let bodyContent = JSON.stringify({
      });

      let response = await fetch("api/authenticated/department/list_department_only",{
        method: "POST",
        headers: headersList,
        body: bodyContent,
      });
      let data = await response.json();
      console.log("Fetch Dept. List");
      setDepartmentList(data);
      return data;
      }
  });



  return (
    <div className="w-11/12 mx-auto">
      
      <AddGroupModal 
      FetchList={refetch} 
      department_list={department_list}/>
      <AddDepartmentModal FetchList={d_refetch} />
      <EditGroupModal
      FetchList={refetch}
      group_id={group_id}
      group_name={group_name}
      department_name={department_name}
      department_id ={department_id}
      department_list={department_list}/>
      <RemoveGroupModal
      FetchList={refetch}
      group_id={group_id}
      group_name={group_name}
      />
      <div>
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a>Dashboard</a>
            </li>
            <li>
              <a>Group Management</a>
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
            setGroupSort("");
            setDepartmentSort("");
            setDepartmentSort("");
            setSearch("");
          }

          }
        >
          Reset Filter
        </button>
        <div className="flex-5 flex flex-col items-end">
          <button
            onClick={() => {
              // setDepartmentList(d_data);
              (
                document.getElementById("AddGroup") as HTMLDialogElement
              ).showModal();
            }}
            className="btn items rounded-md btn-outline btn-primary"
          >
            <FaPlus />
            New Group
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
            <tr>
              <th>ID</th>

              <th // Group
                className=" cursor-pointer w-1/3"
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
              <th>locals</th>
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
                data.data?.map((group_data: any, index: number) => {
                  let local_num = group_data.local_list.length;
                  let local_list = '';
                  if(local_num){
                    let i = 0;
                    while(i<local_num){
                      local_list += group_data.local_list[i].local +', ';
                      i++;
                    }
                    local_list = local_list.slice(0,local_list.length -2)
                  }
                  return (
                    <tr key={index} className="hover:bg-secondary hover:font-semibold hover:text-primary-content">
                      <td>{(page * 10) + index + 1}</td>
                      <td>{group_data.group_name}</td>
                      <td>{group_data.department_name}</td>
                      <td><details>
                        <summary>{local_num}</summary>
                        <p>{local_list}</p>
                        </details></td>
                      <td>
                        <div className="flex flex-row gap-3 justify-center">
                          <button
                            onClick={() => {
                              setGroupId(group_data.group_id);
                              setGroupName(group_data.group_name);
                              setDepartmentName(group_data.department_name);
                              setDepartmentId(group_data.department_id);
                              (
                                document.getElementById(
                                  "EditGroup"
                                ) as HTMLDialogElement
                              ).showModal();
                            }}
                            className="btn btn-outline btn-sm rounded-md btn-accent"
                          >
                            <RiEdit2Fill />
                            Edit
                          </button>
                          <button onClick={() => {
                            setGroupId(group_data.group_id);
                            setGroupName(group_data.group_name);
                            (
                                document.getElementById(
                                  "RemoveGroup"
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
