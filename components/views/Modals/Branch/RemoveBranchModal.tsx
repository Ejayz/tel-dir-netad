"use client";

import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { useRef } from "react";

export function RemoveBranchModal({
    FetchList, branch_id, branch_name }: {
        FetchList: any, branch_id: number, branch_name?: string
    }) {
    const RemoveBranch = useRef<HTMLDialogElement>(null);
     // console.log("RemoveBranch Modal:",branch_id,branch_name);
    return (
        <>
            <dialog id="RemoveBranch" ref={RemoveBranch} className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Do you want to remove:</h3>
                    <p className="py-4 font-semibold">{branch_name}</p>
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
                                branch_id: branch_id,
                                branch_name: branch_name,
                            });

                            let response = await fetch(
                                "/api/authenticated/branch/remove_branch",
                                {
                                    method: "POST",
                                    body: bodyContent,
                                    headers: headersList,
                                }
                            );

                            let data = await response.json();
                            // console.log(data);
                            if (data.status == 200) {
                                toast.success(data.statusText);
                                RemoveBranch.current?.close();
                                action.resetForm();
                                FetchList();
                                (
                                    document.getElementById(
                                        "RemoveBranch"
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
                                                        "RemoveBranch"
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
