"use client";

import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { useRef } from "react";

export function RemoveGroupModal({
    FetchList, group_id, group_name }: {
        FetchList: any, group_id: number, group_name?: string
    }) {
    const RemoveGroup = useRef<HTMLDialogElement>(null);
     // console.log("RemoveGroup Modal:",group_id,group_name);
    return (
        <>
            <dialog id="RemoveGroup" ref={RemoveGroup} className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Do you want to remove:</h3>
                    <p className="py-4 font-semibold">{group_name + " ?"}</p>
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
                                group_id: group_id
                            });

                            let response = await fetch(
                                "/api/authenticated/group/remove_group",
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
                                RemoveGroup.current?.close();
                                action.resetForm();
                                FetchList();
                                (
                                    document.getElementById(
                                        "RemoveGroup"
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
                                                        "RemoveGroup"
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
