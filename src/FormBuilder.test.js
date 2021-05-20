import FormBuilder from "./FormBuilder";
import { render, cleanup, fireEvent, screen } from "@testing-library/react";
const payrollQueryForm = require("./assets/payrollEnquiry.json");

beforeEach(cleanup);

test("should take a snapshot", () => {
  const { asFragment } = render(<FormBuilder />);
  expect(asFragment(<FormBuilder />)).toMatchSnapshot();
});

test("should render form title from JSON", () => {
  const { getByTestId } = render(<FormBuilder />);
  expect(getByTestId("header")).toHaveTextContent(payrollQueryForm.title);
});

//should render form description
//should render query options

test("submit button should be disabled by default", () => {
  const { getByTestId } = render(<FormBuilder />);
  expect(getByTestId("submit")).toBeDisabled();
});

test("required fields are imported correctly from JSON ", () => {
  const { getByTestId } = render(<FormBuilder />);
  payrollQueryForm.required.forEach((item) => {
    expect(getByTestId(item)).toBeRequired();
  });
});
