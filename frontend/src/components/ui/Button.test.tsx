import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("est un <button type=\"button\"> par défaut et déclenche onClick", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Cliquer</Button>);

    const button = screen.getByRole("button", { name: "Cliquer" });
    expect(button).toHaveAttribute("type", "button");

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("accepte type=\"submit\" pour les formulaires", () => {
    render(<Button type="submit">Envoyer</Button>);

    expect(screen.getByRole("button", { name: "Envoyer" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("respecte disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Indisponible
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Indisponible" });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("transmet la ref à l'élément <button>", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
