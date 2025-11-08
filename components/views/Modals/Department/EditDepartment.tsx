"use client";

import { Formik, Form } from "formik";
import { TextInput } from "../../../ui/InputFields";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRef } from "react";

export function EditDepartmentModal({
    FetchList,
    department_id,
    department_name
}: {
    FetchList: any,
    department_id: number,
    department_name: string
}) {
    const departmentValidation = yup.object({
        department: yup.string()
            .matches(/^[a-zA-Z_-]+$/,'Sorry. Only letters underscore and dash can be used.')
            .required("Empty Name is Invalid"),
    });

    const EditDepartment = useRef<HTMLDialogElement>(null);

    return (
        <>
            <dialog id="EditDepartment" ref={EditDepartment} className="modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Edit Department</h3>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            department: department_name || "",
                        }}
                        onSubmit={async (values, action) => {
                            let headersList = {
                                Accept: "*/*",
                                "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                                "Content-Type": "application/json",
                            };

                            let bodyContent = JSON.stringify({
                                department_id: department_id.toString(),
                                department_name: values.department,
                            });

                            let response = await fetch(
                                "/api/authenticated/department/edit_department",
                                {
                                    method: "POST",
                                    body: bodyContent,
                                    headers: headersList,
                                }
                            );

                            let data = await response.json();
                            switch (data.status) {
                                case 200:
                                    toast.success(data.statusText);
                                    EditDepartment.current?.close();
                                    action.resetForm();
                                    FetchList();
                                    break;
                                case 501:
                                    toast.error(data.statusText);
                                    break;
                                default:
                                    toast.error(data.statusText);
                                    break;
                            }
                        }}
                        validationSchema={departmentValidation}
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
                                        label="Department Name"
                                        name="department"
                                        values={values.department}
                                        errors={errors.department}
                                        placeholder="Department Name"
                                        touched={touched.department}
                                    ></TextInput>

                                    <div className="modal-action">
                                        <button
                                            type="submit"
                                            className={`btn btn-outline rounded-md ${!isSubmitting ? "btn-accent" : "btn-disabled"
                                                } `}
                                        >
                                            {!isSubmitting ? (
                                                <>Done</>
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
                                                        "EditDepartment"
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
