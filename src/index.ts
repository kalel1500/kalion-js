// Import styles to compile
import "./styles";

// Added: Actual Bootstrap JavaScript dependency
import "bootstrap";

// Added: Popper.js dependency for popover support in Bootstrap
import "@popperjs/core";

// Package exports
export * from "./_types";
export * from "./dates";
export * from "./ddd";
export * from "./helpers";
export * from "./modals";
export * from "./notifications";
export * from "./providers";
export * from "./routing";
export * from "./storage";
export * from "./tables";
export * from "./tests";
export * from "./translation";
export * from "./websockets";