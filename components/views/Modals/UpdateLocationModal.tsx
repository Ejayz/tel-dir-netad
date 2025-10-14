"use client";
import { Formik, Form } from "formik";
import { TextInput } from "../../ui/InputFields";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Dispatch, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
export default function UpdateLocationModal({
  location_id,
  setLocationId,
}: {
  location_id: number | undefined;
  setLocationId: any;
}) {
  const locationValidation = yup.object({
    location: yup.string().required(),
  });

  const UpdateLocation = useRef<HTMLDialogElement>(null);
  console.log(location_id);
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

      return data;
    },
  });

  return (
    <>
      <dialog id="UpdateLocation" ref={UpdateLocation} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add Local</h3>
          <Formik
            initialValues={{
              location: location_id,
            }}
            onSubmit={async (values, action) => {
              let headersList = {
                Accept: "*/*",
                "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                "Content-Type": "application/json",
              };

              let bodyContent = JSON.stringify({
                location: values.location,
              });

              let response = await fetch(
                "/api/authenticated/location/add_location",
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
                  {isError ? <></> : isFetching ? <></> : <></>}

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
