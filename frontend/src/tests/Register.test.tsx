import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { BrowserRouter } from "react-router-dom";
import { useGlobalContext } from "../utils/context";
// import { request } from "../utils/axios";
import Register from "../pages/Register";

jest.mock("../utils/context");
jest.mock("../utils/axios");

const mockUseGlobalContext = useGlobalContext as jest.MockedFunction<typeof useGlobalContext>;
// const mockRequestPost = request.post as jest.MockedFunction<typeof request.post>;

describe("Register Component", () => {
  beforeEach(() => {
    mockUseGlobalContext.mockReturnValue({
      displayError: jest.fn(),
      displaySuccess: jest.fn(),
      displayWarning: jest.fn(),
      displayInfo: jest.fn(),
      handleToken: jest.fn(),
      removeToken: jest.fn(),
      token: null,
      handleOTP: jest.fn(),
      removeOTP: jest.fn(),
      otp: 0,
      handleEmail: jest.fn(),
      removeEmail: jest.fn(),
      email: "",
      handleAdmin: jest.fn(),
      removeAdmin: jest.fn(),
      admin: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("shows error when passwords do not match", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/your password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password456" } });

    fireEvent.submit(screen.getByRole("button", { name: /sign up/i }));

    expect(mockUseGlobalContext().displayError).toHaveBeenCalledWith("Passwords dont match");
  });
});