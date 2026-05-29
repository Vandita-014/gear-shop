import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SizeSelector } from "./SizeSelector";
import type { SizeOption } from "../../data/variants";

const sizes: SizeOption[] = [
  { label: "S", stock: 3, state: "in_stock" },
  { label: "M", stock: 2, state: "low_stock" },
  { label: "L", stock: 0, state: "sold_out" },
];

describe("SizeSelector", () => {
  it("renders size options and disables sold-out sizes", () => {
    render(<SizeSelector sizes={sizes} value="M" onChange={vi.fn()} />);

    expect(screen.getByRole("radio", { name: "S" }).disabled).toBe(false);
    expect(screen.getByRole("radio", { name: "M" }).disabled).toBe(false);
    expect(screen.getByRole("radio", { name: "L" }).disabled).toBe(true);
    expect(screen.getByText("Only 2 left in size M")).toBeDefined();
  });

  it("calls onChange when a selectable size is clicked", () => {
    const onChange = vi.fn();
    render(<SizeSelector sizes={sizes} value="S" onChange={onChange} />);

    fireEvent.click(screen.getByRole("radio", { name: "M" }));
    expect(onChange).toHaveBeenCalledWith("M");
  });

  it("does not call onChange for a sold-out size", () => {
    const onChange = vi.fn();
    render(<SizeSelector sizes={sizes} value="S" onChange={onChange} />);

    fireEvent.click(screen.getByRole("radio", { name: "L" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
