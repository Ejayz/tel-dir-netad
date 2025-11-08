"use client";

import { FaMapLocation, FaSortDown, FaSort, FaSortUp } from "react-icons/fa6";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RiBillLine, RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import { AddDepartmentModal } from "./Modals/Department/AddDepartmentModal";
import { RemoveDepartmentModal } from "./Modals/Department/RemoveDepartment";
import { EditDepartmentModal } from "./Modals/Department/EditDepartment";

export default function Department() {
  const [search, setSearch] = useState("");
  const [department_name, setDepartmentName] = useState("");
  const [page, setPage] = useState(0);
  const [department_id, setDepartmentId] = useState(0);
  const [department_sort, setDepartmentSort] = useState("department_name ASC");

  const { error, data, isFetching, isError, isSuccess, refetch } = useQuery({
    queryKey: [search, department_sort, page],
    queryFn: async () => {
      console.log(page);
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let bodyContent = JSON.stringify({
        search: search,
        department_sort: department_sort,
        page: page,
      });

      let response = await fetch("/api/authenticated/department/list_department", {
        method: "POST",
        headers: headersList,
        body: bodyContent,
      });

      let data = await response.json();
      return data;
    },
  });

  // console.log(data);
  return (
    <div className="w-11/12 mx-auto">
      <AddDepartmentModal FetchList={refetch} />
      <RemoveDepartmentModal 
      FetchList={refetch}
      department_id={department_id}
      department_name={department_name}
      />
      <EditDepartmentModal 
      FetchList={refetch}
      department_id={department_id} 
      department_name={department_name}
      />
      <div>
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a>Dashboard</a>
            </li>
            <li>
              <a>Department Management</a>
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
                document.getElementById("AddDepartment") as HTMLDialogElement
              ).showModal();
            }}
            className="btn items rounded-md btn-outline btn-primary"
          >
            <FaMapLocation />
            New Department
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
              <th>#</th>
              <th // Department
                className=" cursor-pointer w-1/3"
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
              <th >Groups</th>
              <th>Locals</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}

            {isError || error ? (
              <tr>
                <td></td>
                <td colSpan={3} className="font-xl text-center text-error">
                  Something went wrong while we retrieve data.
                </td>
              </tr>
            ) : isFetching ? (
              <tr>
                <td></td>
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
                data.data?.map((department_data: any, index: number) => {
                  const group_num = department_data.group_list?.length;
                  let group_array=[];
                  let local_list="";
                  let local_num = 0;
                  for(let i=0;i<group_num;i++){
                    const local_count = department_data.group_list[i].local_list?.length;
                    local_num+= local_count
                    group_array[i] = department_data.group_list[i]
                    let j=0;
                    while(j<local_count){
                      local_list+=group_array[i].local_list[j]?.local;
                      local_list+=", ";
                      j++;
                    }
                  }
                  local_list = local_list.slice(0,local_list.length - 2)
                  return (
                    <tr key={index} className="hover:bg-secondary hover:font-semibold hover:text-primary-content">
                      <td className="w-2">{(page * 10) + index + 1}</td>
                      <td>{department_data.department_name}</td>
                      <td>{<details>
                        <summary>{group_num}</summary>
                        <ul className="text-left">
                      {
                        group_array.map((g_array:any, jndex: number)=>{
                          return(
                            <li key={jndex} className="text-sm">{(jndex+1)+'. '+g_array.group_name+'['+g_array.local_list?.length+']'}</li>
                          );
                        })
                      }
                      </ul>
                        
                      </details>}</td>
                      <td>{
                        <details>
                          <summary>{local_num}</summary>
                          <p>{local_list}</p>
                        </details>
                        }
                      </td>
                      <td className="w-1/20">
                        <div className="flex flex-row gap-3 justify-center">
                          <button
                            onClick={() => {
                              setDepartmentId(department_data.department_id);
                              setDepartmentName(department_data.department_name);
                              (
                                document.getElementById(
                                  "EditDepartment"
                                ) as HTMLDialogElement
                              ).showModal();
                            }}
                            className="btn btn-outline btn-sm rounded-md btn-accent"
                          >
                            <RiEdit2Fill />
                            Edit
                          </button>

                          <button onClick={() => {
                            setDepartmentId(department_data.department_id);
                            setDepartmentName(department_data.department_name);
                            console.log(department_name,department_id);
                            (
                              document.getElementById(
                                "RemoveDepartment"
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
