"use client";

import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { useRef } from "react";

export function RemoveUserModal({
    FetchList, uuid, username, branch_id }: {
        FetchList: any, uuid: string, username?: string, branch_id: number
    }) {
    const RemoveUser = useRef<HTMLDialogElement>(null);
    // console.log("RemoveLocation Modal:",uuid,username);
    return (
        <>
            <dialog id="RemoveUser" ref={RemoveUser} className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Do you want to remove user:</h3>
                    <p className="py-4 font-semibold">{username + " ?"}</p>
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
                                uuid: uuid,
                                branch_id: branch_id
                            });

                            let response = await fetch(
                                "/api/authenticated/users/remove_user",
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
                                RemoveUser.current?.close();
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
                                                RemoveUser.current?.close();
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
