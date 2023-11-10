// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import "@testing-library/jest-dom";
import "jest-styled-components";
import { vi } from "vitest";
globalThis.jest = vi;
