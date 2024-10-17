import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Homepage from "../app/page";
import { mockCurrentUser } from "../__mocks/user";
import React from "react";

vi.mock("@clerk/nextjs/server", () => {
  const mockedFunction = {
    auth: () =>
      new Promise((resolve) =>
        resolve({ userId: mockCurrentUser().id, ...mockCurrentUser() })
      ),
    ClerkProvider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    useUser: () => ({
      isSignedIn: true,
      user: {
        id: mockCurrentUser().id,
        fullName: "Charles Harris",
      },
    }),
  };

  return mockedFunction;
});

// vi.mock('next/font/google', () => {
//   return {
//     Inter: () => ({ className: 'inter' }),
//   }
// })

test("Home", async () => {
  render(await Homepage());
  expect(screen.getByText("the best Journal app, period.")).toBeTruthy();
});
