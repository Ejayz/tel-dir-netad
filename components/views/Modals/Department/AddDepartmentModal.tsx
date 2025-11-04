"use client";

import { Formik, Form } from "formik";
import { TextInput } from "../../../ui/InputFields";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRef } from "react";

export function AddDepartmentModal({ FetchList }: { FetchList: any }) {
  const departmentValidation = yup.object({
    department: yup.string().required(),
  });

  const AddDepartment = useRef<HTMLDialogElement>(null);

  return (
    <>
      <dialog id="AddDepartment" ref={AddDepartment} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add Department</h3>
          <Formik
            initialValues={{
              department: "",
            }}
            onSubmit={async (values, action) => {
              let headersList = {
                Accept: "*/*",
                "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                "Content-Type": "application/json",
              };

              let bodyContent = JSON.stringify({
                department_name: values.department,
              });

              let response = await fetch(
                "/api/authenticated/department/add_department",
                {
                  method: "POST",
                  body: bodyContent,
                  headers: headersList,
                }
              );

              let data = await response.json();
              console.log(data);
              if (data.status == 200) {
                console.log("Triggerted"); //dafuq? naa man gud triggered na word.
                toast.success(data.statusText);
                AddDepartment.current?.close();
                action.resetForm();
                FetchList();
              } else {
                toast.error(data.statusText);
              }
            }}
            validationSchema={departmentValidation}
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
                    label="Department Name"
                    name="department"
                    values={values.department}
                    errors={errors.department}
                    placeholder="Department Name"
                    touched={touched.department}
                  ></TextInput>

                  <div className="modal-action">
                    <button
                      type="submit"
                      className={`btn btn-outline rounded-md ${
                        !isSubmitting ? "btn-accent" : "btn-disabled"
                      } `}
                    >
                      {!isSubmitting ? (
                        <>Add</>
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
                            "AddDepartment"
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
