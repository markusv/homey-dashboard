import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

const Placeholder = ({ title }) => <h1>{title}</h1>;

describe("dashboard routes", () => {
  it("renders the stue route", () => {
    const router = createMemoryRouter(
      [{ path: "/", element: <Placeholder title="Stue" /> }],
      { initialEntries: ["/"] }
    );

    render(<RouterProvider router={router} />);
    expect(screen.getByText("Stue")).toBeInTheDocument();
  });

  it("renders the entre route", () => {
    const router = createMemoryRouter(
      [{ path: "/entre", element: <Placeholder title="Entre" /> }],
      { initialEntries: ["/entre"] }
    );

    render(<RouterProvider router={router} />);
    expect(screen.getByText("Entre")).toBeInTheDocument();
  });
});
