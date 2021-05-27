import { useEffect, useState } from "react";
import "./FormBuilder.css";
const payrollQueryForm = require("./assets/payrollEnquiry.json");

function FormBuilder() {
  const [newPayrollQuery, setNewPayrollQuery] = useState({
    queryType: "",
    queryDate: "",
    queryBody: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const mockUserEmail = "mail@example.org";

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewPayrollQuery({ ...newPayrollQuery, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    //wasn't sure what this means: "the submit button should log an html string of an email body that could be sent to the form's recipient"
    window.open(
      `mailto:${mockUserEmail}?subject=${
        payrollQueryForm.title + " - " + newPayrollQuery.queryType
      }&body=${newPayrollQuery.queryBody}`,
      "_blank"
    );
    console.log(`<body>${newPayrollQuery.queryBody}</body>`);
  };

  useEffect(() => {
    const queryTypeRequiresDate =
      newPayrollQuery.queryType === "Missing Expense" ||
      newPayrollQuery.queryType === "Incorrect Pay";

    const queryDateAndBodyValid =
      (newPayrollQuery.queryDate.length > 0) &
      (newPayrollQuery.queryBody.length > 0);

    const queryTypeNoDateRequired =
      !queryTypeRequiresDate & (newPayrollQuery.queryBody.length > 0);

    if (queryTypeRequiresDate & queryDateAndBodyValid) setIsFormValid(true);
    else if (queryTypeNoDateRequired) setIsFormValid(true);
    else setIsFormValid(false);
  }, [newPayrollQuery]);

  return (
    <div className="app-container">
      <header className="form-header" data-testid="header">
        {payrollQueryForm.title ? payrollQueryForm.title : "Untitled Form"}
      </header>
      <form className="form-body" onSubmit={handleFormSubmit}>
        <p className="form-description" data-testid="form-description">
          {payrollQueryForm?.description && payrollQueryForm.description}
        </p>
        <p className="form-query-type-label">
          {payrollQueryForm?.properties.queryType.description}
        </p>
        <select
          className="form-query-select"
          name="queryType"
          onChange={handleFormChange}
          data-testid="queryType"
          required={payrollQueryForm.required.includes("queryType")}
        >
          <option className="form-query-select-default" value="">
            Select an option
          </option>
          {payrollQueryForm.properties.queryType.items.map((item, idx) => {
            return (
              <option key={idx} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        <p>{payrollQueryForm.properties.date.title}</p>
        <input
          className="form-date-select"
          type="date"
          name="queryDate"
          onChange={handleFormChange}
          data-testid="queryDate"
          required={
            newPayrollQuery.queryType === "Missing Expense" ||
            newPayrollQuery.queryType === "Incorrect Pay"
          }
        ></input>
        <p>Query</p>
        <textarea
          className="form-query-body"
          type="text"
          name="queryBody"
          data-testid="queryBody"
          value={newPayrollQuery.queryBody}
          onChange={handleFormChange}
          placeholder="Enter more information here..."
          required={payrollQueryForm.required.includes("queryBody")}
        ></textarea>
        <div className="btn-container">
          {isFormValid ? (
            <button type="submit" data-testid="submit" className="btn-submit">
              Submit
            </button>
          ) : (
            <button
              type="submit"
              data-testid="submit"
              disabled
              className="btn-disabled"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FormBuilder;
