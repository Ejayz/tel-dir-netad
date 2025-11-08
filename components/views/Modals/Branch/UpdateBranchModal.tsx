"use client";
import { Formik, Form } from "formik";
import { TextInput } from "../../../ui/InputFields";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Dispatch, useRef } from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
export default function UpdateBranchModal({
  data_id,
  setId,
  FetchList,
}: {
  data_id: number | undefined;
  setId: any;
  FetchList: any;
}) {
  const locationValidation = yup.object({
    branch_name: yup.string().required("Branch Name is required."),
  });

  const UpdateLocation = useRef<HTMLDialogElement>(null);

  const { data, isFetching, isSuccess, isError } = useQuery({
    queryKey: ["RetrieveLocation", data_id],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        location_id: data_id,
      });

      let response = await fetch("/api/authenticated/branch/retrieve_branch", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      let data = await response.json();

      if (data.status !== 200) {
        return Promise.resolve({ data });
      } else {
        return data;
      }
    },
  });

  return (
    <>
      <dialog id="UpdateLocation" ref={UpdateLocation} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Update Branch</h3>

          <Formik
            initialValues={{
              branch_id: data_id,
              branch_name: isError
                ? ""
                : isFetching
                ? ""
                : data.status == 200
                ? data.data[0].branch_name
                : "",
            }}
            enableReinitialize
            onSubmit={async (values, action) => {
              let headersList = {
                Accept: "*/*",
                "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                "Content-Type": "application/json",
              };

              let bodyContent = JSON.stringify({
                branch_id: values.branch_id,
                branch_name: values.branch_name,
              });

              let response = await fetch(
                "/api/authenticated/branch/update_branch",
                {
                  method: "POST",
                  body: bodyContent,
                  headers: headersList,
                }
              );

              let data = await response.json();
              if (data.status == 200) {
                toast.success(data.statusText);
                UpdateLocation.current?.close();
                action.resetForm();
                setId(null);
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
                  {isError ? (
                    <></>
                  ) : isFetching ? (
                    <div className="flex flex-col ">
                      <div className="mx-auto loading-infinity loading text-accent"></div>
                      <p className="mx-auto">
                        Please wait while we retrieve relevant data
                      </p>
                    </div>
                  ) : (
                    <TextInput
                      handleChange={handleChange}
                      label="Branch Name"
                      name="branch_name"
                      values={values.branch_name}
                      errors={errors.branch_name}
                      placeholder="Branch Name"
                      touched={touched.branch_name}
                    ></TextInput>
                  )}

                  <div className="modal-action">
                    <button
                      type="submit"
                      className={`btn btn-outline rounded-md ${
                        !isSubmitting ? "btn-accent" : "btn-disabled"
                      } `}
                    >
                      {!isSubmitting ? (
                        <>Update</>
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
                            "UpdateLocation"
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
