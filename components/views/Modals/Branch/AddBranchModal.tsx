"use client";

import { Formik, Form } from "formik";
import { TextInput } from "../../../ui/InputFields";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRef } from "react";

export function AddBranchModal({ FetchList }: { FetchList: any }) {
  const locationValidation = yup.object({
    branch_name: yup.string().required(),
  });

  const AddBranch = useRef<HTMLDialogElement>(null);

  return (
    <>
      <dialog id="AddBranch" ref={AddBranch} className="z-0 modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add Branch</h3>
          <Formik
            initialValues={{
              branch_name: "",
            }}
            onSubmit={async (values, action) => {
              let headersList = {
                Accept: "*/*",
                "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                "Content-Type": "application/json",
              };

              let bodyContent = JSON.stringify({
                branch_name: values.branch_name,
              });

              let response = await fetch("/api/authenticated/branch/add", {
                method: "POST",
                body: bodyContent,
                headers: headersList,
              });

              let data = await response.json();
  
              if (data.status == 200) {
                console.log("Triggerted");
                toast.success(data.statusText);
                AddBranch.current?.close();
                action.resetForm();
                FetchList();
              } else {
                action.setErrors({ branch_name: data.statusText });
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
                    label="Branch Name"
                    name="branch_name"
                    values={values.branch_name}
                    errors={errors.branch_name}
                    placeholder="Branch Name"
                    touched={touched.branch_name}
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
                            "AddLocation"
                          ) as HTMLDialogElement
                        ).close();
                      }}
                      className="rounded-md btn btn-neutral"
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
