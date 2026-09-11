import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";
import { Label } from "./Label";

describe("Input", () => {
  it("se lie à son Label via htmlFor/id et accepte la saisie", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" />
      </>,
    );

    const input = screen.getByLabelText("Email");
    fireEvent.change(input, { target: { value: "jane@example.com" } });

    expect(input).toHaveValue("jane@example.com");
  });

  it("transmet la ref à l'élément <input> (nécessaire pour react-hook-form)", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
