"use client";
import { FaPlus, FaFilter } from "react-icons/fa6";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TextInput, SelectInput } from "../../../ui/InputFields";
import * as yup from "yup";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface Select {
  id:string|number,
  placeholder:string
}


export function EditLocalModal({
  FetchList,
  group_list,
  group_filter,
  location_filter,
  department_list,
  branch_list,
  location_list,
  local,
  department,
  group,
  branch,
  location,

}: {
  FetchList: any,
  group_list: { data: { group_id: number, group_name: string }[] },
  group_filter: (value:string) => (void);
  location_filter: (value:string) => (void);
  department_list: { data: { department_id: number, department_name: string }[] },
  branch_list: {data:{branch_id: number, branch_name: string}[]},
  location_list: {data:{location_id:number, location_name: string}[]},
  local:number,
  department:{department_id:number, department_name:string},
  group: {group_id:number, group_name:string},
  branch: {branch_id:number, branch_name:string},
  location: {location_id:number, location_name:string},
}) {
  const Validation = yup.object({
      local: yup.string()
        .matches(/^[0-9]+$/, 'Sorry. Only numbers are allowed.')
        .required("Empty Local is Invalid"),
    });

  let d_array:Select[]=[];
  let g_array:Select[]=[];
  let b_array:Select[]=[];
  let l_array:Select[]=[];


  let i=0;
  while(i<department_list.data.length){
    d_array.push({id:department_list.data[i].department_id,placeholder:department_list.data[i].department_name})
    i++;
  }
  i=0;
  while(i<group_list.data.length){
    g_array.push({id:group_list.data[i].group_id,placeholder:group_list.data[i].group_name})
    i++;
  }
  i=0;
  while(i<branch_list.data.length){
    b_array.push({id:branch_list.data[i].branch_id,placeholder:branch_list.data[i].branch_name})
    i++;
  }
  i=0;
  while(i<location_list.data.length){
    l_array.push({id:location_list.data[i].location_id,placeholder:location_list.data[i].location_name})
    i++;
  }
  const Dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <dialog id="EditLocal" ref={Dialog} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Edit Local</h3>
            <Formik
              enableReinitialize={true}
              initialValues={{
                local:local.toString(),
                department: department.department_id,
                group: group.group_id,
                branch:branch.branch_id,
                location:location.location_id,
              }}
              onSubmit={async (values, action) => {

                let headersList = {
                  Accept: "*/*",
                  "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                  "Content-Type": "application/json",
                };

                let bodyContent = JSON.stringify({
                  local_old: local,
                  local_new: values.local,
                  group_id: values.group,
                  location_id:values.location,
                });

                let response = await fetch(
                  "/api/authenticated/local/edit_local",
                  {
                    method: "POST",
                    body: bodyContent,
                    headers: headersList,
                  }
                );

                let data = await response.json();
                if (data.status == 200) {
                  toast.success(data.statusText);
                  Dialog.current?.close();
                  action.resetForm();
                  FetchList();
                } else {
                  toast.error(data.statusText);
                }
              }}
              validationSchema={Validation}
            >
            {({
                values,
                errors,
                handleChange,
                handleSubmit,
                touched,
                isSubmitting,
                resetForm,
              }) => (
              <Form className="card-body">
                <fieldset className="fieldset">
                  <TextInput
                    handleChange={handleChange}
                    label="Local"
                    name="local"
                    values={values.local}
                    errors={errors.local}
                    placeholder="Local"
                    touched={touched.local}
                  ></TextInput>
                  <SelectInput
                    handleChange={(e) =>{
                        handleChange(e);
                        group_filter(e.target.value);
                      }}
                    label="Department Name"
                    name="department"
                    values={values.department}
                    errors={errors.department}
                    placeholder="No Department"
                    touched={touched.department}
                    options={d_array}
                    />
                  <div className="items-end flex justify-between">
                    <div className="w-4/5 pr-1">
                      <SelectInput
                      handleChange={(e) =>{
                        handleChange(e);
                      }}
                      label="Group Name"
                      name="group"
                      values={values.group}
                      errors={errors.group}
                      placeholder="No Group"
                      touched={touched.group}
                      options={g_array}
                      />
                    </div>
                    <div className="place-self-end">
                      <button
                      type="button"
                      onClick={()=>{
                        (
                            document.getElementById(
                              "AddGroup"
                            ) as HTMLDialogElement
                          ).showModal();
                      }}
                      className="btn btn-outline btn-secondary rounded-md pl-5 "
                      
                      ><FaPlus /></button>
                    </div>
                    </div>
                    <SelectInput
                    handleChange={(e) =>{
                        handleChange(e);
                        location_filter(e.target.value);
                      }}
                    label="Branch Name"
                    name="branch"
                    values={values.branch}
                    errors={errors.branch}
                    placeholder="No Branch"
                    touched={touched.branch}
                    options={b_array}
                    />
                  <div className="items-end flex justify-between">
                    <div className="w-4/5 pr-1">
                      <SelectInput
                      handleChange={(e) =>{
                        handleChange(e);
                      }}
                      label="Location Name"
                      name="location"
                      values={values.location}
                      errors={errors.location}
                      placeholder="No Location"
                      touched={touched.location}
                      options={l_array}
                      />
                    </div>
                    <div className="place-self-end">
                      <button
                      type="button"
                      onClick={()=>{
                        (
                            document.getElementById(
                              "AddLocation"
                            ) as HTMLDialogElement
                          ).showModal();
                      }}
                      className="btn btn-outline btn-secondary rounded-md pl-5 "
                      
                      ><FaPlus /></button>
                    </div>
                    </div>
                  <div className="modal-action">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        group_filter(department.department_id.toString());
                        location_filter(branch.branch_id.toString());
                      }}
                      className="btn btn-primary rounded-md"
                      id="Triggers"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className={`btn btn-outline rounded-md ${!isSubmitting ? "btn-accent" : "btn-disabled"
                        } `}
                    >
                      {!isSubmitting ? (
                        <>Done</>
                      ) : (
                        <div className="loading-infinity loading loading-xl"></div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        group_filter("");
                        location_filter("");
                        (
                          document.getElementById(
                            "EditLocal"
                          ) as HTMLDialogElement
                        ).close();
                      }}
                      className="btn btn-neutral rounded-md"
                      id="Triggers"
                    >
                      Cancel
                    </button>
                  </div>
                </fieldset>
              </Form>
            )}
          </Formik>
          
        </div>
      </dialog>
    </>
  );
}
