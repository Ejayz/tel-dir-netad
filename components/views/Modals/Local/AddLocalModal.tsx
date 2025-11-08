"use client";

import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TextInput, PasswordInput, SelectInput } from "../../../ui/InputFields";
import { useQuery } from "@tanstack/react-query";

export function AddLocalModal() {



  // const { error, data, isFetching, isError, isSuccess, refetch } = useQuery({
  //   queryKey: [search, local_sort, group_sort, department_sort, location_sort, branch_sort, page],
  //   queryFn: async () => {
  //     // console.log(page);
  //     let headersList = {
  //       Accept: "*/*",
  //       "User-Agent": "Thunder Client (https://www.thunderclient.com)",
  //       "Content-Type": "application/json",
  //     };
  //     let bodyContent = JSON.stringify({
  //       search: search,
  //       local_sort: local_sort,
  //       group_sort: group_sort,
  //       department_sort: department_sort,
  //       location_sort: location_sort,
  //       branch_sort: branch_sort,
  //       page: page,
  //     });

  //     let response = await fetch("/api/authenticated/local/list_local", {
  //       method: "POST",
  //       headers: headersList,
  //       body: bodyContent,
  //     });
  //     // console.log(response);
  //     let data = await response.json();
  //     console.log(data);
  //     return data;
  //   },
  // });


  return (
    <>
      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add Local</h3>
          <Formik
            initialValues={{
              local: "",
              location: "",
              group: "",
              department: "",
              branch: "",
              new_location: "",
              new_group: "",
              new_department: "",
              new_branch: "",
            }}
            onSubmit={async (values) => { }}
          >
            {({
              values,
              errors,
              handleChange,
              handleSubmit,
              touched,
              isSubmitting,
            }) => (
              <Form className="card-body">
                <fieldset className="fieldset">
                  <TextInput
                    handleChange={handleChange}
                    label="Local"
                    name="local"
                    values={values.local}
                    errors={errors.local}
                    placeholder="Local"
                    touched={touched.local}
                  ></TextInput>
                  <div >
                    <div className="w-50"><SelectInput
                      handleChange={handleChange}
                      label="Group"
                      name="group"
                      values={values.group}
                      errors={errors.group}
                      placeholder="Group"
                      touched={touched.group}
                      options={[{ id: 1, placeholder: "fdsfds" }, { id: 2, placeholder: "test" }]}
                    ></SelectInput></div>

                    <div className="w-50"><SelectInput
                      handleChange={handleChange}
                      label="Location"
                      name="location"
                      values={values.location}
                      errors={errors.location}
                      placeholder="Location"
                      touched={touched.location}
                      options={[{ id: 1, placeholder: "fdsfds" }]}
                    ></SelectInput></div>
                  </div>

                  <SelectInput
                    handleChange={handleChange}
                    label="Department"
                    name="department"
                    values={values.department}
                    errors={errors.department}
                    placeholder="Department"
                    touched={touched.department}
                    options={[{ id: 1, placeholder: "fdsfds" }]}
                  ></SelectInput>
                  <div>
                    <a className="link link-hover">Forgot password?</a>
                  </div>
                  <button
                    type="submit"
                    className={`btn ${!isSubmitting ? "btn-neutral" : "btn-disabled"
                      } mt-4`}
                  >
                    {!isSubmitting ? (
                      <>Submit</>
                    ) : (
                      <div className="loading-infinity loading loading-xl"></div>
                    )}
                  </button>
                </fieldset>
              </Form>
            )}
          </Formik>
          <div className="modal-action">
            <label htmlFor="my_modal_6" className="btn">
              Close!
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
