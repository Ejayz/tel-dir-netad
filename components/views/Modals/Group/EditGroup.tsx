"use client";
import { FaPlus } from "react-icons/fa6";
import { Formik, Form , Field} from "formik";
import { TextInput, SelectInput } from "../../../ui/InputFields";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRef, useState } from "react";

interface Select {
  id:string|number,
  placeholder:string
}

export function EditGroupModal({ 
  FetchList, 
  group_id,
  group_name,
  department_name,
  department_id,
  department_list 
}: { 
  FetchList: any ,
  group_id: number,
  group_name: string,
  department_name: string,
  department_id: number,
  department_list:{data:{department_id:number , department_name: string}[]
}}) {

let d_array:Select[] = [];

  let i=0;
  while(i<department_list.data.length){
    d_array.push({id:department_list.data[i].department_id,placeholder:department_list.data[i].department_name})
    i++;
  }
  console.log(d_array);

  const Validation = yup.object({
    group: yup.string()
      .matches(/^[a-zA-Z _()-]+$/, 'Sorry. Only letters, underscore and dash can be used.')
      .required("Empty Name is Invalid"),
  });
 
  const Dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <dialog id="EditGroup" ref={Dialog} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Edit Group</h3>
            <Formik
              enableReinitialize={true}
              initialValues={{
                group: group_name || "",
                department: department_id,
              }}
              onSubmit={async (values, action) => {

                let headersList = {
                  Accept: "*/*",
                  "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                  "Content-Type": "application/json",
                };

                let bodyContent = JSON.stringify({
                  group_id: group_id,
                  group_name: values.group,
                  department_id: values.department,
                });

                let response = await fetch(
                  "/api/authenticated/group/edit_group",
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
                    label="Group Name"
                    name="group"
                    values={values.group}
                    errors={errors.group}
                    placeholder="Group Name"
                    touched={touched.group}
                  ></TextInput>
                  <div className="items-end flex justify-between">
                    <div className="w-4/5 pr-1">
                      <SelectInput
                      handleChange={handleChange}
                      label="Department Name"
                      name="department"
                      values={values.department}
                      errors={errors.department}
                      placeholder="No Department"
                      touched={touched.department}
                      options={d_array}
                      />
                    </div>
                    <div className="place-self-end">
                      <button
                      type="button"
                      onClick={()=>{
                        console.log("Open add Dept.");
                        (
                            document.getElementById(
                              "AddDepartment"
                            ) as HTMLDialogElement
                          ).showModal();
                      }}
                      className="btn btn-outline btn-secondary rounded-md pl-5 "
                      
                      ><FaPlus /></button>
                    </div>
                  </div>
                  <div className="modal-action">
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
                        (
                          document.getElementById(
                            "EditGroup"
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
