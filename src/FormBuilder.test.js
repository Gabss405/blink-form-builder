import FormBuilder from "./FormBuilder";
import { render, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
const payrollQueryForm = require("./assets/payrollEnquiry.json");

beforeEach(cleanup);

describe("<FormBuilder> rendering", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<FormBuilder />);
    expect(asFragment(<FormBuilder />)).toMatchSnapshot();
  });
  it("renders header, main description, query type and date title from JSON", () => {
    const { getByTestId, getByText } = render(<FormBuilder />);
    expect(getByTestId("header")).toHaveTextContent(payrollQueryForm.title);
    expect(getByText(payrollQueryForm.description)).toBeInTheDocument();
    expect(
      getByText(payrollQueryForm.properties.queryType.description)
    ).toBeInTheDocument();
    expect(
      getByText(payrollQueryForm.properties.date.title)
    ).toBeInTheDocument();
  });
  it("requires same fields as in JSON document ", () => {
    const { getByTestId } = render(<FormBuilder />);
    payrollQueryForm.required.forEach((item) => {
      expect(getByTestId(item)).toBeRequired();
    });
  });
  it("submit button should be disabled by default", () => {
    const { getByTestId } = render(<FormBuilder />);
    expect(getByTestId("submit")).toBeDisabled();
  });
});

describe("<FormBuilder> validation", () => {
  it("renders submit button disabled if fields are required", async () => {
    const { getByTestId, getByText } = render(<FormBuilder />);

    userEvent.selectOptions(getByTestId("queryType"), [
      getByText("Missing Expense"),
    ]);
    userEvent.type(getByTestId("queryBody"), "Hello World");
    expect(getByTestId("submit")).toBeDisabled();

    userEvent.selectOptions(getByTestId("queryType"), [
      getByText("Change of Bank Details"),
    ]);
    expect(getByTestId("submit")).not.toBeDisabled();
  });
});

describe("<FormBuilder> submission", () => {
  it("submits form if form values are valid ", async () => {
    const { getByTestId, getByText } = render(<FormBuilder />);
    console.log = jest.fn();
    window.open = jest.fn();

    userEvent.selectOptions(getByTestId("queryType"), [
      getByText("Change of Address"),
    ]);
    userEvent.click(getByTestId("queryBody"));
    userEvent.type(getByTestId("queryBody"), "Hello World");
    userEvent.click(getByTestId("submit"));

    expect(getByTestId("submit")).not.toBeDisabled();
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(`<body>Hello World</body>`);
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(
      `mailto:mail@example.org?subject=${
        payrollQueryForm.title + " - " + "Change of Address"
      }&body=Hello World`,
      "_blank"
    );
  });
});
