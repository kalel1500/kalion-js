// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FModal } from "../src/app/modals/FModal";

const modalId = "test-modal";

function renderModal(): HTMLElement {
    document.body.innerHTML = `
        <div id="${modalId}" class="hidden" aria-hidden="true">
            <h3></h3>
            <input value="initial">
            <div class="fmodal-message-info"><span class="slot"></span></div>
            <div class="fmodal-message-success"><span class="slot"></span></div>
            <div class="fmodal-message-error"><span class="slot"></span></div>
            <div class="fmodal-message-warning"><span class="slot"></span></div>
            <button data-fmodal-confirm="${modalId}">Confirm</button>
            <button data-fmodal-deny="${modalId}">Deny</button>
            <button data-fmodal-cancel="${modalId}">Cancel</button>
        </div>
    `;

    return document.getElementById(modalId)!;
}

describe("FModal instance reuse", () => {
    beforeEach(() => {
        FModal.destroy(modalId);
        renderModal();
    });

    afterEach(() => {
        FModal.destroy(modalId);
        document.body.innerHTML = "";
    });

    it("reuses the instance while using the latest opening context", () => {
        const firstButton = document.createElement("button");
        firstButton.dataset.id = "1";
        const secondButton = document.createElement("button");
        secondButton.dataset.id = "2";
        const renderedIds: string[] = [];

        const first = FModal.show(modalId, {
            onShow: () => renderedIds.push(firstButton.dataset.id!),
        });
        first.hide();

        const second = FModal.show(modalId, {
            onShow: () => renderedIds.push(secondButton.dataset.id!),
        });

        expect(second).toBe(first);
        expect(renderedIds).toEqual(["1", "2"]);
    });

    it("replaces callbacks instead of retaining omitted callbacks", async () => {
        const oldConfirm = vi.fn(() => true);
        const instance = FModal.show(modalId, { onConfirm: oldConfirm });
        instance.hide();

        FModal.show(modalId, {});
        document.querySelector<HTMLButtonElement>(`[data-fmodal-confirm="${modalId}"]`)!.click();
        await vi.waitFor(() => expect(instance.modal.isHidden()).toBe(true));

        expect(oldConfirm).not.toHaveBeenCalled();
    });

    it("recreates only the Flowbite modal when structural options change", () => {
        const instance = FModal.create(modalId, {
            modalOptions: { placement: "top-left" },
        });
        const firstFlowbiteModal = instance.modal;

        const reused = FModal.create(modalId, {
            modalOptions: { placement: "bottom-right" },
        });

        expect(reused).toBe(instance);
        expect(reused.modal).not.toBe(firstFlowbiteModal);
        expect(reused.$modalElement?.classList.contains("justify-end")).toBe(true);
        expect(reused.$modalElement?.classList.contains("items-end")).toBe(true);
        expect(reused.$modalElement?.classList.contains("justify-start")).toBe(false);
    });

    it("composes native Flowbite callbacks with the FModal lifecycle", () => {
        const nativeOnShow = vi.fn();
        const nativeOnHide = vi.fn();
        const onShow = vi.fn();
        const instance = FModal.show(modalId, {
            onShow,
            modalOptions: {
                onShow: nativeOnShow,
                onHide: nativeOnHide,
            },
        });

        instance.hide();

        expect(onShow).toHaveBeenCalledOnce();
        expect(nativeOnShow).toHaveBeenCalledOnce();
        expect(nativeOnHide).toHaveBeenCalledOnce();
        expect(document.querySelector<HTMLInputElement>("input")?.value).toBe("");
    });

    it("cleans visible state and the backdrop when destroyed", () => {
        FModal.show(modalId);

        FModal.destroy(modalId);

        expect(FModal.get(modalId)).toBeUndefined();
        expect(document.body.classList.contains("overflow-hidden")).toBe(false);
        expect(document.querySelector(".bg-dark-backdrop\\/70")).toBeNull();
    });
});


