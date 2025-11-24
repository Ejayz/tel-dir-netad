"use client";
import { BsFillTelephoneOutboundFill } from "react-icons/bs";
import { AddLocalModal } from "./Modals/Local/AddLocalModal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {  FaSort, FaArrowDownAZ, FaArrowDownZA, FaArrowDown19, FaArrowDown91} from "react-icons/fa6";
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import { RemoveLocalModal } from "./Modals/Local/RemoveLocal";
import { AddGroupModal } from "./Modals/Group/AddGroupModal";
import { AddDepartmentModal } from "./Modals/Department/AddDepartmentModal";
import { AddBranchModal } from "./Modals/Branch/AddBranchModal"; 
import { AddLocationModal } from "./Modals/Location/AddLocationModal";
import { EditLocalModal } from "./Modals/Local/EditLocalModal";


export default function Local({Admin}:{Admin?:Boolean}) {
  const [search, setSearch] = useState("");
  const [local_sort, setLocalSort] = useState("local ASC");
  const [group_sort, setGroupSort] = useState("");
  const [department_sort, setDepartmentSort] = useState("");
  const [location_sort, setLocationSort] = useState("");
  const [branch_sort, setBranchSort] = useState("");
  const [page, setPage] = useState(0);
  const [local, setLocal] = useState(0);
  const [department, setDepartment] = useState({department_id:0, department_name:""});
  const [group, setGroup] = useState({group_id: 0, group_name: ""})
  const [branch, setBranch] = useState({branch_id: 0, branch_name: ""})
  const [location, setLocation] = useState({location_id:0, location_name:""});
  const [location_filter, setlocationFilter] = useState("");
  const [group_filter, setGroupFilter] = useState("");
  const [group_list, setGroupList] = useState({data:[{group_id:0,group_name:""}]});
  const [department_list, setDepartmentList] = useState({data:[{department_id: 0 , department_name: ""}]});
  const [branch_list, setBranchList] = useState({data:[{branch_id:0, branch_name: ""}]});
  const [location_list, setLocationList] = useState({data:[{location_id:0,location_name:""}]});
  //UDF
  const changeGroup = (value:string) =>{
    setGroupFilter(value);
    g_refetch;
  }
  const changeLocation = (value:string) =>{
    setlocationFilter(value);
    l_refetch;
  }


  const { error, data, isFetching, isError, isSuccess, refetch } = useQuery({
    queryKey: [search, local_sort, group_sort, department_sort, location_sort, branch_sort, page],
    queryFn: async () => {
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
      let data = await response.json();
      return data;
    },
  });
  const { error:d_error, data:d_data, isFetching:d_isFetching, isError:d_isError, isSuccess:d_isSuccess, refetch:d_refetch } = useQuery({
    queryKey: [department_list],
    queryFn: async () => {
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

      let response = await fetch("/api/authenticated/department/list_department_only", {
        method: "POST",
        headers: headersList,
        body: bodyContent,
      });

      let data = await response.json();
      setDepartmentList(data);
      return data;
    },
  });
  const { error:g_error, data:g_data, isFetching:g_isFetching, isError:g_isError, isSuccess:g_isSuccess, refetch:g_refetch } = useQuery({
    queryKey: [group_list,group_filter],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let bodyContent = JSON.stringify({
        department_id:group_filter
      });

      let response = await fetch("/api/authenticated/group/list_group_only", {
        method: "POST",
        headers: headersList,
        body: bodyContent,
      });
      
      let data = await response.json();
      setGroupList(data);
      return data;
    },
  });
  const { error:b_error, data:b_data, isFetching:b_isFetching, isError:b_isError, isSuccess:b_isSuccess ,refetch:b_refetch} = useQuery({
    queryKey: [branch_list],
    queryFn: async () => {
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
      setBranchList(data);
      return data;
    },
  });
  const { error:l_error, data:l_data, isFetching:l_isFetching, isError:l_isError, isSuccess:l_isSuccess, refetch:l_refetch } = useQuery({
    queryKey: [location_list,location_filter],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let bodyContent = JSON.stringify({
        branch_id:location_filter
      });

      let response = await fetch("/api/authenticated/location/list_location_only", {
        method: "POST",
        headers: headersList,
        body: bodyContent,
      });
      
      let data = await response.json();
      setLocationList(data);
      return data;
    },
  });


  return (
    <div className="w-11/12 mx-auto">
      <AddBranchModal
      FetchList={b_refetch}
      />
      <AddLocationModal 
      FetchList={l_refetch}
      branch_data={branch_list}
      Admin={Admin?true:false}/>
      <AddDepartmentModal 
      FetchList={d_refetch}/>
      <AddGroupModal
      FetchList={g_refetch}
      department_list={department_list}/>
      <AddLocalModal 
      FetchList={refetch}
      group_list={group_list}
      group_filter={changeGroup}
      location_filter={changeLocation}
      department_list={department_list}
      branch_list={branch_list}
      location_list={location_list}
      />
      <EditLocalModal
      FetchList={refetch}
      group_list={group_list}
      group_filter={changeGroup}
      location_filter={changeLocation}
      department_list={department_list}
      branch_list={branch_list}
      location_list={location_list}
      local={local}
      department={department}
      branch={branch}
      group={group}
      location={location}
      />
      <RemoveLocalModal
      FetchList = {refetch}
      local = {local}
      />


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
            setLocalSort("local ASC");
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
          <button
          type="button"
          onClick={() => {
              (
                document.getElementById("AddLocal") as HTMLDialogElement
              ).showModal();
            }}
            className="btn items rounded-md btn-outline btn-primary"
            ><BsFillTelephoneOutboundFill className="" /> Add Local </button>
        </div>
      </div>
      <div className="divider"></div>
      <div className="overflow-x-auto w-11/12 mx-auto">
        <table className="table table-zebra text-center text-lg">
          {/* head */}
          <thead
            className={`${isFetching ? "invisible" : "table-header-group"} text-lg`}
          >
            <tr>
              <th>#</th>
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
                    <FaArrowDown19 className="my-auto mx-2" />
                  ) : (
                    <FaArrowDown91 className="my-auto mx-2" />
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
                    <FaArrowDownAZ className="my-auto mx-2" />
                  ) : (
                    <FaArrowDownZA className="my-auto mx-2" />
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
                    <FaArrowDownAZ className="my-auto mx-2" />
                  ) : (
                    <FaArrowDownZA className="my-auto mx-2" />
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
                    <FaArrowDownAZ className="my-auto mx-2" />
                  ) : (
                    <FaArrowDownZA className="my-auto mx-2" />
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
                    <FaArrowDownAZ className="my-auto mx-2" />
                  ) : (
                    <FaArrowDownZA className="my-auto mx-2" />
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
                <td></td>
                <td></td>
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
                data.data?.map((local_data: any, index: number) => {
                  return (
                    <tr key={index} className="hover:bg-secondary hover:font-semibold hover:text-primary-content">
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
                              setDepartment({department_id:parseInt(local_data.department_id),department_name:local_data.department_name});
                              setBranch({branch_id:parseInt(local_data.branch_id),branch_name:local_data.branch_name});
                              setGroup({group_id:parseInt(local_data.group_id),group_name:local_data.group_name});
                              setLocation({location_id:parseInt(local_data.location_id), location_name:local_data.location_name});
                              setLocal(local_data.local);
                              setGroupFilter(local_data.department_id);
                              setlocationFilter(local_data.branch_id);
                              (
                              document.getElementById(
                                  "EditLocal"
                                ) as HTMLDialogElement
                            ).showModal();

                            }}
                            className="btn btn-outline btn-sm rounded-md btn-accent"
                          >
                            <RiEdit2Fill />
                            Edit
                          </button>
                          <button onClick={() => {
                            setLocal(local_data.local);
                            (
                              document.getElementById(
                                  "RemoveLocal"
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
