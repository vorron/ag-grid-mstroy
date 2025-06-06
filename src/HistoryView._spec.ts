import { mount } from "@vue/test-utils";
import HistoryView from "./components/HistoryView.vue";
import { describe, it, expect, beforeEach } from "vitest";
import { HistoryManager } from "./HistoryManager";

describe("HistoryView.vue", () => {
  let wrapper: ReturnType<typeof mount>;
  let mockHistoryManager: HistoryManager;

  beforeEach(() => {
    // Базовый мок HistoryManager
    mockHistoryManager = new HistoryManager;

    wrapper = mount(HistoryView, {
      props: {
        historyManager: mockHistoryManager,
      },
    });
  });

  // it("renders undo/redo buttons", () => {
  //   const buttons = wrapper.findAll("button");
  //   expect(buttons).toHaveLength(2);
  //   expect(buttons[0].text()).toBe("↩");
  //   expect(buttons[1].text()).toBe("↪");
  // });

  // it("enables undo button when canUndo returns true", async () => {
  //   // Переопределяем поведение для конкретного теста
  //   mockHistoryManager.canUndo = () => true;
  //   await wrapper.setProps({ historyManager: mockHistoryManager });

  //   const undoButton = wrapper.findAll("button")[0];
  //   expect(undoButton.attributes("disabled")).toBeUndefined();
  // });

  // it("disables undo button when canUndo returns false", async () => {
  //   mockHistoryManager.canUndo = () => false;
  //   await wrapper.setProps({ historyManager: mockHistoryManager });

  //   const undoButton = wrapper.findAll("button")[0];
  //   expect(undoButton.attributes("disabled")).toBe("");
  // });

  // it("emits undo event when undo button clicked", async () => {
  //   mockHistoryManager.canUndo = () => true;
  //   await wrapper.setProps({ historyManager: mockHistoryManager });

  //   await wrapper.findAll("button")[0].trigger("click");
  //   expect(wrapper.emitted("undo")).toBeTruthy();
  // });

  // it("emits redo event when redo button clicked", async () => {
  //   mockHistoryManager.canRedo = () => true;
  //   await wrapper.setProps({ historyManager: mockHistoryManager });

  //   await wrapper.findAll("button")[1].trigger("click");
  //   expect(wrapper.emitted("redo")).toBeTruthy();
  // });
});
