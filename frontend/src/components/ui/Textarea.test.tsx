import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Label } from "./Label";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("se lie à son Label via htmlFor/id et accepte la saisie", () => {
    render(
      <>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" />
      </>,
    );

    const textarea = screen.getByLabelText("Message");
    fireEvent.change(textarea, { target: { value: "Bonjour." } });

    expect(textarea).toHaveValue("Bonjour.");
  });

  it("transmet la ref à l'élément <textarea>", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
