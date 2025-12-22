"use client";

import { Formik, Form } from "formik";
import { TextInput, SelectInput } from "../../../ui/InputFields";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRef } from "react";
import { FaPlus } from "react-icons/fa6";

interface Select {
  id:string|number,
  placeholder:string
}

export function EditLocationModal({ 
  FetchList,
  location_id,
  location_name, 
  branch_id, 
  branch_data, 
  Admin 
}: { 
  FetchList: any , 
  location_id:number, 
  location_name: string, 
  branch_id:number,
  branch_data:{data:{branch_id:number, branch_name:string}[]}, 
  Admin?:boolean
}) { 
  const locationValidation = yup.object({
    location: yup.string().required(),
  });
  let isAdmin = false;
  if(Admin)isAdmin = true;
  let b_array:Select[]=[];
  let i = 0;
  while(i<branch_data.data.length){
    b_array.push({id:branch_data.data[i].branch_id.toString(), placeholder:branch_data.data[i].branch_name});
    i++
  }
  const EditLocation = useRef<HTMLDialogElement>(null);

  return (
    <>
      <dialog id="EditLocation" ref={EditLocation} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Edit Location</h3>
          <Formik
           enableReinitialize={true}
            initialValues={{
              location: location_name || "",
              branch: branch_id,
            }}
            onSubmit={async (values, action) => {
              let headersList = {
                Accept: "*/*",
                "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                "Content-Type": "application/json",
              };

              let bodyContent = JSON.stringify({
                location_id: location_id,
                location_name: values.location,
                branch: values.branch,
              });

              let response = await fetch(
                "/api/authenticated/location/edit_location",
                {
                  method: "POST",
                  body: bodyContent,
                  headers: headersList,
                }
              );

              let data = await response.json();
              console.log(data);
              if (data.status == 200) {
                toast.success(data.statusText);
                EditLocation.current?.close();
                action.resetForm();
                FetchList();
              } else {
                toast.error(data.statusText);
              }
            }}
            validationSchema={locationValidation}
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
                    label="Location Name"
                    name="location"
                    values={values.location}
                    errors={errors.location}
                    placeholder="Location Name"
                    touched={touched.location}
                  ></TextInput>
                  <div className="items-end flex justify-between">
                    <div className="w-4/5 pr-1">
                      <SelectInput
                      handleChange={handleChange}
                      label="Branch Name"
                      name="branch"
                      values={values.branch}
                      errors={errors.branch}
                      placeholder="No Branch"
                      touched={touched.branch}
                      options={b_array}
                      />
                    </div>
                    <div className={isAdmin?("place-self-end"):("hidden place-self-end")}>
                      <button
                      type="button"
                      onClick={()=>{
                        if(!isAdmin) return null;
                        ( 
                            document.getElementById(
                              "EditBranch"
                            ) as HTMLDialogElement
                          ).showModal();
                      }}
                      className="btn btn-outline btn-secondary rounded-md pl-5 "
                      
                      ><FaPlus /></button>
                    </div>
                  </div>
                  <div className="modal-action" >
                    <button
                      type="submit"
                      className={`btn btn-outline rounded-md ${
                        !isSubmitting ? "btn-accent" : "btn-disabled"
                      } `}
                    >
                      {!isSubmitting ? (
                        <>Edit</>
                      ) : (
                        <div className="loading-infinity loading loading-xl"></div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if(isAdmin)
                        resetForm();
                        (
                          document.getElementById(
                            "EditLocation"
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
