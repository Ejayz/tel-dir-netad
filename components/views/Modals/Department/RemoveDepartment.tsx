"use client";

import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { useRef } from "react";

export function RemoveDepartmentModal({
    FetchList, department_id, department_name }: {
        FetchList: any, department_id: number, department_name?: string
    }) {
    const RemoveDepartment = useRef<HTMLDialogElement>(null);
     // console.log("RemoveDepartment Modal:",department_id,department_name);
    return (
        <>
            <dialog id="RemoveDepartment" ref={RemoveDepartment} className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Do you want to remove:</h3>
                    <p className="py-4 font-semibold">{department_name}</p>
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
                                department_id: department_id,
                                department_name: department_name,
                            });

                            let response = await fetch(
                                "/api/authenticated/department/remove_department",
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
                                RemoveDepartment.current?.close();
                                action.resetForm();
                                FetchList();
                                (
                                    document.getElementById(
                                        "RemoveDepartment"
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
                                                        "RemoveDepartment"
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
