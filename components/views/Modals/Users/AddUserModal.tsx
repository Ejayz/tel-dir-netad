"use client";

import { Formik, Form } from "formik";
import { TextInput, EmailInput, PasswordInput, SelectInput } from "../../../ui/InputFields";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRef } from "react";
import { FaPlus } from "react-icons/fa6";

interface Select{
    id:number|string;
    placeholder:string;
}

export function AddUserModal({ 
    FetchList,
    branch_data,
 }: { 
    FetchList: any,
    branch_data:{data:{branch_id:number, branch_name:string}[]},
 }) {
  const userValidation = yup.object().shape({
    username: yup.string()
      .matches(/^[a-zA-Z _.-]+$/,'Sorry. Only letters, underscore and dash can be used.')
      .required("Empty Name is Invalid"),
    email: yup.string().email("Invalid email").required("Required"),
    password: yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
    confirmPassword: yup.string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Required"),
    first_name: yup.string().matches(/^[a-zA-Z ]+$/,`Letters and Space only.`).required("Required"),
    middle_name: yup.string().matches(/^[a-zA-Z ]+$/,`Letters and Space only.`).required("Required"),
    last_name: yup.string().matches(/^[a-zA-Z ]+$/,`Letters and Space only.`).required("Required"),
  });

  let b_array:Select[]=[];
  let i = 0;
  while(i<branch_data.data.length){
    b_array.push({id:branch_data.data[i].branch_id.toString(), placeholder:branch_data.data[i].branch_name});
    i++
  }
  const AddUser = useRef<HTMLDialogElement>(null);

  return (
    <>
      <dialog id="AddUser" ref={AddUser} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add User</h3>
          <Formik
            initialValues={{
              username: "",
              password: "",
              confirmPassword: "",
              email: "",
              first_name:"",
              middle_name:"",
              last_name:"",
              branch_id:"",
            }}
            onSubmit={async (values, action) => {
              let headersList = {
                Accept: "*/*",
                "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                "Content-Type": "application/json",
              };

              let bodyContent = JSON.stringify({
                username: values.username,
                password: values.password,
                email: values.email,
                first_name: values.first_name,
                middle_name: values.middle_name,
                last_name: values.last_name,
                branch: values.branch_id,

              });

              let response = await fetch(
                "/api/authenticated/users/add_users",
                {
                  method: "POST",
                  body: bodyContent,
                  headers: headersList,
                }
              );

              let data = await response.json();
              if (data.status == 200) {
                toast.success(data.statusText);
                AddUser.current?.close();
                action.resetForm();
                FetchList();
              } else {
                toast.error(data.statusText);
              }
            }}
            validationSchema={userValidation}
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
                    label="User Name"
                    name="username"
                    values={values.username}
                    errors={errors.username}
                    placeholder="User Name"
                    touched={touched.username}
                ></TextInput>

                <EmailInput
                handleChange={handleChange}
                label="E-mail"
                name="email"
                values={values.email}
                errors={errors.email}
                placeholder="email @ email.com"
                touched={touched.email}
                ></EmailInput>
                <div className="flex">
                    <div className="w-1/3">
                        <TextInput
                        handleChange={handleChange}
                        label="First Name"
                        name="first_name"
                        values={values.first_name}
                        errors={errors.first_name}
                        placeholder="First"
                        touched={touched.first_name}
                        ></TextInput>
                    </div>
                    <div className="w-1/3">
                        <TextInput
                        handleChange={handleChange}
                        label="Middle Name"
                        name="middle_name"
                        values={values.middle_name}
                        errors={errors.middle_name}
                        placeholder="Middle"
                        touched={touched.middle_name}
                        ></TextInput>
                    </div>
                    <div className="w-1/3">
                        <TextInput
                        handleChange={handleChange}
                        label="Last Name"
                        name="last_name"
                        values={values.last_name}
                        errors={errors.last_name}
                        placeholder="Last"
                        touched={touched.last_name}
                        ></TextInput>
                    </div>    
                </div>
                <div className="items-end flex justify-between">
                    <div className="w-4/5 pr-1">
                        <SelectInput
                        handleChange={handleChange}
                        label="Branch Name"
                        name="branch_id"
                        values={values.branch_id}
                        errors={errors.branch_id}
                        placeholder="No Branch"
                        touched={touched.branch_id}
                        options={b_array}
                        />
                    </div>
                    <div className={"place-self-end"}>
                        <button
                        type="button"
                        onClick={()=>{
                        ( 
                            document.getElementById(
                                "AddBranch"
                            ) as HTMLDialogElement
                            ).showModal();
                        }}
                        className="btn btn-outline btn-secondary rounded-md pl-5 "
                        
                        ><FaPlus /></button>
                    </div>
                </div>
                <PasswordInput 
                    handleChange={handleChange}
                    label="Password"
                    name="password"
                    values={values.password}
                    errors={errors.password}
                    placeholder="Password"
                    touched={touched.password}
                ></PasswordInput>
                <PasswordInput 
                    handleChange={handleChange}
                    label="Confirm Passoword"
                    name="confirmPassword"
                    values={values.confirmPassword}
                    errors={errors.confirmPassword}
                    placeholder="Confirm Password"
                    touched={touched.confirmPassword}
                ></PasswordInput>

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
                            "AddUser"
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
