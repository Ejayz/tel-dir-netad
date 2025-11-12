"use client";

import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { useRef } from "react";

export function RemoveLocationModal({
    FetchList, location_id, location_name }: {
        FetchList: any, location_id: number, location_name?: string
    }) {
    const RemoveLocation = useRef<HTMLDialogElement>(null);
     // console.log("RemoveLocation Modal:",location_id,location_name);
    return (
        <>
            <dialog id="RemoveLocation" ref={RemoveLocation} className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Do you want to remove:</h3>
                    <p className="py-4 font-semibold">{location_name + " ?"}</p>
                    <Formik
                        initialValues={{
                        }}
                        onSubmit={async (values, action) => {
                            let headersList = {
                                Accept: "*/*",
                                "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                                "Content-Type": "application/json",
                            };

                            let bodyContent = JSON.stringify({
                                location_id: location_id
                            });

                            let response = await fetch(
                                "/api/authenticated/location/remove_location",
                                {
                                    method: "POST",
                                    body: bodyContent,
                                    headers: headersList,
                                }
                            );

                            let data = await response.json();
                            // console.log(data);
                            if (data.status == 200) {
                                console.log("Triggerted"); //dafuq? naa man gud triggered na word.
                                toast.success(data.statusText);
                                RemoveLocation.current?.close();
                                action.resetForm();
                                FetchList();
                                (
                                    document.getElementById(
                                        "RemoveLocation"
                                    ) as HTMLDialogElement
                                ).close();

                            } else {
                                toast.error(data.statusText);
                            }
                        }}
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
                                    <div className="modal-action">
                                        <button
                                            type="submit"
                                            className={`btn btn-outline rounded-md ${!isSubmitting ? "btn-error" : "btn-disabled"
                                                } `}
                                        >
                                            {!isSubmitting ? (
                                                <>Delete</>
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
                                                        "RemoveLocation"
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
