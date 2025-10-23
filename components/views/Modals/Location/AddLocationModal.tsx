"use client";

import { Formik, Form } from "formik";
import { TextInput } from "../../../ui/InputFields";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRef } from "react";
export function AddLocationModal({ FetchList }: { FetchList: any }) {
  const locationValidation = yup.object({
    location: yup.string().required(),
  });

  const AddLocation = useRef<HTMLDialogElement>(null);

  return (
    <>
      <dialog id="AddLocation" ref={AddLocation} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add Local</h3>
          <Formik
            initialValues={{
              location: "",
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
                AddLocation.current?.close();
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
