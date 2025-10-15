"use client";
import { Formik, Form } from "formik";
import { TextInput } from "../../ui/InputFields";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Dispatch, useRef } from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
export default function UpdateLocationModal({
  location_id,
  setLocationId,
  FetchList
}: {
  location_id: number | undefined;
  setLocationId: any;
  FetchList:any
}) {
  const locationValidation = yup.object({
    location: yup.string().required(),
  });

  const UpdateLocation = useRef<HTMLDialogElement>(null);

  const { data, isFetching, isSuccess, isError } = useQuery({
    queryKey: ["RetrieveLocation", location_id],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        location_id: location_id,
      });

      let response = await fetch("/api/authenticated/retrieve_location", {
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

  console.log(data);
  return (
    <>
      <dialog id="UpdateLocation" ref={UpdateLocation} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add Local</h3>

          <Formik
            initialValues={{
              location: location_id,
              location_name: isError
                ? ""
                : isFetching
                ? ""
                : data.status == 200
                ? data.data[0].location_name
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
                location_id: values.location,
                location_name: values.location_name,
              });

              let response = await fetch(
                "/api/authenticated/location/update_location",
                {
                  method: "POST",
                  body: bodyContent,
                  headers: headersList,
                }
              );

              let data = await response.json();
              console.log(data);
              if (data.status == 200) {
                console.log("Triggerted");
                toast.success(data.statusText);
                UpdateLocation.current?.close();
                action.resetForm();
                setLocationId(null);
                FetchList()
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
                  {isError ? (
                    <></>
                  ) : isFetching ? (
                    <div className="flex flex-col ">
                      <div className="loading-infinity loading text-accent mx-auto"></div>
                      <p className="mx-auto">
                        Please wait while we retrieve relevant data
                      </p>
                    </div>
                  ) : (
                    <TextInput
                      handleChange={handleChange}
                      label="Location Name"
                      name="location_name"
                      values={values.location_name}
                      errors={errors.location_name}
                      placeholder="Location Name"
                      touched={touched.location_name}
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
