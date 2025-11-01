"use client";

import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TextInput, PasswordInput, SelectInput } from "../../ui/InputFields";

export function AddLocalModal() {
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
            onSubmit={async (values) => {}}
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
                    options={[{ id: 1, placeholder: "fdsfds" },{id: 2, placeholder: "test"}]}
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
                    className={`btn ${
                      !isSubmitting ? "btn-neutral" : "btn-disabled"
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
