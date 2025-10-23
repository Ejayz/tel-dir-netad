"use client";

import { Formik, Form } from "formik";
import { TextInput } from "../../../ui/InputFields";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRef } from "react";
export function AddGroupModal({ FetchList }: { FetchList: any }) {
  const locationValidation = yup.object({
    group: yup.string().required(),
  });

  const Dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <dialog id="AddGroup" ref={Dialog} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add Group</h3>
          <Formik
            initialValues={{
              group: "",
            }}
            onSubmit={async (values, action) => {


              console.log("Ok")
              let headersList = {
                Accept: "*/*",
                "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                "Content-Type": "application/json",
              };

              let bodyContent = JSON.stringify({
                group_name: values.group,
              });

              let response = await fetch(
                "/api/authenticated/group/add_group",
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
                Dialog.current?.close();
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
                    label="Group Name"
                    name="group"
                    values={values.group}
                    errors={errors.group}
                    placeholder="Group Name"
                    touched={touched.group}
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
                            "AddGroup"
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
